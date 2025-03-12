import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from "react-bootstrap"; // Import des composants Bootstrap

function GoogleLogin() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // État pour afficher/masquer la modale
    const [modalMessage, setModalMessage] = useState(""); // Message à afficher dans la modale
    const [modalType, setModalType] = useState("success"); // Type de modale (success, danger, etc.)

    const responseGoogle = async (authResult) => {
        try {
            if (authResult && authResult.code) {
                const result = await googleAuth(authResult.code);

                if (result.data.success) {
                    const { email, firstName, lastName, phone_number,image } = result.data.user;
                    const token = result.data.token;

                    // Stocker les informations utilisateur
                    const userInfo = { email, firstName, lastName, phone_number ,image };
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    localStorage.setItem("token", token);
                    document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;

                    // Afficher une modale de bienvenue
                    setModalMessage(result.data.message);
                    setModalType("success");
                    setShowModal(true);

                    // Fermer la modale après 1 seconde
                    setTimeout(() => {
                        setShowModal(false);
                        // Rediriger vers la page d'accueil après la fermeture de la modale
                        navigate("/profile", { replace: true });
                    }, 1000); // 1000 ms = 1 seconde
                } else {
                    // Afficher une modale d'erreur
                    setModalMessage(result.data.message);
                    setModalType("danger");
                    setShowModal(true);

                    // Fermer la modale après 1 seconde
                    setTimeout(() => {
                        setShowModal(false);
                    }, 1000); // 1000 ms = 1 seconde
                }
            }
        } catch (error) {
            console.error("Error while requesting Google code:", error);
            setModalMessage("An error occurred. Please try again.");
            setModalType("danger");
            setShowModal(true);

            // Fermer la modale après 1 seconde
            setTimeout(() => {
                setShowModal(false);
            }, 1000); // 1000 ms = 1 seconde
        }
    };

    const handleError = (error) => {
        console.error("Google Login Error:", error);
        setModalMessage("Google login failed. Please try again.");
        setModalType("danger");
        setShowModal(true);

        // Fermer la modale après 1 seconde
        setTimeout(() => {
            setShowModal(false);
        }, 1000); // 1000 ms = 1 seconde
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: handleError,
        flow: "auth-code",
    });

    const style ={
        position: 'absolute',
        top: "142px",
        left: '215px',
        transform: 'translate(-50%, -50%)',
        
    }

    return (
        <div className="social-container">
            <a href="#" className="social" onClick={googleLogin}>
                <i className="ri-google-line" style={style}></i>
            </a>

            {/* Modale Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton className={`bg-${modalType} text-white`}>
                    <Modal.Title>
                        {modalType === "success" ? "Success" : "Error"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={modalType} onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default GoogleLogin;