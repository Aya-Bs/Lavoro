const mongo = require('mongoose');
const Schema = mongo.Schema;

const ProjectHistory = new Schema(
  {
    project_id: { 
      type: mongo.Schema.Types.ObjectId, 
      required: true 
    },
    changed_by: { 
      type: mongo.Schema.Types.ObjectId 
    },
    change_type: {
      type: String,
      enum: [
        'Project Created',
        'Status Update',
        'Deadline Change',
        'Start Date Change',
        'Description Update',
        'Budget Update',
        'Manager Changed',
        'Team Changed',
        'Client Updated',
        'Risk Level Updated',
        'Tags Updated',
        'ProjectName Updated',
        'Other Update'
      ],
      required: true,
    },
    old_value: { 
      type: String, 
      required: true 
    },
    new_value: { 
      type: String, 
      required: true 
    },
    changed_at: { 
      type: Date, 
      default: Date.now 
    },
  }
);

module.exports = mongo.model('ProjectHistory', ProjectHistory);