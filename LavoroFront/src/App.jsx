import "./App.css";
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import SignUp from "./user/Signup"; // Ensure the correct file name
import SignIn from "./user/Signin"; // Ensure the correct file name
import AuthContainer from './user/AuthContainer';
import Home from "./Home";
import VerifyEmail from "./user/verifymail";
import ForgotPassword from "./user/ForgetPassword";
import './styles.css'; 
import Profile from "./profile/profile";
import UpdateProfile from "./profile/updateProfile";

import AdminDashboard from "./admin/AdminDashboard"; 
import UserActivityLog from "./admin/accountLog";

import TasksPage from "./user/ActivitiesPage";
import ActivitiesPage from "./user/ActivitiesPage";
import ResetPassword from "./user/ResetPassword";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
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
    </>
  );
}

export default App;