import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Swal from "sweetalert2";

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
        const token = localStorage.getItem("token");
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
          setFirstName(response.data.firstName || "");
          setLastName(response.data.lastName || "");
          setPhoneNumber(response.data.phone_number || "");
          setProfileImage(response.data.image || "");
        } else {
          navigate("/auth");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        } else {
          console.error("Error fetching user info:", err);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setImageSrc(imageData);
    setShowCameraInModal(false);
    setShowModal(false);
  };

  // Handle image upload from file input
  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle crop completion
  const onCropComplete = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImage(croppedImageUrl);
    }
  };

  // Get cropped image
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/png");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword && newPassword !== confirmNewPassword) {
      await Swal.fire({
        title: "Error",
        text: "New password and confirm password do not match.",
        icon: "error",
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      await Swal.fire({
        title: "Error",
        text: "No token found. Please log in again.",
        icon: "error",
      });
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    if (currentPassword) formData.append("currentPassword", currentPassword);
    if (newPassword) formData.append("newPassword", newPassword);
    if (confirmNewPassword) formData.append("confirmNewPassword", confirmNewPassword);

    if (croppedImage) {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formData.append("image", blob, "profile.png");
    } else if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/profiles/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await Swal.fire({
          title: "Updated!",
          text: "Profile updated successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        await Swal.fire({
          title: "Session Expired",
          text: "Please log in again.",
          icon: "error",
        });
        localStorage.removeItem("token");
        navigate("/auth");
      } else {
        console.error("Error updating profile:", err);
        await Swal.fire({
          title: "Error",
          text: "Failed updating profile!",
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion request
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
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
          await Swal.fire({
            title: "Deleted!",
            text: "Profile delete request successful!",
            icon: "success",
          });
          window.location.reload();
        }
      }
    } catch (err) {
      if (err.response?.status === 400) {
        await Swal.fire({
          title: "Error",
          text: "You already sent a deletion request.",
          icon: "error",
        });
      } else if (err.response?.status === 401) {
        await Swal.fire({
          title: "Session Expired",
          text: "Please log in again.",
          icon: "error",
        });
        localStorage.removeItem("token");
        navigate("/auth");
      } else {
        console.error("Error deleting profile:", err);
        await Swal.fire({
          title: "Error",
          text: "Failed to delete profile.",
          icon: "error",
        });
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="row gap-3 justify-content-center">
      <div className="p-3 border-bottom border-top border-block-end-dashed tab-content">
        <div
          className="tab-pane show active overflow-hidden p-0 border-0"
          id="account-pane"
          role="tabpanel"
          aria-labelledby="account"
          tabIndex="0"
        >
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-1">
            <div className="fw-semibold d-block fs-15">Account Settings :</div>
            <div className="btn btn-primary btn-sm">
              <i className="ri-loop-left-line lh-1 me-2"></i>Restore Changes
            </div>
          </div>
          <div className="row gy-3">
            <div className="col-xl-12">
              <div className="d-flex align-items-start flex-wrap gap-3">
                <div>
                  <span className="avatar avatar-xxl" style={{ marginLeft: "10px" }}>
                    {profileImage ? (
                      <img
                        src={
                          profileImage.startsWith("data:image")
                            ? profileImage
                            : `http://localhost:3000${profileImage}`
                        }
                        alt="Profile"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />
                    ) : (
                      <p></p>
                    )}
                  </span>
                </div>
                <div>
                  <span className="fw-medium d-block mb-2">Profile Picture</span>
                  <div className="btn-list mb-1">
                    <button
                      className="btn btn-sm btn-primary btn-wave"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="ri-upload-2-line me-1"></i>Change Image
                    </button>
                    <button
                      className="btn btn-sm btn-primary1-light btn-wave"
                      onClick={() => setProfileImage("")}
                    >
                      <i className="ri-delete-bin-line me-1"></i>Remove
                    </button>
                  </div>
                  <span className="d-block fs-12 text-muted">
                    Use JPEG, PNG, or GIF. Best size: 200x200 pixels. Keep it under 5MB
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <label htmlFor="profile-user-name" className="form-label">
                First Name :
              </label>
              <input
                type="text"
                className="form-control"
                id="profile-user-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
              />
            </div>
            <div className="col-xl-12">
              <label htmlFor="profile-last-name" className="form-label">
                Last Name :
              </label>
              <input
                type="text"
                className="form-control"
                id="profile-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
              />
            </div>
            <div className="col-xl-12">
              <label htmlFor="profile-phone-number" className="form-label">
                Phone Number :
              </label>
              <input
                type="text"
                className="form-control"
                id="profile-phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
              />
            </div>
            <div className="col-xl-12">
              <label htmlFor="current-password" className="form-label">
                Current Password :
              </label>
              <input
                type="password"
                className="form-control"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter Current Password"
              />
            </div>
            <div className="col-xl-12">
              <label htmlFor="new-password" className="form-label">
                New Password :
              </label>
              <input
                type="password"
                className="form-control"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
              />
            </div>
            <div className="col-xl-12">
              <label htmlFor="confirm-password" className="form-label">
                Confirm New Password :
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer border-top-0">
        <div className="btn-list float-end">
          <button
            className="btn btn-primary2 btn-wave"
            id="alert-confirm"
            onClick={handleDeleteAccount}
          >
            Deactivate Account
          </button>
          <button
            className="btn btn-primary btn-wave"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Modal for Image Source Selection */}
      {showModal && (
        <div
          className="modal-backdrop"
          style={{
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
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              width: "700px",
              maxWidth: "90%",
            }}
          >
            {showCameraInModal ? (
              <div>
                <video ref={videoRef} width="500" height="400" autoPlay></video>
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                <button
                  onClick={capturePhoto}
                  className="btn btn-primary w-100 mb-2"
                  style={{ padding: "8px", borderRadius: "8px" }}
                >
                  Capture
                </button>
                <button
                  onClick={() => setShowCameraInModal(false)}
                  className="btn btn-light w-100"
                  style={{ padding: "8px", borderRadius: "8px" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3>Choose Image Source</h3>
                <button
                  onClick={() => {
                    setShowCameraInModal(true);
                    openCamera();
                  }}
                  className="btn btn-primary w-100 mb-2"
                  style={{ padding: "8px", borderRadius: "8px" }}
                >
                  Capture Image
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="btn btn-primary w-100 mb-2"
                  style={{ padding: "8px", borderRadius: "8px" }}
                >
                  Upload Image from PC
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-light w-100"
                  style={{ padding: "8px", borderRadius: "8px" }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {imageSrc && (
        <div
          className="modal-backdrop"
          style={{
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
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              width: "700px",
              maxWidth: "90%",
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={onCropComplete}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop me"
                style={{ maxWidth: "100%", maxHeight: "500px" }}
              />
            </ReactCrop>
            <button
              onClick={() => {
                setProfileImage(croppedImage || imageSrc);
                setImageSrc(null);
                setCroppedImage(null);
              }}
              className="btn btn-primary w-100 mt-2"
              style={{ padding: "8px", borderRadius: "8px" }}
            >
              Save
            </button>
            <button
              onClick={() => setImageSrc(null)}
              className="btn btn-light w-100 mt-2"
              style={{ padding: "8px", borderRadius: "8px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={previewImage}
      />
    </div>
  );
};

export default UpdateProfile;