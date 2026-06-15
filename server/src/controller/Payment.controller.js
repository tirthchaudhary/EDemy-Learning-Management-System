const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../model/Course.model');
const Transaction = require('../model/Transaction.model');

let razorpayInstance = null;
const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || ''
        });
    }
    return razorpayInstance;
};

// 1. Create order
const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Calculate discounted price
        const discount = course.discount || 0;
        const finalPrice = Math.round(course.coursePrice * (1 - (discount / 100)));
        const amountInPaise = finalPrice * 100;

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_course_${courseId.toString().substring(0, 5)}_${Date.now()}`
        };

        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create(options);

        // Pre-create pending transaction log
        await Transaction.create({
            user: userId,
            course: courseId,
            amount: finalPrice,
            paymentId: 'pending',
            orderId: order.id,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseName: course.courseTitle
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Verify payment signature and enroll
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        const userId = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
            return res.status(400).json({ success: false, message: "Missing required payment fields" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            // Enroll student if not already enrolled
            if (!course.enrolledStudent.includes(userId)) {
                course.enrolledStudent.push(userId);
                await course.save();
            }

            // Update transaction record to success
            await Transaction.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id,
                    status: 'success'
                },
                { upsert: true }
            );

            res.status(200).json({
                success: true,
                message: "Payment verified and enrollment successful!"
            });
        } else {
            // Update transaction to failed
            await Transaction.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route: /api/payment/webhook
const handleRazorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // 1. Verify that this request actually came from Razorpay (using webhook signature)
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
            // Webhook is authentic!
            const event = req.body.event; // e.g., 'payment.captured'

            if (event === 'payment.captured') {
                const paymentDetails = req.body.payload.payment.entity;
                const orderId = paymentDetails.order_id;

                // 2. Find the transaction and mark it success
                const transaction = await Transaction.findOneAndUpdate(
                    { orderId: orderId },
                    { status: 'success', paymentId: paymentDetails.id },
                    { new: true }
                );

                if (transaction) {
                    // 3. Enroll the student in the course
                    const course = await Course.findById(transaction.course);
                    if (course && !course.enrolledStudent.includes(transaction.user)) {
                        course.enrolledStudent.push(transaction.user);
                        await course.save();
                    }
                }
            }
            res.status(200).json({ status: 'ok' });
        } else {
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send('Internal Server Error');
    }
};


const testRazorpay = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(400).json({
                success: false,
                message: "Razorpay environment variables are missing on this server",
                key_id_exists: !!keyId,
                key_secret_exists: !!keySecret
            });
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        const order = await razorpay.orders.create({
            amount: 100, // 1 INR
            currency: 'INR',
            receipt: `test_receipt_${Date.now()}`
        });

        res.status(200).json({
            success: true,
            message: "Razorpay connection successful on this server",
            orderId: order.id,
            key_id_mask: keyId.substring(0, 8) + '...'
        });
    } catch (error) {
        console.error("Test Razorpay Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            key_id_exists: !!process.env.RAZORPAY_KEY_ID,
            key_secret_exists: !!process.env.RAZORPAY_KEY_SECRET
        });
    }
};

module.exports = { createOrder, verifyPayment, handleRazorpayWebhook, testRazorpay };
