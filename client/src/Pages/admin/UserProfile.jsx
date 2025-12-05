// UserProfilePage.js - A dedicated user profile page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Building,
  Award,
  Star,
  Activity,
  Users,
  MessageCircle,
  Edit,
  Share2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import PageLayout from "../../layout/PageLayout";
import { useActivityStore } from "../../store/logStore";
import ActivityLogList from "../../components/ActivityList";

const UserProfilePage = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetch_user_log, userActivity } = useActivityStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get(`/users/get-user/${user_id}`);
        if (data.success) {
          setUser(data.user);
        } else {
          toast.error(data.message);
          navigate("/admin/users");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
        navigate("/admin/users");
      } finally {
        setIsLoading(false);
      }
      await fetch_user_log(user_id);
    };

    if (user_id) {
      fetchUserProfile();
    }
  }, [user_id, navigate]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" size={34} />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User not found
          </h2>
          <button
            onClick={() => navigate("/admin/users")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Users
          </button>
        </div>
      </PageLayout>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center text-white hover:text-gray-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Users
              </button>
            </div>

            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full bg-white p-1 mr-6">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.full_name
                    ? user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "??"}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.full_name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-white/90">{user.email}</span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    {user.role}
                  </span>
                  {user.status === "active" && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Joined {formatDate(user?.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              {user.university_name && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Academic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.university_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user?.university_year || "Current Student"}
                        </p>
                      </div>
                    </div>
                    {user.department && (
                      <div className="flex items-start">
                        <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            {user?.degree || "Bachelor's Degree"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About
                </h3>
                <p className="text-gray-600">
                  {user?.bio || "No bio provided."}
                </p>
              </div>

              {/* Skills */}


              {/* Recent Activity */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <ActivityLogList
                  viewType="compact"
                  onRefresh={async () => {
                    await fetch_user_log(user_id);
                  }}
                  location={`/admin/users/log/${user_id}`}
                  activities={userActivity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserProfilePage;
