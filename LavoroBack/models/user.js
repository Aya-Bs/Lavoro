const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  firstName: { type: String, required: true },

  lastName: { type: String},

  email: { type: String, required: true, unique: true },

  password_hash: { type: String,  },

  // role: { type: Number , required: false },
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

  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  provider: {
    type: String,
   
    enum: ["Google","Microsoft", "GitHub"], // Tu peux ajouter d'autres providers ici
  },
  provider_id: {
    type: String,
   
  },

});

const User = mongoose.model('user', userSchema);

module.exports = User;