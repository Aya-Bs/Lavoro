import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const isRequestSent = useRef(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!token || isRequestSent.current) return;

    const verifyEmail = async () => {
      isRequestSent.current = true;
      try {
        console.log('Verification token:', token);
        const response = await axios.get(`http://localhost:3000/users/verify-email?token=${token}`);
        console.log('Backend response:', response.data);

        if (response.status === 200) {
          setAlertMessage('Email verified successfully!');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            navigate('/signin');
          }, 2000);
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setAlertMessage(error.response?.data?.error || 'Failed to verify email. Please try again.');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/signin');
        }, 2000);
      }
    };

    verifyEmail();
  }, [token, navigate]);

    
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
    <>
      <div>Loading .......</div>
    </>
  );
}


export default VerifyEmail;
