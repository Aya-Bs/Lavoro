import { signInWithPopup } from "firebase/auth";
import { githubAuth, githubProvider } from "./Firebase"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const GitHubLogin = () => {
  
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // État pour afficher/masquer la modale
    const [modalMessage, setModalMessage] = useState(""); // Message à afficher dans la modale
    const [modalType, setModalType] = useState("success"); // Type de modale (success, danger, etc.)
  const githHubLogin = async () => {
    try {
      const loginResponse = await signInWithPopup(githubAuth, githubProvider);
      const user = loginResponse.user
      const userData = {
        firstName: user.displayName,
        email: user.email,
        phone_number: user.phoneNumber,
        image: user.photoURL,
    }
    const response = await fetch('http://localhost:3000/users/github', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
  }); // Vérifiez si la réponse est valide
  if (!response.ok) {
      const errorText = await response.text(); // Lisez le contenu de la réponse
      console.error('Server response:', errorText);
      throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Login successful:', data);

  // Stockez le token dans le localStorage
  localStorage.setItem('token', data.token);

  // Afficher une modale de bienvenue
  setModalMessage("Welcome to Lavoro");
  setModalType("success");
  setShowModal(true);

  // Fermer la modale après 1 seconde
  setTimeout(() => {
      setShowModal(false);
      // Rediriger vers la page d'accueil après la fermeture de la modale
      navigate('/sales');
  }, 1000); // 1000 ms = 1 seconde
} catch (error) {
  console.error('Error during Microsoft login:', error);
  setModalMessage("An error occurred during login. Please try again.");
  setModalType("danger");
  setShowModal(true);

  // Fermer la modale après 1 seconde
  setTimeout(() => {
      setShowModal(false);
  }, 1000); // 1000 ms = 1 seconde
}
  };
  const style ={
    position: 'absolute',
    top: "142px",
    left: '176px',
    transform: 'translate(-50%, -50%)',
    
}
  return (
    <>
    <div className="social-container">
      <a href="#" className="social" onClick={githHubLogin}>
        <i className="ri-github-line" style={style}></i> 
      </a>
    </div>

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
    </>
  );
};

export default GitHubLogin;
