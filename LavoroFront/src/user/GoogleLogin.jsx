import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
    const navigate = useNavigate();

    // Fonction appelée après une authentification réussie
    // const responseGoogle = async (authResult) => {
    //     try {
    //         console.log("Auth Result:", authResult);
    //         if (authResult && authResult.code) {
    //             // Appel à l'API backend pour échanger le code contre un token
    //             const result = await googleAuth(authResult.code);
    //             console.log("Backend Response:", result);

    //             // Extraction des données utilisateur et du token
    //             const { email, firstName, lastName, image } = result.data.user;
    //             const token = result.data.token;

    //             // Stockage des informations non sensibles dans localStorage
    //             const userInfo = { email, firstName, lastName, image };
    //             localStorage.setItem("user-info", JSON.stringify(userInfo));

    //             // localStorage.setItem("token", token);

    //             // Stockage du token dans un cookie sécurisé (si nécessaire)
    //             document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;

    //             // Redirection vers la page d'accueil
    //             navigate("/home", { replace: true });
    //         }
    //     } catch (error) {
    //         console.error("Error while requesting Google code:", error.response ? error.response.data : error.message);
    //         alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    //     }
    // };

    const responseGoogle = async (authResult) => {
    try {
        console.log("Auth Result:", authResult);
        if (authResult && authResult.code) {
            // Appel à l'API backend pour échanger le code contre un token
            const result = await googleAuth(authResult.code);
            console.log("Backend Response:", result);

            // Extraction des données utilisateur et du token
            const { email, firstName, lastName, image } = result.data.user;
            const token = result.data.token;

            // Stockage des informations non sensibles dans localStorage
            const userInfo = { email, firstName, lastName, image };
            localStorage.setItem("user-info", JSON.stringify(userInfo));

            // Store the token in localStorage
            localStorage.setItem("token", token);

            // Stockage du token dans un cookie sécurisé (si nécessaire)
            document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;

            // Redirection vers la page d'accueil
            navigate("/home", { replace: true });
        }
    } catch (error) {
        console.error("Error while requesting Google code:", error.response ? error.response.data : error.message);
        alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
};

    // Fonction appelée en cas d'échec de connexion
    const handleError = (error) => {
        console.error("Google Login Error:", error);
        alert("La connexion via Google a échoué. Veuillez réessayer.");
    };

    // Hook pour initier la connexion Google
    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: handleError,
        flow: "auth-code",
    });

    return (
        <div className="social-container">
            <a href="#" className="social" onClick={googleLogin}>
                <i className="fab fa-google"></i> 
            </a>
        </div>
    );
}

export default GoogleLogin;