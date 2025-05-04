const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Done'], default: 'Not Started' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    deadline: { type: Date },
    start_date: { type: Date },
    estimated_duration: { type: Number },
    requiredSkills: [{ type: String }],
    tags: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    calendar_dates: { // Nouveau champ pour stocker les dates du calendrier
        start: { type: Date },
        end: { type: Date }
    }
});

module.exports = mongoose.model('Task', TaskSchema);