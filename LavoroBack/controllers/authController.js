const { oauth2client } = require('../utils/googleConfig'); // Assurez-vous que le chemin est correct
const jwt = require('jsonwebtoken');
const axios = require('axios');
const UserModel = require('../models/OAuth');

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        // Vérifiez si le code est présent
        if (!code) {
            return res.status(400).json({ message: "Missing OAuth code" });
        }

        // Échangez le code contre un token d'accès Google
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        // Récupérez les informations de l'utilisateur auprès de Google
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { id: googleId, email, given_name: firstName, family_name: lastName, picture: image } = userRes.data;

        // Vérifiez si l'utilisateur existe déjà
        let user = await UserModel.findOne({ provider_id: googleId });

        if (!user) {
            // Si l'utilisateur n'existe pas, vérifiez si l'email existe déjà
            user = await UserModel.findOne({ email });

            if (!user) {
                // Créez un nouvel utilisateur si l'email n'existe pas
                user = await UserModel.create({
                    provider_id: googleId,
                    provider: 'Google',
                    firstName,
                    lastName,
                    email,
                    image
                });
            } else {
                // Si l'email existe déjà, mettez à jour les informations si nécessaire
                user.provider_id = googleId;
                user.provider = 'Google';
                user.firstName = firstName;
                user.lastName = lastName;
                user.image = image;
                await user.save();
            }
        }

        // Générez un token JWT
        const { _id } = user;
        const token = jwt.sign(
            { _id , email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT || '1h' }
        );

        // Réponse JSON
        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                _id,
                firstName,
                lastName,
                email,
                image
            }
        });

    } catch (err) {
        console.error("Google Authentication Error:", err);
        console.error("Error details:", err.stack);

        // Gestion des erreurs spécifiques de l'API Google
        if (err.response && err.response.data && err.response.data.error) {
            return res.status(400).json({
                success: false,
                message: `Google API Error: ${err.response.data.error.message}`
            });
        }

        // Gestion des erreurs internes
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { googleLogin };