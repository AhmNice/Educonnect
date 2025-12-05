import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./Pages/LandingPage";
import Layout from "./root/Layout";
import Login from "./Pages/LoginPage";
import Signup from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/404Page";
import Admin_DashboardPage from "./Pages/admin/DashboardPage";
import UniversityPage from "./Pages/admin/UniversityPage";
import UsersPage_admin from "./Pages/admin/UserPage";
import ProtectedRoute from "./hook/ProtectedRoute";
import GuestRoute from "./hook/GuestRoute";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import RequestPasswordReset from "./Pages/RequestPasswordChange";
import ResetPassword from "./Pages/ResetPassword";
import OTPVerification from "./Pages/OTPverificationPage";
import SupportContact from "./Pages/SupportContactPage";
import StudyGroup from "./Pages/StudyGroup";
import PublicGroup from "./Pages/PublicGroup";
import Courses from "./Pages/Courses";
import GroupManagement from "./Pages/GroupManagement";
import Chat from "./Pages/Chat";
import Resources from "./Pages/Resources";
import UnverifiedUser from "./hook/Unverified";
import Profile from "./Pages/Profile";
import SettingsPage from "./Pages/SettingsPage";
import JoinGroup from "./Pages/JoinGroup";
import UserProfilePage from "./Pages/admin/UserProfile";
import CoursesPage from "./Pages/admin/CoursesPage";
import StudyGroupsPage from "./Pages/admin/StudyGroupPage";
import ResourcesPage from "./Pages/admin/ResoursesPage";
import UnderConstruction from "./components/UnderConstruction";
import UserActivityLogPage from "./Pages/admin/LogPage";
import UserLogPage from "./Pages/admin/UserLogPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="support" element={<SupportContact />} />
        <Route
          path="login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="request-password-reset"
          element={
            <GuestRoute>
              <RequestPasswordReset />
            </GuestRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="verify-otp"
          element={
            <UnverifiedUser>
              <OTPVerification />
            </UnverifiedUser>
          }
        />
        <Route
          path="signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-groups"
          element={
            <ProtectedRoute requiredRole="student">
              <StudyGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="groups/public"
          element={
            <ProtectedRoute requiredRole="student">
              <PublicGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="groups/invite"
          element={
            <ProtectedRoute requiredRole="student">
              <JoinGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute requiredRole="student">
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-groups/manage/:groupId"
          element={
            <ProtectedRoute requiredRole="student">
              <GroupManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute requiredRole="student">
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute requiredRole="student">
              <UnderConstruction />
            </ProtectedRoute>
          }
        />
        <Route
          path="resources"
          element={
            <ProtectedRoute requiredRole="student">
              <Resources />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Admin Protected Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin_DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/universities"
          element={
            <ProtectedRoute requiredRole="admin">
              <UniversityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsersPage_admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/user-profile/:user_id"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserActivityLogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/log/:user_id"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserLogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/courses"
          element={
            <ProtectedRoute requiredRole="admin">
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/groups"
          element={
            <ProtectedRoute requiredRole="admin">
              <StudyGroupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/resources"
          element={
            <ProtectedRoute requiredRole="admin">
              <ResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <UnderConstruction />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <UnderConstruction />
            </ProtectedRoute>
          }
        />

        {/* Error Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
