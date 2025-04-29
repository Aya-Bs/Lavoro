const express = require('express');
const router = express.Router();
const taskAssignmentController = require('../controllers/taskAssignmentController');
const { body, query } = require('express-validator');
const {validate1} = require('../middleware/validate1');

router.post('/assign', 
    validate1([
        body('taskId').isMongoId(),
        body('teamId').isMongoId()
    ]),
    taskAssignmentController.assignTask
);

router.get('/best-match', 
    validate1([
        query('taskId').isMongoId(),
        query('teamId').isMongoId()
    ]),
    taskAssignmentController.getBestMatch
);

module.exports = router;