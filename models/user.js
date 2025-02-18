const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({


  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password_hash: { type: String, required: true },

  role: { type: mongoose.Schema.Types.ObjectId, ref: 'role', default: null },

  image: { type: String },

  phone_number: { type: Number },

  created_at: { type: Date, default: Date.now },

  updated_at: { type: Date, default: Date.now },

  last_activity: { type: Date, default: Date.now },
  
  is_active: { type: Boolean, default: true },

  verificationToken: {type : String},

  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },  // Assurez-vous que ce champ est bien utilisé partout
  resetPasswordExpires: { type: Date },  // Pareil ici
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;