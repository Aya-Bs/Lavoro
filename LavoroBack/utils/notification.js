const Notification = require('../models/notif'); 

exports.createNotification = async (userId, text, type, taskData = null) => {
  try {
    const notificationData = {
      user_id: userId,
      notification_text: text,
      type: type,
    };

    // Add task data if provided
    if (taskData) {
      notificationData.task_id = taskData._id;
      notificationData.task_title = taskData.title;
      notificationData.task_start_date = taskData.start_date;
      notificationData.task_deadline = taskData.deadline;
      notificationData.task_priority = taskData.priority;
      notificationData.task_status = taskData.status;
    }

    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.createTaskAssignmentNotification = async (userId, task) => {
  const notificationText = `You have been assigned to task: ${task.title}
Start Date: ${task.start_date}
End Date: ${task.deadline}
Priority: ${task.priority}
Status: ${task.status}`;
  
  return this.createNotification(userId, notificationText, 'TASK_ASSIGNMENT', task);
};