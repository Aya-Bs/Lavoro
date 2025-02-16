const axios = require("axios");
const jwt = require("jsonwebtoken");
const { oauth2client } = require("../utils/googleConfig");
const UserModel = require("../models/OAuth");

/* 
  Controller for Google authentication.
  - Retrieves the OAuth code sent by the frontend.
  - Exchanges the code for a Google access token.
  - Fetches user information from Google.
  - Checks if the user already exists in the database.
  - Creates a new user if they don't exist.
  - Generates a JWT token for authentication.
  - Returns the response with the token and user information.
*/
const googleLogin = async (req, res) => {
    try {
        // Extract OAuth code from the query
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Missing OAuth code" });
        }

        // Exchange the code for a Google access token
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        // Fetch user information from Google
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        // Extract user data from the Google response
        const { id: googleId, email, given_name: firstName, family_name: lastName, picture: image } = userRes.data;

        // Check if the user already exists in the database
        let user = await UserModel.findOne({ provider_id: googleId });

        if (!user) {
            // If the user doesn't exist, create a new one
            user = await UserModel.create({
                provider_id: googleId, 
                provider: 'Google',
                firstName, 
                lastName, 
                email, 
                image
            });
        }

        // Generate a JWT token for authentication
        const { _id } = user;
        const token = jwt.sign(
            { _id, email }, // Payload for the token
            process.env.JWT_SECRET, // Secret key for signing the token
            { expiresIn: process.env.JWT_TIMEOUT } // Token expiration
        );

        // Send the response with the token and user data
        return res.status(200).json({
            message: "Success",
            token,
            user
        });

    } catch (err) {
        // Error handling
        console.error("Google Authentication Error:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Export the controller for use in other files
module.exports = { googleLogin };
