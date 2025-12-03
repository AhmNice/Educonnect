export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role
    try {
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }
    } catch (error) {
      console.error("❌ Error verifying role:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error during role verification",
      });
    }
  }
}