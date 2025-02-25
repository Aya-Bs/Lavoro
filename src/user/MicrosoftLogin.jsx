import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { microsoftAuth, microsoftProvider } from "./Firebase"; 
import { useNavigate } from 'react-router-dom'


const MicrosoftLogin = () => {
  const navigate = useNavigate();

  const microsoftLogin = async () => {
    try {
        const loginResponse = await signInWithPopup(microsoftAuth, microsoftProvider);
        console.log(loginResponse);
        const user = loginResponse.user;
        const userData = {
            firstName: user.displayName,
            email: user.email,
            phone_number: user.phoneNumber,
            image: user.photoURL,
        };

        const response = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
      });

        // Vérifiez si la réponse est valide
        if (!response.ok) {
            const errorText = await response.text(); // Lisez le contenu de la réponse
            console.error('Server response:', errorText);
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Stockez le token dans le localStorage
        localStorage.setItem('token', data.token);

        navigate('/home');
    } catch (error) {
        console.error('Error during Microsoft login:', error);
        alert('An error occurred during login. Please try again.');
    }
};
    


    return(
        <>
        <div className="social-container">
            <a href="#" className="social" onClick={microsoftLogin}>
                <i className="fab fa-microsoft"></i> 
            </a>
        </div>
        </>
    )
}

export default MicrosoftLogin;