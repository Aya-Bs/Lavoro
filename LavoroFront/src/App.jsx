<<<<<<< HEAD
import "./App.css";
=======
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
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
<<<<<<< HEAD
import UserActivityLog from "./admin/accountLog";
=======

>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
import ActivitiesPage from "./user/ActivitiesPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./user/RefreshHandler";
import { useState } from "react";
import Layout from "./partials/Layout";
import Sales from "./project/Sales";
import CreateProject from "./project/createProject";
import ListPro from "./project/ProList";
<<<<<<< HEAD
=======
import ProjectDash from "./project/ProjectDash";
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
import ProjectHistory from "./project/ProjectHistory";


import "../public/assets/css/icons.css";
import "../public/assets/css/remixicon.css";
import 'remixicon/fonts/remixicon.css';
<<<<<<< HEAD
import ProjectOverview from "./project/ProjectOverview";
import Archieve from "./project/Archieve";
=======

import ProjectOverview from "./project/ProjectOverview";
import AllProject from "./project/AllProject";
import Archieve from "./project/Archieve";
import UserActivity from "./admin/UserActivity";
import ArchiveOverview from "./project/ArchiveOverview";
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
<<<<<<< HEAD
      <GoogleOAuthProvider clientId="893053722717-a3eudc815ujr6ne3tf5q3dlrvkbmls6d.apps.googleusercontent.com">
        <BrowserRouter>
          <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            {/* Routes without Layout */}
            <Route path="/signin" element={<SignIn />} />
=======
    <GoogleOAuthProvider clientId="893053722717-a3eudc815ujr6ne3tf5q3dlrvkbmls6d.apps.googleusercontent.com">
      <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
      <Route path="/signin" element={<SignIn />} />
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="*" element={<Navigate to="/signin" />} />
<<<<<<< HEAD
=======
            
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
            {/* Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
<<<<<<< HEAD
              <Route path="/user-activity/:userId" element={<UserActivityLog />} />
=======
              <Route path="/user-activity/:userId" element={<UserActivity />} />
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/createPro" element ={<CreateProject />} />
<<<<<<< HEAD
              <Route path="/overviewPro" element={<ProjectOverview />} />
              <Route path="/ListPro" element={<ListPro />} />
              <Route path="/archieve" element={< Archieve />} />
              <Route path="/HistoryPro/:projectId" element={<ProjectHistory />} />


              
            </Route>
          </Routes>
        </BrowserRouter>
=======
              <Route path="/ProjectDash" element={<ProjectDash />} />
              <Route path="/AllProject" element={<AllProject />} />

 
              <Route path="/overviewPro/:id" element={<ProjectOverview />} />
              <Route path="/overviewArchive/:id" element={<ArchiveOverview />} />

              <Route path="/ListPro" element={<ListPro />} />
              <Route path="/archieve" element={< Archieve />} />


            </Route>
        </Routes>
      </BrowserRouter>
>>>>>>> 64fa7f4558e0bdf3db80f87a11b98f9080813356
      </GoogleOAuthProvider>
    </>
  );
}

export default App;