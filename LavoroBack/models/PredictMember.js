
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictMember = new Schema({
    team_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true ,ref: 'user'},
    role: { type: String, enum: ['Developer', 'Tester', 'Analyst', 'Designer'], required: true },
    experience_level: { type: Number, min: 1, max: 3, default: 1 }, // 1=Junior, 2=Mid, 3=Senior
    total_tasks_completed: { type: Number, default: 0 },
       productivity: { type: Number, default: 0 },
    performance_score: { type: Number, min: 0, max: 100, default: 0 },
    rank: { type: Number },          // New field
    predicted_at: { type: Date } ,// New field
    user_name: { type: String },      // New field
    user_image: { type: String },     // New field
}, { timestamps: true });



module.exports = mongoose.model('predictMember', PredictMember);