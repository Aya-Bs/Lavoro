const mongo = require('mongoose');
const Schema = mongo.Schema;

const TeamMember = new Schema({

    team_id: { type: mongo.Schema.Types.ObjectId, required: true, ref: 'team' },
    user_id: { type: mongo.Schema.Types.ObjectId, required: true, ref: 'user' },
    role: { type: String, enum: ['Developer', 'Tester', 'Analyst', 'Designer'], required: true , default: 'Developer' },
    skills: [{ type: mongo.Schema.Types.ObjectId, ref: 'skills' }],
    performance_score: { type: Number, default: 0 },
    completed_tasks_count: { type: Number, default: 0 },
    joined_at: { type: Date, default: Date.now }
    
    });
    module.exports = mongo.model('teamMember', TeamMember);