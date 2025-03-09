const mongo = require('mongoose');
const Schema = mongo.Schema;
const Project = new Schema(
{
    name: { type: String, required: true },
    description: { type: String }, // Mongoose utilise String au lieu de "text"
    budget: { type: Number, default: 0 },
    manager_id: { type: mongo.Schema.Types.ObjectId, required: true },
    team_id: { type: mongo.Schema.Types.UUID, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    status: { 
        type: String, 
        enum: ['Not Started', 'In Progress', 'Completed', 'Archived'], 
        default: 'Not Started' 
    },
    ai_predicted_completion: { type: Date },
    ai_predicted_description: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
    
});
module.exports = mongo.model('project', Project);