const taskAssignmentService = require('../services/taskAssignmentService');

async function handleAssignment(taskId, teamId, res) {
    try {
        const matchResult = await taskAssignmentService.findBestMatch(taskId, teamId);
        
        if (!matchResult.bestMatch || matchResult.bestMatch.score < 0.5) {
            return res.status(200).json({
                success: false,
                message: 'No suitable team member found (score < 0.5)',
                data: matchResult
            });
        }
        
        const updatedTask = await taskAssignmentService.assignTaskToMember(
            taskId,
            matchResult.bestMatch.memberId
        );
        
        res.json({
            success: true,
            message: 'Task assigned successfully',
            data: {
                task: updatedTask,
                assignmentDetails: matchResult
            }
        });
    } catch (error) {
        console.error('Assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning task',
            error: error.message
        });
    }
}

exports.assignTask = async (req, res) => {
    await handleAssignment(req.body.taskId, req.body.teamId, res);
};

exports.getBestMatch = async (req, res) => {
    try {
        const result = await taskAssignmentService.findBestMatch(
            req.query.taskId,
            req.query.teamId
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error finding best match',
            error: error.message
        });
    }
};