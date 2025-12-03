import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  GraduationCap,
  Settings,
} from "lucide-react";
import PageLayout from "../layout/PageLayout";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "Passionate student focused on academic excellence and collaborative learning.",
    location: user?.location || "Stanford, CA",
    university: user?.university?.name || "Stanford University",
    department: user?.department || "Computer Science",
    major: user?.major || "Computer Science",
    graduation_year: user?.graduation_year || "2025",
    interests: user?.interests || ["Machine Learning", "Web Development", "Data Structures", "Algorithms"],
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "Passionate student focused on academic excellence and collaborative learning.",
      location: user?.location || "Stanford, CA",
      university: user?.university?.name || "Stanford University",
      department: user?.department || "Computer Science",
      major: user?.major || "Computer Science",
      graduation_year: user?.graduation_year || "2025",
      interests: user?.interests || ["Machine Learning", "Web Development", "Data Structures", "Algorithms"],
    });
    setIsEditing(false);
  };

  const handleInterestRemove = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleInterestAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newInterest = e.target.value.trim();
      if (!formData.interests.includes(newInterest)) {
        setFormData({
          ...formData,
          interests: [...formData.interests, newInterest]
        });
      }
      e.target.value = '';
    }
  };

  return (
    <PageLayout allowDefaultPadding={true}>
      <div className="min-h-screen bg-gray-50 pt-2">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your personal information and academic details</p>
              </div>
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={() => navigate("/settings")}
                  className="px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Profile Picture */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="text-xl font-bold text-gray-900 text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="text-gray-600 text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 mt-1 w-full"
                />
              ) : (
                <p className="text-gray-600">{formData.major} Major</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-balance truncate">{user?.email}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{formData.phone || "Not provided"}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{formData.location}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{formData.university}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{formData.department}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.graduation_year}
                      onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    <span className="text-sm">Class of {formData.graduation_year}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-3">About</h3>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                  className="w-full bg-transparent border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="text-sm text-gray-600">{formData.bio}</p>
              )}
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                  >
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => handleInterestRemove(interest)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <input
                    type="text"
                    placeholder="Add interest..."
                    onKeyPress={handleInterestAdd}
                    className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;