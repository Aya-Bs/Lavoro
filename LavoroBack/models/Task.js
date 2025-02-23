const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Tasks = new Schema({
    title: { type: String, required: true },
    description: { type: String }, // "text" n'existe pas en Mongoose, String est suffisant
    project_id: { type: mongoose.Schema.Types.UUID, required: true },
    assigned_to: { type: mongoose.Schema.Types.UUID },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Done'], default: 'Not Started' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    deadline: { type: Date },
    start_date: { type: Date },
    end_date: { type: Date },
    estimated_duration: { type: Number }, // en minutes/heures/jours selon ton besoin
    actual_duration: { type: Number },
    tags: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});
module.exports = mongoose.model('tasks', Tasks);
