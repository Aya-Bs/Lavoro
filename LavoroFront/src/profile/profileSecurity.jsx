import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ProfileSecurity = ({ user }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(""); 
  const [showQRCode, setShowQRCode] = useState(false);
  const [token, setToken] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorEnabled);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
  
      setMessage(response.data.message);
      setShowQRCode(false);
      setIs2FAEnabled(true);
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
      setIs2FAEnabled(false);
    } catch (err) {
      console.error("Error disabling 2FA:", err);
      setMessage(err.response?.data?.error || "Error disabling 2FA");
    }
  };

  // Handle password reset with SweetAlert2 popups
  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No token found");
      }

      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        await Swal.fire({
          title: "Error!",
          text: "All password fields are required",
          icon: "error"
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        await Swal.fire({
          title: "Error!",
          text: "New passwords don't match",
          icon: "error"
        });
        return;
      }

      const response = await axios.put(
        "http://localhost:3000/profiles/update-password",
        {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await Swal.fire({
          title: "Success!",
          text: "Password updated successfully!",
          icon: "success"
        });
        window.location.reload();
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      await Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || 
              err.response?.data?.error || 
              err.message || 
              "Error changing password",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane p-0" id="account-settings" role="tabpanel">
      <div className="row gy-3">
        <div className="col-xxl-7">
          <div className="card custom-card shadow-none mb-0">
            <div className="card-body">
              {/* Two Step Verification - Unchanged */}
              <div className="d-flex gap-2 flex-wrap align-items-top mb-4 justify-content-between">
                <div className="w-75">
                  <p className="fs-14 mb-1 fw-medium">Two Step Verification</p>
                  <p className="fs-12 text-muted mb-0">
                    Two-step verification provides enhanced security measures and helps prevent unauthorized access and fraudulent activities.
                  </p>
                </div>
                <div
                  className={`toggle toggle-success ${is2FAEnabled ? "on" : "off"} mb-0`}
                  id="two-step-verification"
                  onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
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

              {/* Reset Password Section with updated button */}
              <div className="d-flex align-items-top justify-content-between mt-4">
                <div className="w-100">
                  <p className="fs-14 mb-1 fw-medium">Reset Password</p>
                  <p className="fs-12 text-muted">Password should be min of <b className="text-success">8 digits<sup>*</sup></b>, at least <b className="text-success">One Capital letter<sup>*</sup></b> and <b className="text-success">One Special Character<sup>*</sup></b> included.</p>
                  <div className="mb-2">
                    <label htmlFor="current-password" className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="current-password" 
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="new-password" className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="new-password" 
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirm-password" 
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    onClick={handlePasswordReset} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;