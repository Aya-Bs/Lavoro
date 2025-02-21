const mongoose = require('mongoose');

const hello = new mongoose.Schema({

  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  phone_number: { type: Number },
});

const hellos = mongoose.model('hello', hello);

module.exports = hellos;