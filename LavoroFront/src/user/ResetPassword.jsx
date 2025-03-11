import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Récupérer le token depuis l'URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
=======
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState(''); // État pour stocker le firstName
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Password successfully changed!');
<<<<<<< HEAD
=======
        setFirstName(data.firstName); // Stocker le firstName
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
        setError('');
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          navigate('/signin');
        }, 1000); // Redirection après 1 seconde
      } else {
        setError(data.error || 'An error occurred while resetting your password.');
      }
    } catch (err) {
      setError('An error occurred while resetting your password.');
      console.error('Error:', err);
    }
  };

<<<<<<< HEAD
  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="token" value={token} />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
=======
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
          <div className="card custom-card my-4">
            <div className="card-body p-5">
              <p className="h5 mb-2 text-center">Reset Password</p>
              <p className="mb-4 text-muted op-7 fw-normal text-center fs-14">Hi {firstName || 'User'}!</p>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-xl-12">
                    <label htmlFor="newPassword" className="form-label text-default">
                      New Password <sup className="fs-12 text-danger">*</sup>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control create-password-input"
                        id="newPassword"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="show-password-button text-muted"
                        onClick={togglePasswordVisibility}
                      >
                        <i className={`ri-eye-${showPassword ? 'line' : 'off-line'} align-middle`} />
                      </button>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <label htmlFor="confirmPassword" className="form-label text-default">
                      Confirm Password <sup className="fs-12 text-danger">*</sup>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control create-password-input"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="show-password-button text-muted"
                        onClick={togglePasswordVisibility}
                      >
                        <i className={`ri-eye-${showPassword ? 'line' : 'off-line'} align-middle`} />
                      </button>
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
                  Remembered your password? <a href="/signin" className="text-primary">Sign In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
    </div>
  );
};

export default ResetPassword;