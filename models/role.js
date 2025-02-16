const mongo = require('mongoose');
const Schema = mongo.Schema;

const Role = new Schema({
  RoleID: {
    type: mongoose.Schema.Types.UUID,
    default: () => new mongoose.Types.UUID(),
<<<<<<< HEAD
=======

    type: mongo.Schema.Types.UUID,
    default: () => new mongo.Types.UUID(),
>>>>>>> 8f75611c7520dcc56ddcbd67b874a45bafac7fc7
    unique: true,
    required: true,
  },
  RoleName: {
    type: String,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
  },
  Permissions: {
    type: [String], // Tableau de permissions
    default: [],
  },
});

module.exports = mongo.model('role', Role);
