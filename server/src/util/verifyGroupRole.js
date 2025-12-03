export const verifyGroupRole = (allowedRoles) => {
  return (req, res, next) => {
    const { user_id } = req.user;
    try {
      const query = `
        SELECT role
        FROM learning.group_members
        WHERE group_id = $1 AND user_id = $2;
      `;
      const group_id = req.params.group_id || req.body.group_id;

      pool.query(query, [group_id, user_id])
        .then(result => {
          if (result.rowCount === 0) {
            return res.status(403).json({
              success: false,
              message: "Access denied: not a group member",
            });
          }
        });
      const userRole = result.rows[0].role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient group permissions",
        });
      }
    } catch (error) {
      console.error("❌ Error verifying group role:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error during group role verification",
      });
    }
  }
}