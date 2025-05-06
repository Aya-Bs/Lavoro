const multer = require('multer');
const FileSharing = require('../models/FileSharing');
const path = require('path');
const fs = require('fs');



const shareFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userIds, permission = 'view', makePublic = false } = req.body;

        const file = await FileSharing.findById(fileId);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check if the requester is the owner
        if (file.owner_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not the owner of this file' });
        }

        // Update sharing settings
        if (makePublic) {
            file.is_public = true;
            file.shared_with = []; // Clear individual shares if making public
        } else if (userIds && userIds.length > 0) {
            // Add new users to share with, avoiding duplicates
            userIds.forEach(userId => {
                if (!file.shared_with.some(share => share.user_id.toString() === userId)) {
                    file.shared_with.push({
                        user_id: userId,
                        permission: permission
                    });
                }
            });
            file.is_public = false;
        }

        await file.save();

        res.json({
            message: 'File sharing updated successfully',
            file
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSharedFiles = async (req, res) => {
    try {
        // Files shared with the current user
        const sharedFiles = await FileSharing.find({
            $or: [
                { 'shared_with.user_id': req.user._id },
                { is_public: true }
            ]
        }).populate('owner_id', 'username email');

        // Files owned by the current user
        const ownedFiles = await FileSharing.find({
            owner_id: req.user._id
        });

        res.json({
            sharedFiles,
            ownedFiles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Configure local storage
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '');
        cb(null, `${Date.now()}_${sanitizedName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        // Optional: Add file type restrictions here if needed
        cb(null, true);
    }
}).single('file');



const uploadFile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const file = req.file;
            const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
            
            // Determine file type
            let fileType = 'other';
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
            const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
            const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
            const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
            const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
            
            if (imageExtensions.includes(fileExtension)) fileType = 'image';
            else if (videoExtensions.includes(fileExtension)) fileType = 'video';
            else if (audioExtensions.includes(fileExtension)) fileType = 'audio';
            else if (documentExtensions.includes(fileExtension)) fileType = 'document';
            else if (archiveExtensions.includes(fileExtension)) fileType = 'archive';

            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

            const newFile = new FileSharing({
                owner_id: req.user._id,
                file_name: file.originalname,
                file_url: fileUrl,
                file_path: file.path,
                file_size: file.size,
                file_extension: fileExtension,
                file_type: fileType
            });

            await newFile.save();

            res.status(201).json({
                message: 'File uploaded successfully',
                file: newFile
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// The shareFile, getSharedFiles functions remain the same as in your original code

const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await FileSharing.findById(fileId);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check permissions
        const isOwner = file.owner_id.toString() === req.user._id.toString();
        const isShared = file.shared_with.some(share => share.user_id.toString() === req.user._id.toString());
        const isPublic = file.is_public;

        if (!isOwner && !isShared && !isPublic) {
            return res.status(403).json({ error: 'You do not have permission to access this file' });
        }

        if (req.query.download === 'true') {
            if (!fs.existsSync(file.file_path)) {
                return res.status(404).json({ error: 'File not found on server' });
            }
            
            res.download(file.file_path, file.file_name);
        } else {
            res.json({
                file,
                downloadUrl: `${req.protocol}://${req.get('host')}/api/files/${fileId}?download=true`
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getFileDetails = async (req, res) => {
    try {
      const { fileId } = req.params;
      const file = await FileSharing.findById(fileId)
        .populate('owner_id', 'firstName lastName email image')
        .populate('shared_with.user_id', 'firstName lastName email image');
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Check permissions
      const isOwner = file.owner_id._id.toString() === req.user._id.toString();
      const isShared = file.shared_with.some(share => 
        share.user_id._id.toString() === req.user._id.toString()
      );
      const isPublic = file.is_public;
  
      if (!isOwner && !isShared && !isPublic) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      res.json({ file });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { uploadFile ,shareFile, getSharedFiles , getFile , getFileDetails};



