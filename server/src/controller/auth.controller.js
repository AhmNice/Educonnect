import { User } from "../model/User.js";
import { handleInputError } from "../util/handleInputValidation.js";
import bcryptjs from "bcryptjs";
import { createSession } from "../util/session.js";
import { University } from "../model/University.js";
import { sendOTPEmail, sendPasswordResetLink, sendPasswordResetSuccessEmail } from "../mail/emailServices.js";
import { generateOTP } from "../util/generateToken.js";
import { pool } from "../config/db.config.js";
import { logUserActivity } from "../util/userLogs.js";
// =============
// Create new user
// =============
export const createAccount = async (req, res) => {
  const { full_name, email, password, university_id, department } = req.body;

  await handleInputError(req, res);

  try {
    const userExists = await User.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const password_hash = await bcryptjs.hash(password, 10);
    const otp_code = generateOTP();
    const otp_expiry = new Date(new Date().getTime() + 5 * 60 * 1000)
    const newUser = new User({
      full_name,
      email,
      password_hash,
      university_id,
      department,
      otp_code,
      otp_expiry
    });

    const { user_data } = await newUser.save_user();
    const user = {
      otp: otp_code,
      full_name: user_data.full_name,
      email: user_data.email,

    }
    await sendOTPEmail(user)
    await logUserActivity(
      user_data.user_id,
      "account_creation",
      "New account registered successfully"
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// =============
// Login user
// =============
export const login = async (req, res) => {
  const { email, password } = req.body;
  await handleInputError(req, res);
  try {
    const userRecord = await User.findUserByEmail(email);
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const passwordIsValid = await bcryptjs.compare(password, userRecord.password_hash);
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Create session payload
    const session_user = {
      user_id: userRecord.user_data.user_id,
      full_name: userRecord.user_data.full_name,
      role: userRecord.user_data.role,
    };
    const university = await University.findById(userRecord.user_data.university_id);
    // remove password_hash before sending response
    const { password_hash, ...safe_user_data } = userRecord.user_data;
    const result = { ...safe_user_data, university: { ...university.university_data } }
    // console.log(result)
    // create session cookie
    await createSession(res, session_user);
    await logUserActivity(
      userRecord.user_data.user_id,
      "login",
      "User logged in successfully"
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: result,
    });

  } catch (error) {
    console.error("❌ Error logging in user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Forgot password (request reset link)
// =======================
export const forgetPassword = async (req, res) => {
  await handleInputError(req, res);

  const { email } = req.body;
  try {
    // 1. Check if user exists
    const userRecord = await User.findUserByEmail(email);
    // console.log(userRecord)
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "No user with this email found"
      });
    }

    // 2. Generate token
    const resetToken = await User.generatePasswordResetToken(email);
    if (!resetToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate reset token"
      });
    }

    // 3. Create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

    // 4. Send email
    await sendPasswordResetLink({ full_name: userRecord.user_data.full_name, resetLink, email: email })
    await logUserActivity(
      userRecord.user_data.user_id,
      "password_reset_request",
      "User requested a password reset link"
    );

    // 5. Respond success
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      resetLink, // remove in production for security
    });

  } catch (error) {
    console.error("Forget Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};
// ========================
// change password with reset token
// ========================
export const changePassword_with_token = async (req, res) => {
  await handleInputError(req, res)
  const { token, email, password } = req.body;
  console.log(token)
  try {
    // 1. FIND USER SAFELY
    const found = await User.findUserByEmail(email);
    if (!found) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    const { user_data, reset_token } = found;
    console.log(reset_token)

    // 2. CHECK TOKEN & EXPIRY
    const isExpired =
      Date.now() > new Date(user_data.reset_token_expiry).getTime();

    if (token !== reset_token || isExpired) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 3. HASH NEW PASSWORD
    const password_hash = await bcryptjs.hash(password, 10);

    const updates = {
      password_hash,
      is_verified: true,
      reset_token: null,
      reset_token_expiry: null,
    };

    // 4. UPDATE USER
    const response = await User.updateUser(user_data.user_id, updates);

    if (!response || !response.user_data) {
      return res
        .status(400)
        .json({ success: false, message: "Could not update password" });
    }
    const user = {
      email: found.user_data.email,
      full_name: found.user_data.full_name
    }
    await sendPasswordResetSuccessEmail(user)
    await logUserActivity(
      user_data.user_id,
      "password_reset",
      "User successfully changed password using reset token"
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: response.user_data,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================
// verify user email by OTP
// ========================
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await User.verifyUser({ email, otp_code: otp });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      })
    }
    await logUserActivity(
      result.user_data.user_id,
      "otp_verification",
      "User verified account using OTP"
    );

    return res.status(200).json({
      success: true,
      message: result.success,
      user: result.user_data
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findUserByEmail(email);

    // Validate
    if (!user?.user_data) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // If user is already verified, no need to resend OTP
    if (user.user_data.is_verified) {
      return res.status(409).json({
        success: false,
        message: "Account is already verified.",
      });
    }

    // Generate new OTP + expiry
    const otp_code = generateOTP();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to DB
    await User.updateUser(user.user_data.user_id, { otp_code, otp_expiry });

    // Prepare email options
    const option = {
      full_name: user.user_data.full_name,
      email,
      otp_code,
    };

    // Send OTP email
    await sendOTPEmail(option);
    await logUserActivity(
      user.user_data.user_id,
      "otp_resend",
      "A new OTP was sent to the user"
    );


    return res.status(200).json({
      success: true,
      message: "A new verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("Error resending OTP:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const requestAccountVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findUserByEmail(email);

    // User not found
    if (!user?.user_data) {
      return res.status(404).json({
        success: false,
        message: "User not found. You can't request account verification.",
      });
    }

    // If already verified
    if (user.user_data.is_verified) {
      return res.status(409).json({
        success: false,
        message: "Account is already verified.",
      });
    }

    // Generate OTP
    const otp_code = generateOTP();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Update user record
    await User.updateUser(user.user_data.user_id, { otp_code, otp_expiry });
    console.log(otp_code)
    // Send OTP email
    const option = {
      full_name: user.user_data.full_name,
      email,
      otp: otp_code,
    };

    await sendOTPEmail(option);
    await logUserActivity(
      user.user_data.user_id,
      "verification_request",
      "User requested account verification OTP"
    );


    return res.status(200).json({
      success: true,
      message: "Verification OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Error requesting account verification:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ========================
// Get all users
// ========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Get user by ID
// ========================
export const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const userRecord = await User.findUserById(user_id);
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: userRecord.user_data,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Update user
// ========================
export const updateUser = async (req, res) => {
  await handleInputError(req, res)
  const { user_id } = req.params;
  const updateData = req.body; // e.g., { full_name, department, role }
  try {
    const updatedUser = await User.updateUser(user_id, updateData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await logUserActivity(
      user_id,
      "update_profile",
      "User profile updated"
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser.user_data,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Delete user
// ========================
export const deleteUser = async (req, res) => {
  await handleInputError(req, res)

  const { user_id } = req.params;
  try {
    const deleted = await User.deleteUser(user_id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Suspend or activate user
// ========================
export const toggleUserStatus = async (req, res) => {
  await handleInputError(req, res);
  const { selected_users, status } = req.body;

  // Validate selected users
  if (!Array.isArray(selected_users) || selected_users.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No users selected",
    });
  }

  // Validate status
  if (!["active", "suspended"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const updatedUsers = [];

    for (const user_id of selected_users) {
      const updatedUser = await User.updateUser(user_id, { status });

      if (updatedUser?.user_data) {
        updatedUsers.push(updatedUser.user_data);

        // 🔥 Log activity for EACH updated user
        await logUserActivity(
          user_id,
          "status_update",
          `User status changed to '${status}'`
        );
      }
    }

    if (updatedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User status updated to '${status}'`,
      updatedUsers,
    });

  } catch (error) {
    console.error("❌ Error updating user status:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================
// send authenticated  user
// ========================
export const getAuthenticatedUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Fetch full user data
    const userRecord = await User.findUserById(user.user_id);
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const university = await University.findById(userRecord.user_data.university_id);
    // remove password_hash before sending response
    const { password_hash, ...safe_user_data } = userRecord.user_data;
    const result = { ...safe_user_data, university: { ...university.university_data } }
    return res.status(200).json({
      success: true,
      message: "Authenticated user fetched successfully",
      user: result, // safe user data
    });
  } catch (error) {
    console.error("❌ Error fetching authenticated user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================
// Log out  user
// ========================
export const logOut = async (req, res) => {
  try {
    const SESSION_NAME = "edu_connect_session";
    // if (req.user?.email) {
    //   await User.markUserOffline(req.user.email); // you can define this similar to markUserOnline
    // }
    res.clearCookie(SESSION_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    if (req.user?.user_id) {
      await logUserActivity(
        req.user.user_id,
        "logout",
        "User logged out"
      );
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error trying to log out user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getTotalUsers = async () => {
  try {
    const users = await User.getAll();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    })
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export const createUserByAdmin = async (req, res) => {
  const { full_name, email, password, university_id, department, role } = req.body;
  await handleInputError(req, res);
  try {
    const userExists = await User.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const password_hash = await bcryptjs.hash(password, 10);
    const newUser = new User({
      full_name,
      email,
      password_hash,
      university_id,
      department,
      role
    });
    await newUser.save_user();
    await logUserActivity(
      newUser.user_data.user_id,
      "admin_user_creation",
      "Admin created a new user account"
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser.user_data,
    });
  } catch (error) {
    console.error("❌ Error creating user by admin:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}