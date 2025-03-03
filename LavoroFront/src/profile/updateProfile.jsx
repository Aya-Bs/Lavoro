import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCameraInModal, setShowCameraInModal] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
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
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setPhoneNumber(response.data.phone_number);
          setProfileImage(response.data.image);
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
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);

    if (croppedImage) {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formData.append("image", blob, "profile.png");
    } else if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      const response = await axios.post("http://localhost:3000/profiles/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate("/auth");
      } else {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "350px", padding: "20px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px", textAlign: "center", backgroundColor: "#fff" }}>
        <h2>Update Profile</h2>

        {/* Profile Image Section */}
        {profileImage && (
          <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 20px" }}>
            <img
              src={profileImage.startsWith("data:image") ? profileImage : `http://localhost:3000${profileImage}`}
              alt="Profile"
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
            <button
              onClick={() => setShowModal(true)}
              style={{
                position: "absolute",
                bottom: "5px",
                left: "65px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                border: "none",
                backgroundColor: "#FFC300",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
                boxSizing: "border-box",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "12px", height: "12px" }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => {
              previewImage(e);
              setShowModal(false);
            }}
          />

          <button type="submit" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        <button onClick={() => navigate("/profile")} style={{ width: "100%", padding: "8px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;