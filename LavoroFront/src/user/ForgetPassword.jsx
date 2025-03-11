<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || ''); // Récupérer l'email depuis l'état de navigation
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Log la réponse du serveur

      if (response.ok) {
        setShowPopup(true); // Afficher la pop-up
        setError('');
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError("An error occurred while sending the email.");
      console.error('Error:', err); // Log l'erreur
    }
  };

  return (
<<<<<<< HEAD
    <div>
      <h1>Forgot Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleForgotPassword}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
=======
    <div className="container-lg">
      <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
          <div className="card custom-card my-4">
            <div className="card-body p-5">
              <div className="mb-3 d-flex justify-content-center">
                <a href="index.html">
                  <img src="../assets/images/brand-logos/desktop-logo.png" alt="logo" className="desktop-logo" />
                  <img src="../assets/images/brand-logos/desktop-white.png" alt="logo" className="desktop-white" />
                </a>
              </div>
              <p className="h5 mb-2 text-center">Forgot Password</p>
              <p className="mb-4 text-muted op-7 fw-normal text-center fs-14">
                Enter your email to reset your password.
              </p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleForgotPassword}>
                <div className="row gy-3">
                  <div className="col-xl-12">
                    <label htmlFor="email" className="form-label text-default">
                      Email <sup className="fs-12 text-danger">*</sup>
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </form>
              <div className="text-center">
                <p className="text-muted mt-3">
                  Remembered your password? <a href="/auth" className="text-primary">Sign In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356

      {/* Pop-up */}
      {showPopup && (
        <div style={popupStyle}>
          <p>✅ Check your email for the reset link!</p>
<<<<<<< HEAD
          <button onClick={() => navigate('/auth')}>OK</button> {/* Rediriger vers la page SignIn */}
=======
          <button
            className="btn btn-primary"
            onClick={() => navigate('/auth')}
          >
            OK
          </button>
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
        </div>
      )}
    </div>
  );
};

// Style pour la pop-up
const popupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  zIndex: 1000,
};

export default ForgotPassword;