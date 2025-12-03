import { University } from "../model/University.js";
import { handleInputError } from "../util/handleInputValidation.js";

// ======================================
// CREATE UNIVERSITY
// ======================================
export const createUniversity = async (req, res) => {
  const { name, location, contact_email } = req.body;

  await handleInputError(req, res);

  try {
    const newUniversity = new University({
      name,
      location,
      contact_email
    });

    const saved_university = await newUniversity.save();
    if (!saved_university.university_data) {
      res.status(400).json({
        success: false,
        message: saved_university.message
      })
    }

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      data: saved_university.university_data,
    });
  } catch (error) {
    console.error("❌ Error creating university:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ======================================
// GET ALL UNIVERSITIES
// ======================================
export const getAllUniversities = async (req, res) => {
  try {
    const results = await University.getAll();

    return res.status(200).json({
      success: true,
      message:'',
      universities: results.universities,
    });
  } catch (error) {
    console.error("❌ Error fetching universities:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ======================================
// GET ONE UNIVERSITY BY ID
// ======================================
export const getUniversityById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await University.findById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.status(200).json({
      success: true,
      university: result.university_data,
    });
  } catch (error) {
    console.error("❌ Error fetching university:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ======================================
// UPDATE UNIVERSITY
// ======================================
export const updateUniversity = async (req, res) => {
  const { university_id } = req.params;
  const updates = req.body;

  try {
    const result = await University.updateUniversity(university_id, updates);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "University updated successfully",
      updated_university: result.updated_university,
    });
  } catch (error) {
    console.error("❌ Error updating university:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ======================================
// DELETE UNIVERSITY
// ======================================
export const deleteUniversity = async (req, res) => {
  const { university_id } = req.params;

  try {
    const result = await University.deleteUniversity(university_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "University deleted successfully",
      deleted_university: result.deleted_university,
    });
  } catch (error) {
    console.error("❌ Error deleting university:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
