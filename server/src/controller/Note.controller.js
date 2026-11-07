const Note = require('../model/notes.model');
const Course = require('../model/Course.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary (uses your existing .env keys)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// 1. Upload a Note(Educator only)

const uploadNote = async (req, res) => {
    try {
        const { courseId, title } = req.body;
        const educatorId = req.user?.id || req.user?._id;

        if (!courseId || !title) {
            return res.status(400).json({
                success: false,
                message: "Course ID and Title are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Note file is required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (course.educator.toString() !== educatorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only upload notes to your own courses"
            });
        }

        // Determine file type / extension
        const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase() || 'pdf';
        const fileSize = req.file.size;
        const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);

        // Upload to Cloudinary with local storage fallback
        let fileUrl;

        try {
            // For PDFs, docs, and non-image files, use resource_type: 'raw' so Cloudinary preserves binary file intact
            const cleanOriginalName = path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const customPublicId = isImage
                ? `${cleanOriginalName}-${Date.now()}`
                : `${cleanOriginalName}-${Date.now()}.${ext}`;

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'edemy_notes',
                resource_type: isImage ? 'image' : 'raw',
                public_id: customPublicId
            });
            fileUrl = result.secure_url;

            // Delete local temp file after upload to Cloudinary
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cloudinaryError) {
            console.error("Cloudinary upload failed, falling back to local file storage:", cloudinaryError);
            fileUrl = "uploads/" + req.file.filename;
        }

        // Save note to database
        const newNote = await Note.create({
            courseId,
            title,
            fileUrl,
            fileType: ext,
            fileSize,
            educator: educatorId
        });
        res.status(201).json({
            success: true,
            message: "Note uploaded successfully",
            note: newNote
        });
    } catch (error) {
        console.error("Error in uploadNote:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload note"
        });
    }
}

// 2. Get All Notes For a Course (Public)

const getCourseNotes = async (req, res) => {
    try {
        const { courseId } = req.params;

        const notes = await Note.find({ courseId })
            .populate('educator', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notes
        });
    } catch (error) {
        console.error("Error in getCourseNotes:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch notes"
        });
    }
}

// 3. Delete a Note (Educator Only)

const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const educatorId = req.user?.id || req.user?._id;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            })
        }
        // Verify the logged-in user is the educator who uploaded the note
        if (note.educator.toString() !== educatorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own notes"
            });
        }
        await Note.findByIdAndDelete(noteId);
        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteNote:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete note"
        });
    }
}

// 4. Download Note (Streams file safely with clean filename)
const https = require('https');
const http = require('http');

const downloadNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        const safeTitle = (note.title || 'course-note').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${safeTitle}.${note.fileType || 'pdf'}`;

        // If local storage file
        if (!note.fileUrl.startsWith('http')) {
            const localPath = path.join(__dirname, '..', '..', note.fileUrl);
            return res.download(localPath, filename);
        }

        // If Cloudinary URL, stream directly to client to bypass browser PDF restrictions
        const client = note.fileUrl.startsWith('https') ? https : http;
        client.get(note.fileUrl, (streamRes) => {
            if (streamRes.statusCode >= 300 && streamRes.statusCode < 400 && streamRes.headers.location) {
                return https.get(streamRes.headers.location, (redirectRes) => {
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                    res.setHeader('Content-Type', redirectRes.headers['content-type'] || 'application/octet-stream');
                    redirectRes.pipe(res);
                });
            }

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', streamRes.headers['content-type'] || 'application/octet-stream');
            streamRes.pipe(res);
        }).on('error', (err) => {
            console.error("Stream download error:", err);
            res.redirect(note.fileUrl);
        });

    } catch (error) {
        console.error("Error in downloadNote:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to download note"
        });
    }
};

module.exports = {
    uploadNote,
    getCourseNotes,
    deleteNote,
    downloadNote
};