<<<<<<< HEAD
const { default: mongoose } = require('mongoose');
=======
>>>>>>> 8f75611c7520dcc56ddcbd67b874a45bafac7fc7
const mongo = require('mongoose');
const Schema = mongo.Schema;

const OAuth = new Schema(
    {
        id: {
            type: mongoose.Schema.Types.UUID,
            default: () => new mongoose.Types.UUID(),
            unique: true,
            required: true,
          },
<<<<<<< HEAD
         
          firstName: {
            type: String, required: true 
          },
          
          lastName: {
             type: String
           },
           email: { 
            type: String, required: true, unique: true 

           },
          image: { 
            type: String 
=======
          user_id: {
            type: mongoose.Schema.Types.UUID,
            required: true,
>>>>>>> 8f75611c7520dcc56ddcbd67b874a45bafac7fc7
          },
          provider: {
            type: String,
            required: true,
            enum: ["Google", "GitHub"], // Tu peux ajouter d'autres providers ici
          },
          provider_id: {
            type: String,
            required: true,
          },
          created_at: {
            type: Date,
            default: Date.now,
          },  
    }



);
<<<<<<< HEAD
const UserModel= mongoose.model('social-logins', OAuth);
module.exports = UserModel;
=======
module.exports = mongo.model('oAuth', OAuth);
>>>>>>> 8f75611c7520dcc56ddcbd67b874a45bafac7fc7
