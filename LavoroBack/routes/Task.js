const express = require('express');
const router = express.Router();
const { seedTasks, seedTaskHistory,getTasksByUser } = require('../controllers/TaskController');
const auth = require('../middleware/authenticatedToken');

const taskController = require('../controllers/TaskController')
const authenticateUser = require('../middleware/mailAuth');

router.post('/createTask', taskController.addTask);
router.get('/',  taskController.getAllTasks);
router.delete('/:taskId', taskController.deleteTask);
router.patch('/:taskId/assign', taskController.assignTask);
router.patch('/:taskId/unassign', taskController.unassignTask);
router.get('/task/:taskId',  taskController.getTaskById);
router.get('/my-tasks', authenticateUser, taskController.getMyTasks);
router.patch('/:taskId/start', authenticateUser, taskController.startTask);
router.patch('/:taskId/complete', authenticateUser, taskController.completeTask);





router.post('/seedtasks', async (req, res) => {
    try {
        await seedTasks();
        res.status(200).json({ message: 'Tasks seeded successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error seeding tasks' });
    }
});

router.post('/seed-task-history', async (req, res) => {
    try {
        await seedTaskHistory();
        res.status(200).json({ message: 'Task history seeded successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error seeding task history' });
    }
});
router.get('/getTasksByUser/:userId', getTasksByUser);
router.get('/my-tasks', auth, taskController.getTasksByUser);


router.patch('/:taskId/status',
    auth, // Protection de la route
    taskController.updateTaskStatus
);

// Route pour tester le système de points
router.post('/test-points-system/:userId',
    auth, // Protection de la route
    taskController.testPointsSystem
);




module.exports = router;