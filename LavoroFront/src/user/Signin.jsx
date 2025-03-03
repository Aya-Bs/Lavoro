import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import GitHubLogin from './GitHubLogin';
import MicrosoftLogin from './MicrosoftLogin';

function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:3000/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    });
                    if (response.data) {
                        // Redirect to home or admin dashboard based on role
                        if (response.data.role && response.data.role.RoleName === 'Admin') {
                            navigate('/admin-dashboard');
                        } else {
                            navigate('/home');
                        }
                    }
                }
            } catch (err) {
                console.error('Error checking authentication:', err);
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
                withCredentials: true,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store token in localStorage

                // Fetch user info to check role
                const userResponse = await axios.get('http://localhost:3000/users/me', {
                    headers: { Authorization: `Bearer ${response.data.token}` },
                    withCredentials: true,
                });

                // Show success alert
                setAlertMessage('Sign-in successful!');
                setShowAlert(true);

                // Redirect after 2 seconds
                setTimeout(() => {
                    setShowAlert(false); // Hide the alert
                    if (userResponse.data.role && userResponse.data.role.RoleName === 'Admin') {
                        navigate('/admin-dashboard'); // Redirect to admin dashboard
                    } else {
                        navigate('/home'); // Redirect to home
                    }
                }, 2000);
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            console.error('Error during sign-in:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'An error occurred during sign-in.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password', { state: { email: formData.email } });
    };

    const CustomAlert = ({ message, onClose }) => {
        return (
            <div style={{
                position: "absolute", // Use absolute positioning
                top: "20%", // Position near the fields
                left: "50%",
                transform: "translate(-50%, -50%)", // Center the alert
                width: "400px", // Smaller width
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                zIndex: 1000,
            }}>
                <p style={{ margin: "0 0 10px 0" }}>{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        padding: "8px",
                        backgroundColor: "#FFC300",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    OK
                </button>
            </div>
        );
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSubmit}>
                <h1>Sign in</h1>
                <div className="social-container">
                    <a href="#" className="social">
                        <GoogleLogin />
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
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
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