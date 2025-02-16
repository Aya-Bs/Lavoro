const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
<<<<<<< HEAD

  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password_hash: { type: String, required: true },

  role: { type: Number , required: false },

  image: { type: String },

  phone_number: { type: Number },

  created_at: { type: Date, default: Date.now },

  updated_at: { type: Date, default: Date.now },

  last_activity: { type: Date, default: Date.now },
  
  is_active: { type: Boolean, default: true },

  verificationToken: {type : String},

  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
=======
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  role: { type: Number, required: false },
  image: { type: String },
  phone_number: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_activity: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },  // Assurez-vous que ce champ est bien utilisé partout
  resetPasswordExpires: { type: Date },  // Pareil ici
});

const User = mongoose.model('user', userSchema);
module.exports = User;
>>>>>>> 8f75611c7520dcc56ddcbd67b874a45bafac7fc7
