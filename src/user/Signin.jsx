import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import des icônes d'œil
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate pour la redirection
import GoogleLogin from './GoogleLogin';
import MicrosoftLogin from './MicrosoftLogin';
import GitHubLogin from './GitHubLogin';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // État pour basculer la visibilité du mot de passe
  const [showAlert, setShowAlert] = useState(false); // État pour afficher l'alerte personnalisée
  const [alertMessage, setAlertMessage] = useState(""); // Message de l'alerte
  const navigate = useNavigate();
  

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/users/me', { withCredentials: true });
  //       if (response.data) {
  //         // L'utilisateur est déjà connecté, rediriger vers la page d'accueil
  //         navigate('/home');
  //       }
  //     } catch (err) {
  //       // Non authentifié, rester sur la page de connexion
  //     }
  //   };

  //   checkAuthentication();
  // }, [navigate]);

  useEffect(() => {
    const checkAuthentication = async () => {
        try {
            const token = localStorage.getItem("token"); // Récupérer le token
            if (!token) return;

            const response = await axios.get('http://localhost:3000/users/me', {
                headers: { Authorization: `Bearer ${token}` }, // Ajouter le token
                withCredentials: true 
            });

            if (response.data) {
                navigate('/home');
            }
        } catch (err) {
            console.error("Erreur d'authentification :", err.response?.data || err.message);
        }
    };

    checkAuthentication();
}, [navigate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/users/signin', formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true, // Make sure to include cookies
            });

            alert('Sign-in successful!');
            navigate('/home'); // Redirect to home page after login
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during sign-in.');
        }
    };

      // Fonction pour gérer le clic sur "Forgot your password?"
      const handleForgotPassword = () => {
        navigate('/forgot-password', { state: { email: formData.email } }); // Passer l'email à la page ForgotPassword
    };
    const CustomAlert = ({ message, onClose }) => {
        return (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}>
              <p>{message}</p>
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "10px",
                  backgroundColor: "#FFC300",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        );
      };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
                    <a href="#" className="social">
                       <GoogleLogin/>
                    </a>
                    <a href="#" className="social">
                        <MicrosoftLogin />
                    </a>
                    <a href="#" className="social">
                        <GitHubLogin />
                    </a> 
                </div>
        <span>or use your account</span>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"} // Basculer entre texte et mot de passe
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)} // Basculer la visibilité du mot de passe
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Basculer entre les icônes d'œil */}
          </span>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <span onClick={handleForgotPassword} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
          Forgot your password?
        </span>
        <button type="submit">Sign In</button>
      </form>

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default SignIn;