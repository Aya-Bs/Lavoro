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

import ActivitiesPage from "./user/ActivitiesPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./user/RefreshHandler";
import { useState } from "react";
import Layout from "./partials/Layout";
import Sales from "./project/Sales";
import CreateProject from "./project/createProject";
import ListPro from "./project/ProList";
<<<<<<< HEAD
import ProjectHistory from "./project/ProjectHistory";

=======
import AdminDashboardTwo from "./admin/AdminDashboard2";
>>>>>>> 82458ece5d7e6ce5d9226546b96ef45a447d77cd

import "../public/assets/css/icons.css";
import "../public/assets/css/remixicon.css";
import 'remixicon/fonts/remixicon.css';

import ProjectOverview from "./project/ProjectOverview";
<<<<<<< HEAD
import Archieve from "./project/Archieve";
import UserActivity from "./admin/UserActivity";
=======
import AuthContainer from "./user/AuthContainer";
>>>>>>> 82458ece5d7e6ce5d9226546b96ef45a447d77cd

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    <GoogleOAuthProvider clientId="893053722717-a3eudc815ujr6ne3tf5q3dlrvkbmls6d.apps.googleusercontent.com">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

<<<<<<< HEAD
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="*" element={<Navigate to="/signin" />} />
            {/* Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-activity/:userId" element={<UserActivity />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/createPro" element ={<CreateProject />} />
              <Route path="/overviewPro" element={<ProjectOverview />} />
              <Route path="/ListPro" element={<ListPro />} />
              <Route path="/archieve" element={< Archieve />} />
              <Route path="/HistoryPro/:projectId" element={<ProjectHistory />} />

=======
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboardTwo />} />
          <Route path="/user-activity/:userId" element={<UserActivityLog />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
>>>>>>> 82458ece5d7e6ce5d9226546b96ef45a447d77cd

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