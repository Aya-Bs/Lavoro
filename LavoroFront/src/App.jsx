import "./App.css";
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import SignUp from "./user/Signup"; // Ensure the correct file name
import SignIn from "./user/Signin"; // Ensure the correct file name
import AuthContainer from './user/AuthContainer';
import Home from "./Home";
import VerifyEmail from "./user/verifymail";
import ForgotPassword from "./user/ForgetPassword";
import ResetPassword from "./user/resetPassword";
import './styles.css'; // Assuming this is where your styles are located
import Profile from "./profile/profile";
import UpdateProfile from "./profile/updateProfile";
import RefreshHandler from "./user/RefreshHandler";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <GoogleOAuthProvider clientId="893053722717-a3eudc815ujr6ne3tf5q3dlrvkbmls6d.apps.googleusercontent.com">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          <Route
            path="/auth/*"
            element={
              <div className="App">
                <AuthContainer />
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/auth" />} />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;