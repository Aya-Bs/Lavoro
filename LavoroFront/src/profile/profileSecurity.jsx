import React, { useState } from "react";
import axios from "axios";

const ProfileSecurity = ({ user }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(""); 
  const [showQRCode, setShowQRCode] = useState(false);
  const [token, setToken] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorEnabled);

  // Enable 2FA
  const handleEnable2FA = async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/enable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      setQrCodeUrl(response.data.qrCodeUrl);
      setShowQRCode(true);
    } catch (err) {
      console.error("Error enabling 2FA:", err);
      setMessage(err.response?.data?.error || "Error enabling 2FA");
    }
  };

  const handleVerify2FA = async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No token found");
      }
  
      const response = await axios.post(
        "http://localhost:3000/profiles/verify-2fa",
        { token }, // Ensure this matches the backend's expected request body
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
  
      setMessage(response.data.message);
      setShowQRCode(false); // Hide QR code after successful verification
    } catch (err) {
      console.error("Error verifying 2FA:", err);
      setMessage(err.response?.data?.error || "Error verifying 2FA");
    }
  };
  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/profiles/disable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error("Error disabling 2FA:", err);
      setMessage(err.response?.data?.error || "Error disabling 2FA");
    }
  };

  return (
    <div className="tab-pane p-0" id="account-settings" role="tabpanel">
      <div className="row gy-3">
        <div className="col-xxl-7">
          <div className="card custom-card shadow-none mb-0">
            <div className="card-body">
              {/* Two Step Verification */}
              <div className="d-flex gap-2 flex-wrap align-items-top mb-4 justify-content-between">
                <div className="w-75">
                  <p className="fs-14 mb-1 fw-medium">Two Step Verification</p>
                  <p className="fs-12 text-muted mb-0">
                    Two-step verification provides enhanced security measures and helps prevent unauthorized access and fraudulent activities.
                  </p>
                </div>
                <div
                  className={`toggle toggle-success ${user.twoFactorEnabled ? "on" : "off"} mb-0`}
                  id="two-step-verification"
                  onClick={user.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                >
                  <span></span>
                </div>
              </div>

              {/* QR Code and Verification Input */}
              {showQRCode && (
                <div className="mt-4">
                  <img src={qrCodeUrl} alt="QR Code" className="img-fluid mb-3" />
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter 2FA code"
                    className="form-control mb-3"
                  />
                  <button onClick={handleVerify2FA} className="btn btn-primary">
                    Verify 2FA
                  </button>
                </div>
              )}

              {/* Display Messages */}
              {message && (
                <div className="mt-3">
                  <p className={`fs-14 ${message.includes("Error") ? "text-danger" : "text-success"}`}>
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;