const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Team = new Schema({
    name: { type: String, required: true },
    manager_id: { type: mongoose.Schema.Types.UUID, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' }

});
const Te = mongoose.model('team', Team);

module.exports = Te;
