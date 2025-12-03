import express from 'express'
import { changePassword_with_token, createAccount, createUserByAdmin, deleteUser, forgetPassword, getAllUsers, getAuthenticatedUser, getTotalUsers, getUserById, login, logOut, requestAccountVerification, resendOTP, toggleUserStatus, updateUser, verifyOTP } from '../controller/auth.controller.js'
import { verifySession } from '../util/session.js';
import { body, param } from 'express-validator';
import { verifyRole } from '../util/verifyRole.js';
import { platformMetrics } from '../controller/stats.controller.js';
const authRoute = express.Router()
// , email, password, university_id, department
authRoute.post("/create-account", [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .trim(),
  body('email').notEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .withMessage("invalid email address").trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required").trim(),
  body("university_id")
    .notEmpty()
    .withMessage("university is required").trim(),
  body("department")
    .notEmpty()
    .withMessage("department is required").trim(),
], createAccount)
authRoute.post("/user-verification", verifyOTP)
authRoute.post("/user-login", [
  body('email').notEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .withMessage("invalid email address"),
  body("password").notEmpty().withMessage("Password is required")
], login);
authRoute.get("/users/get-all-users", verifySession, getAllUsers)
authRoute.get('/users/get-user/:user_id', verifySession, getUserById)
authRoute.put("/users/update-user/:user_id", [
  param("user_id").notEmpty().withMessage("user id is required")
], verifySession, updateUser);
authRoute.delete("/users/delete-user/:user_id", [param("user_id").notEmpty().withMessage("user id is required")], verifySession, verifyRole(['admin', 'student']), deleteUser);
authRoute.put("/users/admin/update-account-status",
  [body("status")
    .notEmpty()
    .withMessage("status is required"),
  body("selected_users")
    .notEmpty()
    .withMessage("user ids are required")
  ],
  verifySession, verifyRole(['admin']),
  toggleUserStatus);
authRoute.get("/users/get-authenticated-user", verifySession, getAuthenticatedUser)
authRoute.post("/users/logout", verifySession, logOut);

authRoute.post("/users/forget-password", [body('email').notEmpty()
  .withMessage("Email is required")
  .normalizeEmail()], forgetPassword)
authRoute.post("/users/change-password-with-token", [
  body("token").notEmpty().withMessage("token is required"),
  body('email').notEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .withMessage("invalid email address"),
  body("password").notEmpty().withMessage("Password is required")

], changePassword_with_token)
authRoute.post("/users/request-account-verification", [body('email').notEmpty()
  .withMessage("Email is required")
  .normalizeEmail()], requestAccountVerification)
authRoute.post("/users/resend-otp", [body('email').notEmpty()
  .withMessage("Email is required")
  .normalizeEmail()], resendOTP)
authRoute.patch("/users/admin-update-user/:user_id/:admin_id", [
  param("user_id").notEmpty().withMessage("user id is required"),
  param("admin_id").notEmpty().withMessage("admin id is required")
], verifySession, verifyRole(['admin']), updateUser)

authRoute.post("/users/admin/create-user", [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .trim(),
  body('email').notEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .withMessage("invalid email address").trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required").trim(),
  body("university_id")
    .notEmpty()
    .withMessage("university is required").trim(),
  body("department")
    .notEmpty()
    .withMessage("department is required").trim(),
], verifySession, verifyRole(['admin']), createUserByAdmin)
export default authRoute