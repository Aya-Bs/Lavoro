const express = require('express');
const router = express.Router();
const { seedTasks, seedTaskHistory, getTasksByUser } = require('../controllers/TaskController');
const auth = require('../middleware/authenticatedToken');

const taskController = require('../controllers/TaskController')

router.post('/createTask', taskController.addTask);
// Get all tasks with filtering
router.get('/',  taskController.getAllTasks);
  
  // Delete a task
  router.delete('/:taskId', taskController.deleteTask);
  
  // Assign task to team members
  router.patch('/:taskId/assign', taskController.assignTask);
  router.patch('/:taskId/unassign', taskController.unassignTask);

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

router.get('/getTasksList/:userId', taskController.getTasksList);
router.delete('/deleteTask/:id', taskController.deleteTask);



module.exports = router;