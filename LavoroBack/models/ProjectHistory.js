const mongo = require('mongoose');
const Schema = mongo.Schema;
const ProjectHistory = new Schema(
{
    project_id: { type: mongoose.Schema.Types.UUID, required: true },
    changed_by: { type: mongoose.Schema.Types.UUID, required: true },
    change_type: { 
        type: String, 
        enum: ['Status Update', 'Deadline Change', 'Description Update'], 
        required: true 
    },
    old_value: { type: String, required: true },
    new_value: { type: String, required: true },
    changed_at: { type: Date, default: Date.now }
    });
module.exports = mongo.model('projectHistory', ProjectHistory)