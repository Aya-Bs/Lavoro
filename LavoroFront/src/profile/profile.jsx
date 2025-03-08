import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // To store the QR code URL
  const [showQRCode, setShowQRCode] = useState(false); // To toggle QR code display
  const [token, setToken] = useState(''); // To store the user's TOTP code
  const [message, setMessage] = useState(''); // To display messages to the user
  const navigate = useNavigate();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/auth");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate("/auth");
        } else {
          console.error("Error fetching user info:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Handle account deletion request
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/request-delete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Profile delete request successful!");
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert("You already sent a deletion request.");
      } else if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate("/auth");
      } else {
        console.error("Error deleting profile:", err);
        alert("Failed to delete profile.");
      }
    }
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/enable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setQrCodeUrl(response.data.qrCodeUrl);
      setShowQRCode(true);
    } catch (err) {
      console.error("Error enabling 2FA:", err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const authToken = localStorage.getItem('token'); // JWT token for authentication
      if (!authToken) {
        throw new Error("No token found");
      }
  
      const userProvidedToken = token; // Use the TOTP code from the input field
      console.log('Sending verify request with TOTP code:', userProvidedToken); // Log the TOTP code
  
      const response = await axios.post(
        "http://localhost:3000/profiles/verify-2fa",
        { token: userProvidedToken }, // Send the TOTP code, not the JWT token
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use the JWT token for authentication
          },
          withCredentials: true,
        }
      );
  
      console.log('Verify response:', response.data); // Log the response
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error verifying 2FA:', err); // Log the full error
      setMessage(err.response?.data?.error || "Error verifying 2FA");
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/disable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error disabling 2FA");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ 
        width: "350px", 
        padding: "20px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
        borderRadius: "10px", 
        textAlign: "center", 
        fontFamily: "Arial, sans-serif", 
        backgroundColor: "#fff" 
      }}>
        <h1>User Profile</h1>
        {user.image ? (
          <img
            src={`http://localhost:3000${user.image}`}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px"
            }}
          />
        ) : (
          <p>No profile image uploaded.</p>
        )}

        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phone_number}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <button 
            onClick={() => navigate("/update-profile")} 
            style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#007bff", color: "white", borderRadius: "5px", cursor: "pointer" }}
          >
            Update Profile
          </button>
          
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to request account deletion?")) {
                handleDeleteAccount();
              }
            }}
            style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#dc3545", color: "white", borderRadius: "5px", cursor: "pointer" }}
          >
            Delete Request
          </button>
          
          <button 
            onClick={() => navigate("/home")} 
            style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#6c757d", color: "white", borderRadius: "5px", cursor: "pointer" }}
          >
            Back to Home
          </button>

          {/* 2FA Buttons */}
          {!user.twoFactorEnabled ? (
            <button
              onClick={handleEnable2FA}
              style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#28a745", color: "white", borderRadius: "5px", cursor: "pointer" }}
            >
              Enable 2FA
            </button>
          ) : (
            <button
              onClick={handleDisable2FA}
              style={{ width: "100%", padding: "10px", border: "none", backgroundColor: "#dc3545", color: "white", borderRadius: "5px", cursor: "pointer" }}
            >
              Disable 2FA
            </button>
          )}

          {showQRCode && (
            <div>
              <img src={qrCodeUrl} alt="QR Code" />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 2FA code"
              />
              <button onClick={handleVerify2FA}>Verify 2FA</button>
            </div>
          )}

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;