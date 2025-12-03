import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const SESSION_NAME = "edu_connect_session";

// Ensure secret is set
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// ==========================
// Create session
// ==========================
export const createSession = async (res, user_data) => {
  try {
    // Only include minimal user info in the token
    const { user_id, role, full_name } = user_data;

    const token = jwt.sign({ user_id, role, full_name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set cookie
    res.cookie(SESSION_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return token;
  } catch (error) {
    console.error("❌ Error creating session:", error.message);
    throw error;
  }
};

// ==========================
// Verify session middleware
// ==========================
export const verifySession = async (req, res, next) => {
  const token = req.cookies[SESSION_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No session token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // minimal user info
    next();
  } catch (error) {
    // Clear invalid/expired token from client
    res.clearCookie(SESSION_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    console.error("❌ Invalid session token:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid session token",
    });
  }
};
