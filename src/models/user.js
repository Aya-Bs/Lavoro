const mongo = require('mongoose');
const Schema = mongo.Schema;

const User = new Schema({
    id: {
        type: mongoose.Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password_hash: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["Admin", "Project Manager", "Team Manager", "Team Member"],
        required: true,
      },
      image: {
        type: String, // URL de l'image
      },
      phone_number: {
        type: Number,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
      last_activity: {
        type: Date,
      },
      is_active: {
        type: Boolean,
        default: true,
      },
    
    });

module.exports = mongo.model('user', User);
