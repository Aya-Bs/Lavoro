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
    setShowCameraInModal(false); // Hide camera
    setShowModal(false); // Close modal
  };

  // Handle image upload from file input
  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setShowModal(false); // Close modal
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
    // <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    //   <div style={{ width: "350px", padding: "20px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px", textAlign: "center", backgroundColor: "#fff" }}>
    //     <h2>Update Profile</h2>

    //     {/* Profile Image Section */}
    //     {profileImage ? (
    //       <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 20px" }}>
    //         <img
    //           src={profileImage.startsWith("data:image") ? profileImage : `http://localhost:3000${profileImage}`}
    //           alt="Profile"
    //           style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
    //         />
    //         <button
    //           onClick={() => setShowModal(true)}
    //           style={{
    //             position: "absolute",
    //             bottom: "5px",
    //             left: "65px",
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             width: "30px",
    //             height: "30px",
    //             borderRadius: "50%",
    //             boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    //             border: "none",
    //             backgroundColor: "#FFC300",
    //             cursor: "pointer",
    //             transition: "all 0.3s ease",
    //             padding: 0,
    //             boxSizing: "border-box",
    //           }}
    //         >
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             style={{ width: "12px", height: "12px" }}
    //             viewBox="0 0 20 20"
    //             fill="currentColor"
    //           >
    //             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    //           </svg>
    //         </button>
    //       </div>
    //     ) : (
    //       <p style={{ color: "#888", fontStyle: "italic" }}>Upload a profile image</p>
    //     )}

    //     {/* Modal for Image Source Selection */}
    //     {showModal && (
    //       <div style={{
    //         position: "fixed",
    //         top: 0,
    //         left: 0,
    //         width: "100%",
    //         height: "100%",
    //         backgroundColor: "rgba(0, 0, 0, 0.5)",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         zIndex: 1000,
    //       }}>
    //         <div style={{
    //           backgroundColor: "#fff",
    //           padding: "20px",
    //           borderRadius: "10px",
    //           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    //           textAlign: "center",
    //         }}>
    //           {showCameraInModal ? (
    //             // Camera Section in Modal
    //             <div>
    //               <video ref={videoRef} width="200" height="200" autoPlay style={{ marginBottom: "10px" }}></video>
    //               <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    //               <button
    //                 onClick={capturePhoto}
    //                 style={{
    //                   width: "100%",
    //                   padding: "8px",
    //                   marginBottom: "10px",
    //                   backgroundColor: "#FFC300",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 Capture
    //               </button>
    //               <button
    //                 onClick={() => setShowCameraInModal(false)}
    //                 style={{
    //                   width: "100%",
    //                   padding: "8px",
    //                   backgroundColor: "#ccc",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           ) : (
    //             // Image Source Selection Section
    //             <>
    //               <h3>Choose Image Source</h3>
    //               <button
    //                 onClick={() => {
    //                   setShowCameraInModal(true);
    //                   openCamera();
    //                 }}
    //                 style={{
    //                   width: "100%",
    //                   padding: "10px",
    //                   marginBottom: "10px",
    //                   backgroundColor: "#FFC300",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 Capture Image
    //               </button>
    //               <button
    //                 onClick={() => {
    //                   fileInputRef.current.click();
    //                   setShowModal(false);
    //                 }}
    //                 style={{
    //                   width: "100%",
    //                   padding: "10px",
    //                   backgroundColor: "#FFC300",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 Upload Image from PC
    //               </button>
    //               <button
    //                 onClick={() => setShowModal(false)}
    //                 style={{
    //                   width: "100%",
    //                   padding: "10px",
    //                   marginTop: "10px",
    //                   backgroundColor: "#ccc",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 Cancel
    //               </button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     )}

    //     {/* Crop Modal */}
    //     {imageSrc && (
    //       <div style={{
    //         position: "fixed",
    //         top: 0,
    //         left: 0,
    //         width: "100%",
    //         height: "100%",
    //         backgroundColor: "rgba(0, 0, 0, 0.5)",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         zIndex: 1000,
    //       }}>
    //         <div style={{
    //           backgroundColor: "#fff",
    //           padding: "20px",
    //           borderRadius: "10px",
    //           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    //           textAlign: "center",
    //         }}>
    //           <ReactCrop
    //             src={imageSrc}
    //             crop={crop}
    //             onChange={(newCrop) => setCrop(newCrop)}
    //             onComplete={onCropComplete}
    //           >
    //             <img ref={imgRef} src={imageSrc} alt="Crop me" 
    //             style={{ maxWidth: "100%", maxHeight: "400px", height: "auto", width: "auto" }} />
    //           </ReactCrop>
    //           <button
    //             onClick={() => {
    //               setProfileImage(croppedImage || imageSrc);
    //               setImageSrc(null);
    //               setCroppedImage(null);
    //             }}
    //             style={{
    //               width: "100%",
    //               padding: "10px",
    //               marginTop: "10px",
    //               backgroundColor: "#FFC300",
    //               border: "none",
    //               borderRadius: "5px",
    //               cursor: "pointer",
    //             }}
    //             onLoad={(e) => {
    //                 // Ensure the image is fully loaded before cropping
    //                 if (imgRef.current) {
    //                   const { naturalWidth, naturalHeight } = e.target;
    //                   setCrop({
    //                     ...crop,
    //                     width: naturalWidth,
    //                     height: naturalHeight,
    //                   });
    //                 }
    //               }}
    //           >
    //             Save
    //           </button>
    //           <button
    //             onClick={() => setImageSrc(null)}
    //             style={{
    //               width: "100%",
    //               padding: "10px",
    //               marginTop: "10px",
    //               backgroundColor: "#ccc",
    //               border: "none",
    //               borderRadius: "5px",
    //               cursor: "pointer",
    //             }}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     )}

    //     {/* Form Section */}
    //     <form onSubmit={handleSubmit}>
    //       <label>First Name:</label>
    //       <input
    //         type="text"
    //         value={firstName}
    //         onChange={(e) => setFirstName(e.target.value)}
    //         required
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <label>Last Name:</label>
    //       <input
    //         type="text"
    //         value={lastName}
    //         onChange={(e) => setLastName(e.target.value)}
    //         required
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <label>Phone Number:</label>
    //       <input
    //         type="tel"
    //         value={phoneNumber}
    //         onChange={(e) => setPhoneNumber(e.target.value)}
    //         required
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <label>Current Password:</label>
    //       <input
    //         type="password"
    //         value={currentPassword}
    //         onChange={(e) => setCurrentPassword(e.target.value)}
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <label>New Password:</label>
    //       <input
    //         type="password"
    //         value={newPassword}
    //         onChange={(e) => setNewPassword(e.target.value)}
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <label>Confirm New Password:</label>
    //       <input
    //         type="password"
    //         value={confirmNewPassword}
    //         onChange={(e) => setConfirmNewPassword(e.target.value)}
    //         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //       />

    //       <input
    //         type="file"
    //         ref={fileInputRef}
    //         style={{ display: "none" }}
    //         accept="image/*"
    //         onChange={previewImage}
    //       />

    //       <button type="submit" style={{ width: "100%", padding: "8px", marginBottom: "10px" }}>
    //         Update
    //       </button>
    //     </form>

    //     <button onClick={() => navigate("/profile")} style={{ width: "100%", padding: "8px" }}>
    //       Cancel
    //     </button>
    //   </div>
    // </div>


    <div className="row gap-3 justify-content-center">
   
        
        <div className="p-3 border-bottom border-top border-block-end-dashed tab-content">
          <div className="tab-pane show active overflow-hidden p-0 border-0" id="account-pane" role="tabpanel" aria-labelledby="account" tabIndex="0">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-1">
              <div className="fw-semibold d-block fs-15">Account Settings :</div>
              <div className="btn btn-primary btn-sm"><i className="ri-loop-left-line lh-1 me-2"></i>Restore Changes</div>
            </div>
            <div className="row gy-3">
              <div className="col-xl-12">
                <div className="d-flex align-items-start flex-wrap gap-3">
                  <div>
                    <span className="avatar avatar-xxl" style={{ marginLeft: "10px" }}>
                      {profileImage ? (
                        <img
                          src={profileImage.startsWith("data:image") ? profileImage : `http://localhost:3000${profileImage}`}
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
                        <p>No profile image uploaded.</p>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="fw-medium d-block mb-2">Profile Picture</span>
                    <div className="btn-list mb-1">
                      <button className="btn btn-sm btn-primary btn-wave" onClick={() => setShowModal(true)}>
                        <i className="ri-upload-2-line me-1"></i>Change Image
                      </button>
                      <button className="btn btn-sm btn-primary1-light btn-wave" onClick={() => setProfileImage("")}>
                        <i className="ri-delete-bin-line me-1"></i>Remove
                      </button>
                    </div>
                    <span className="d-block fs-12 text-muted">Use JPEG, PNG, or GIF. Best size: 200x200 pixels. Keep it under 5MB</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-12">
                <label htmlFor="profile-user-name" className="form-label">First Name :</label>
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
                <label htmlFor="profile-last-name" className="form-label">Last Name :</label>
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
                <label htmlFor="profile-phone-number" className="form-label">Phone Number :</label>
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
                <label htmlFor="profile-email" className="form-label">Email :</label>
                <input
                  type="email"
                  className="form-control"
                  id="profile-email"
                  value={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
              </div>
              <div className="col-xl-12">
                <label htmlFor="current-password" className="form-label">Current Password :</label>
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
                <label htmlFor="new-password" className="form-label">New Password :</label>
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
                <label htmlFor="confirm-password" className="form-label">Confirm New Password :</label>
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
            <button className="btn btn-primary2 btn-wave" onClick={() => {
              if (window.confirm("Are you sure you want to request account deletion?")) {
                handleDeleteAccount();
              }
            }}>Deactivate Account</button>
            <button className="btn btn-primary btn-wave" onClick={handleSubmit} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      

    {/* Modal for Image Source Selection */}
    {showModal && (
      <div className="modal-backdrop" style={{
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
        <div className="modal-content" style={{
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      width: "700px", // Taille réduite
      maxWidth: "90%", // Pour s'assurer qu'il reste responsive
      animation: "fadeIn 0.3s ease-in-out", // Animation d'entrée
    }}>
          {showCameraInModal ? (
            // Camera Section in Modal
            <div>
              <video ref={videoRef} width="500" height="400" autoPlay></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <button
                onClick={capturePhoto}
                className="btn btn-primary w-100 mb-2"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#007bff",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Capture
              </button>
              <button
                onClick={() => setShowCameraInModal(false)}
                className="btn btn-light w-100"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // Image Source Selection Section
            <>
              <h3>Choose Image Source</h3>
              <button
                onClick={() => {
                  setShowCameraInModal(true);
                  openCamera();
                }}
                className="btn btn-primary w-100 mb-2"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#007bff",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Capture Image
              </button>
              <button
                onClick={() => {
                  fileInputRef.current.click();
                  setShowModal(false);
                }}
                className="btn btn-primary w-100 mb-2"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#007bff",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Upload Image from PC
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-light w-100"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  color: "#333",
                  cursor: "pointer",
                }}
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
      <div className="modal-backdrop" style={{
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
        <div className="modal-content" style={{
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      width: "700px", // Taille réduite
      maxWidth: "90%", // Pour s'assurer qu'il reste responsive
      animation: "fadeIn 0.3s ease-in-out", // Animation d'entrée
    }}>
          <ReactCrop
            src={imageSrc}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop me"
              style={{ maxWidth: "100%", maxHeight: "500px", height: "auto", width: "auto" }}
            />
          </ReactCrop>
          <button
            onClick={() => {
              setProfileImage(croppedImage || imageSrc);
              setImageSrc(null);
              setCroppedImage(null);
            }}
            className="btn btn-primary w-100 mt-2"
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#007bff",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setImageSrc(null)}
            className="btn btn-light w-100 mt-2"
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
              color: "#333",
              cursor: "pointer",
            }}
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