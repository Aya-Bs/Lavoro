const express = require('express');
const router = express.Router();

const { getFile ,uploadFile,shareFile, getSharedFiles , getFileDetails} = require('../controllers/fileController');
const authenticateUser = require('../middleware/mailAuth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// File upload
router.post('/upload', uploadFile);

// File sharing
router.post('/share/:fileId', shareFile);
router.get('/shared', getSharedFiles);

// File access
router.get('/file/:fileId', getFile);
router.get('/:fileId/details', getFileDetails);


module.exports = router;