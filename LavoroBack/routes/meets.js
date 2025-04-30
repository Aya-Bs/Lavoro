const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/MeetingController');
const authMiddleware = require('../middleware/authenticatedToken');

// Routes protégées par authentification
router.use(authMiddleware);

// CRUD des réunions
router.post('/addMeet', meetingController.createMeeting);
router.get('/getAllMeet', meetingController.getAllMeetings);
router.get('/:id', meetingController.getMeetingById);
router.put('/:id', meetingController.updateMeeting);
router.delete('/:id', meetingController.deleteMeeting);

// Récupération des utilisateurs et team managers
router.get('/form-data/users', meetingController.getUsersAndTeamManagers);

module.exports = router;