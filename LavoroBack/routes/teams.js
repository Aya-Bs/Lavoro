const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/createTeam',  teamController.createTeam);
router.get('/getAllTeams',  teamController.getAllTeams);
// Add this to your existing teamRoutes.js
router.get('/teamDetails/:id', teamController.getTeamById);
router.put('/updateTeam/:id', teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);
// Team search route
router.get('/search',  teamController.searchTeams);
module.exports = router;
