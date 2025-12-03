import cloudinary from '../config/cloudinary.js';
import { Resource } from '../model/Resource.js';
import { User } from '../model/User.js';
import { Course } from '../model/Course.js';
import getShortFileType from '../util/getFileType.js';

// ======================================================
// ADD RESOURCE
// ======================================================
export const addResources = async (req, res) => {
  const {
    uploader_id,
    course,
    description,
    access,
    tags = [],
    externalUrl,
    videoUrl,
    title
  } = req.body;

  if (!req.file && !videoUrl && !externalUrl) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter - file OR url"
    });
  }

  try {
    // Validate uploader
    const uploader = await User.findUserById(uploader_id);
    if (!uploader?.user_data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate course
    const courseNeed = await Course.findById(course);
    if (!courseNeed) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let file_url = null;
    let file_type = null;

    // ==============================
    // Handle Cloudinary upload
    // ==============================
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      const dataUri = `data:${mimeType};base64,${base64}`;

      // Detect resource type
      let resourceType = "auto";
      const rawTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "text/plain"
      ];

      if (rawTypes.includes(mimeType)) resourceType = "raw";

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "EDU-CONNECT/resources",
        resource_type: resourceType,
        public_id: `${title}-${uploader.user_data.full_name}-${Date.now()}`,
      });

      file_url = uploadResult.secure_url;
      file_type = getShortFileType(mimeType);
    }

    // ==============================
    // External or video URL
    // ==============================
    if (!req.file && externalUrl) {
      file_url = externalUrl;
      file_type = "external";
    } else if (!req.file && videoUrl) {
      file_url = videoUrl;
      file_type = "video";
    }

    // ==============================
    // Save to database
    // ==============================
    const resource = new Resource({
      uploader_id,
      course_id: course,
      file_url,
      access,
      file_type,
      title,
      tags,
      description
    });

    const saved = await resource.save();

    return res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource: saved
    });

  } catch (error) {
    console.log("Error adding resource:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ======================================================
// GET ALL RESOURCES
// ======================================================
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.getAllResources();

    return res.status(200).json({
      success: true,
      resources
    });

  } catch (error) {
    console.log("Error fetching resources:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ======================================================
// GET RESOURCE BY ID
// ======================================================
export const getResourceById = async (req, res) => {
  const { resource_id } = req.params;

  try {
    const resource = await Resource.getResourceById(resource_id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    return res.status(200).json({
      success: true,
      resource
    });

  } catch (error) {
    console.log("Error fetching resource:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ======================================================
// DELETE RESOURCE
// ======================================================
export const deleteResourceById = async (req, res) => {
  const { resource_id, user_id } = req.params;

  try {
    const resource = await Resource.getResourceById(resource_id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }


    if (resource.uploader_id !== user_id) {
      return res.status(400).json({
        success: false,
        message: "UnAuthorized"
      })
    }

    // Delete Cloudinary asset only if it is a Cloudinary URL
    if (resource.file_url?.includes("cloudinary")) {
      try {
        // Extract public_id
        const publicId = resource.file_url
          .split("/")
          .slice(-1)[0]
          .split(".")[0];

        await cloudinary.uploader.destroy(
          `EDU-CONNECT/resources/${publicId}`,
          { resource_type: "raw" }
        );
      } catch (err) {
        console.log("Cloudinary deletion error:", err.message);
      }
    }

    // Delete from DB
    await pool.query(
      "DELETE FROM learning.course_resources WHERE resource_id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully"
    });

  } catch (error) {
    console.log("Error deleting resource:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const downloadResource = async (req, res) => {
  const { resource_id } = req.params;
  try {
    const resource = await Resource.getResourceById(resource_id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "This resource might have been removed",
      });
    }

    // For raw/document uploads, Cloudinary allows `attachment=true`
    let downloadUrl = resource.file_url;

    // If you want Cloudinary to force download
    if (resource.file_type !== "external resource" && resource.file_type !== "external video") {
      const urlParts = new URL(resource.file_url);
      urlParts.searchParams.append("attachment", "true");
      downloadUrl = urlParts.toString();
    }

    return res.status(200).json({
      success: true,
      url: downloadUrl,
    });
  } catch (error) {
    console.log("Error trying to generate download link:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
