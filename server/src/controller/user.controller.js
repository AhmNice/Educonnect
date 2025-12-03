import { User } from "../model/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
export const getUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findUserById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error getting user by id:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
