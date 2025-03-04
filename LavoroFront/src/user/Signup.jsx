import React, { useEffect,useState, useRef } from 'react';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleLogin from './GoogleLogin';
import { validatePhoneNumber, validateFirstName, validateLastName, validateEmail } from './validate';
import MicrosoftLogin from './MicrosoftLogin';
import GitHubLogin from './GitHubLogin';
import Recaptcha from './Recaptcha';

function SignUp() {
    const [firstName, setFirst] = useState("");
    const [lastName, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const [showRequirements, setShowRequirements] = useState(false);
    const [passwordSuggestions, setPasswordSuggestions] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        firstNameError: "",
        lastNameError: "",
        phoneError: "",
    });

    const fileInputRef = useRef(null);
    const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
    const recaptchaRef = useRef(null);
    
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
                        navigate('/home'); // Redirect to home if already authenticated
                    }
                }
            } catch (err) {
                console.error('Error checking authentication:', err);
            }
        };

        checkAuthentication();
    }, [navigate]);


    const handleRecaptchaChange = (value) => {
        setIsRecaptchaVerified(!!value);
    };

    const handleRecaptchaExpired = () => {
        setIsRecaptchaVerified(false);
    };

    const passwordRequirements = [
        { text: "At least 8 characters", regex: /.{8,}/ },
        { text: "At least one uppercase letter", regex: /[A-Z]/ },
        { text: "At least one lowercase letter", regex: /[a-z]/ },
        { text: "At least one number", regex: /[0-9]/ },
        { text: "At least one special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
    ];

    const [visibleRequirements, setVisibleRequirements] = useState(passwordRequirements);

    const generatePassword = () => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const specialChars = "!@#$%^&*()";

        const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        const randomLowercase = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        const randomNumber = numberChars[Math.floor(Math.random() * numberChars.length)];
        const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];

        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        let remainingChars = "";
        for (let i = 0; i < 4; i++) {
            remainingChars += allChars[Math.floor(Math.random() * allChars.length)];
        }

        let suggestedPassword = randomUppercase + randomLowercase + randomNumber + randomSpecial + remainingChars;
        suggestedPassword = suggestedPassword
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');

        return suggestedPassword;
    };

    const generatePasswordSuggestions = () => {
        const suggestions = [generatePassword(), generatePassword(), generatePassword()];
        setPasswordSuggestions(suggestions);
    };

    const handlePasswordSuggestionClick = (suggestedPassword) => {
        setPassword(suggestedPassword);
        setVisibleRequirements(passwordRequirements.filter(req => !req.regex.test(suggestedPassword)));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e) => {
        const input = e.target.value;
        setPassword(input);
        setVisibleRequirements(passwordRequirements.filter(req => !req.regex.test(input)));
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirst(value);
        setFieldErrors((prev) => ({ ...prev, firstNameError: validateFirstName(value) }));
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLast(value);
        setFieldErrors((prev) => ({ ...prev, lastNameError: validateLastName(value) }));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        setFieldErrors((prev) => ({ ...prev, phoneError: validatePhoneNumber(value) }));
    };

    const checkEmailAvailability = async (email) => {
        if (!email) {
            setEmailAvailable(null);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3000/users/check-email?email=${email}`);
            setEmailAvailable(!response.data.exists);
        } catch (error) {
            console.error("Error checking email availability:", error);
            setEmailAvailable(null);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        const validationError = validateEmail(value);
        setEmailError(validationError);

        if (!validationError) {
            checkEmailAvailability(value);
        } else {
            setEmailAvailable(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailValidationError = validateEmail(email);
        setEmailError(emailValidationError);

        if (emailValidationError || !emailAvailable) {
            setError("Please enter a valid and available email.");
            return;
        }

        const firstNameError = validateFirstName(firstName);
        const lastNameError = validateLastName(lastName);
        const phoneError = validatePhoneNumber(phoneNumber);

        if (firstNameError || lastNameError || phoneError) {
            setFieldErrors({
                firstNameError,
                lastNameError,
                phoneError,
            });
            return;
        }

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone_number", phoneNumber);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post("http://localhost:3000/users/signup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });


            if (response.data.message) {
                setAlertMessage(response.data.message);
                setShowAlert(true);
            } else {
                throw new Error("No message received from server");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.error || "An error occurred during signup. Please try again.");
        }
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
                            backgroundColor: "#5d68e2",
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
        <div className="form-container sign-up-container">
            <form onSubmit={handleSubmit}>
                <div className="logo-container">
                <div className="logo"></div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}




           
<div className="mb-3 text-center">
    <div className="image-upload-container" onClick={() => fileInputRef.current.click()}>
        {imagePreview ? <img src={imagePreview} alt="Profile Preview" className="profile-image" /> : <FaCamera size={24} />}
    </div>
    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
</div>

<div className="social-container">
    <a >
        <GitHubLogin />
    </a>

    {/* Gmail Login */}
    <a href="#" >
        <GoogleLogin />
    </a>

    {/* Microsoft Login */}
    <a href="#" >
        <MicrosoftLogin />
    </a>
</div>
               
                {/* First Name and Last Name in the same line */}
                <div className="name-fields">
                    <div className="input-group">
                        <label>
                            First Name<span className="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstName} 
                            onChange={handleFirstNameChange} 
                            required 
                        />
                        {fieldErrors.firstNameError && <div className="error">{fieldErrors.firstNameError}</div>}
                    </div>
                    <div className="input-group">
                        <label>
                            Last Name<span className="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={handleLastNameChange} 
                            required 
                        />
                        {fieldErrors.lastNameError && <div className="error">{fieldErrors.lastNameError}</div>}
                    </div>
                </div>

                {/* Email and Phone Number in the same line */}
                <div className="contact-fields">
                    <div className="input-group">
                        <label>
                            Email<span className="required">*</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={handleEmailChange} 
                            required 
                        />
                        {emailError && <div className="error">{emailError}</div>}
                        {emailAvailable === false && <div className="error">Email is already taken</div>}
                    </div>
                    <div className="input-group">
                        <label>
                            Phone Number<span className="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phoneNumber} 
                            onChange={handlePhoneNumberChange} 
                            required 
                        />
                        {fieldErrors.phoneError && <div className="error">{fieldErrors.phoneError}</div>}
                    </div>
                </div>

                {/* Password Field */}
                <div className="input-group">
                    <label>
                        Password<span className="required">*</span>
                    </label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onFocus={() => {
                                setShowRequirements(true);
                                generatePasswordSuggestions();
                            }}
                            onBlur={() => setTimeout(() => setShowRequirements(false), 200)}
                            onChange={handlePasswordChange}
                            required
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {showRequirements && (
                        <div className="password-hints">
                            {visibleRequirements.map((req, index) => (
                                <div key={index} className="error">{req.text}</div>
                            ))}
                        </div>
                    )}
                    {showRequirements && (
                        <div className="password-suggestions">
                            {passwordSuggestions.map((suggestion, index) => (
                                <span
                                    key={index}
                                    className="suggestion"
                                    onMouseDown={() => handlePasswordSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Recaptcha
                    ref={recaptchaRef}
                    onChange={handleRecaptchaChange}
                    onExpired={handleRecaptchaExpired}
                />

<br/>

<button type="submit" disabled={!isRecaptchaVerified} style={{
        backgroundColor: !isRecaptchaVerified ? '#ccc' : '#5d68e2',
        cursor: !isRecaptchaVerified ? 'not-allowed' : 'pointer',
        opacity: !isRecaptchaVerified ? 0.6 : 1
    }}>
        Sign Up
    </button>

<br/>

  
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

export default SignUp;