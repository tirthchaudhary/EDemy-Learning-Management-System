const userModel = require('../model/User.model.js');
const { generateToken } = require('../utils/generateToken.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail.js');


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (await userModel.findOne({ email })) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });

        const token = generateToken(user._id, user.role);
        res.cookie("token", token);

        return res.status(201).json({
            success: true,
            message: `${name} registered successfully!`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl
            },
            token: token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or sign up" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, error: "Invalid password,try again" });
        }

        const token = generateToken(user._id, user.role);
        res.cookie("token", token);


        return res.status(200).json({
            success: true,
            message: 'Welcome back!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl
            },
            token: token,
        });


    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, imageUrl } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, imageUrl },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: "Both are required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "current password is wrong" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "No account exists with this email" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) requested a password reset.\n\nPlease click on the link below or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis link is valid only for 15 minutes. If you did not request this, please ignore this email.`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-corners: 8px;">
                <h2 style="color: #4f46e5; text-align: center;">EDemy Password Reset</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your EDemy account. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #e11d48; font-weight: bold;">⚠️ Note: This link is valid only for 15 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b;">If the button above doesn't work, copy and paste the following link into your web browser:</p>
                <p style="font-size: 12px; color: #4f46e5; word-break: break-all;">${resetUrl}</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'EDemy Password Reset request',
                message,
                html
            });
            res.status(200).json({ success: true, message: "Reset link sent to your email!" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, error: "Email could not be sent. Try again." });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means greater than (expiry is in the future)
        })

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful! Please log in." });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword,
    forgotPassword,
    resetPassword
}; 
