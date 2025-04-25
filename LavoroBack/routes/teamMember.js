const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/teamMemberController');

//Récupérer un membre d'équipe par ID
router.get('/getTeamMember/:id', teamMemberController.getTeamMemberById);
router.get('/getAllTeamMembers/:teamId', teamMemberController.getTeamMembersByTeamId);
router.post('/addTeamMembers', teamMemberController.addTeamMember);


module.exports = router;