import "./App.css";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import SignUp from "./user/Signup";
import SignIn from "./user/Signin";
import Home from "./Home";
import VerifyEmail from "./user/verifymail";
import ForgotPassword from "./user/ForgetPassword";
import ResetPassword from "./user/resetPassword";
import Profile from "./profile/profile";
import UpdateProfile from "./profile/updateProfile";
import AdminDashboard from "./admin/AdminDashboard";
import UserActivityLog from "./admin/accountLog";
import ActivitiesPage from "./user/ActivitiesPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./user/RefreshHandler";
import { useState } from "react";
import Layout from "./partials/Layout";
import Sales from "./project/Sales";
import CreateProject from "./project/createProject";
import ListPro from "./project/ProList";
import AdminDashboardTwo from "./admin/AdminDashboard2";


import "../public/assets/css/icons.css";
import "../public/assets/css/remixicon.css";
import 'remixicon/fonts/remixicon.css';
import ProjectOverview from "./project/ProjectOverview";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    <GoogleOAuthProvider clientId="893053722717-a3eudc815ujr6ne3tf5q3dlrvkbmls6d.apps.googleusercontent.com">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboardTwo />} />
          <Route path="/user-activity/:userId" element={<UserActivityLog />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          <Route path="/activities" element={<ActivitiesPage />} />
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