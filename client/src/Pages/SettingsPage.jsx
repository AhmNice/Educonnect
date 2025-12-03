import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  Download,
  Key,
  UserLock,
} from "lucide-react";
import PageLayout from "../layout/PageLayout";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState("account");
  const [isLoading, setIsLoading] = useState(false);

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    language: "english",
    timezone: "EST",
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showActivity: true,
    allowMessages: true,
    dataSharing: false,
  });
  const sections = [
    { id: "account", label: "Account", icon: User, color: "text-blue-500" },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      color: "text-orange-500",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      color: "text-gray-500",
    },
  ];

  const handleAccountVerification = () => {
    navigate("/verify-otp", {
      state: {
        email: user.email,
        purpose: "Verification",
      },
    });
  };
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update profile with account settings
      await updateProfile({
        full_name: accountSettings.full_name,
        email: accountSettings.email,
        phone: accountSettings.phone,
      });

      // Show success message
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      // Reset all settings to default
      setAccountSettings({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        language: "english",
        timezone: "EST",
      });
      setPrivacySettings({
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showActivity: true,
        allowMessages: true,
        dataSharing: false,
      });
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const SettingSection = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <SettingSection title="Personal Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={accountSettings.full_name}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accountSettings.phone}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </SettingSection>

            <SettingSection title="Account Actions">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-500">
                        Update your password regularly
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Export Data</h3>
                      <p className="text-sm text-gray-500">
                        Download your personal data
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <div>
                      <h3 className="font-medium text-red-900">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-500">
                        Permanently delete your account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </SettingSection>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <SettingSection title="Profile Visibility">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who can see your profile?
                  </label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        profileVisibility: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="public">Everyone</option>
                    <option value="study_groups">Study Groups Only</option>
                    <option value="private">Only Me</option>
                  </select>
                </div>
                <ToggleSwitch
                  enabled={privacySettings.showEmail}
                  onChange={(value) =>
                    setPrivacySettings({ ...privacySettings, showEmail: value })
                  }
                  label="Show Email Address"
                  description="Allow others to see your email"
                />
                <ToggleSwitch
                  enabled={privacySettings.showPhone}
                  onChange={(value) =>
                    setPrivacySettings({ ...privacySettings, showPhone: value })
                  }
                  label="Show Phone Number"
                  description="Allow others to see your phone number"
                />
                <ToggleSwitch
                  enabled={privacySettings.showActivity}
                  onChange={(value) =>
                    setPrivacySettings({
                      ...privacySettings,
                      showActivity: value,
                    })
                  }
                  label="Show Activity Status"
                  description="Display when you're active"
                />
                <ToggleSwitch
                  enabled={privacySettings.allowMessages}
                  onChange={(value) =>
                    setPrivacySettings({
                      ...privacySettings,
                      allowMessages: value,
                    })
                  }
                  label="Allow Direct Messages"
                  description="Let others send you messages"
                />
              </div>
            </SettingSection>

            <SettingSection title="Data & Privacy">
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={privacySettings.dataSharing}
                  onChange={(value) =>
                    setPrivacySettings({
                      ...privacySettings,
                      dataSharing: value,
                    })
                  }
                  label="Data Sharing for Analytics"
                  description="Help improve EduConnect by sharing usage data"
                />
              </div>
            </SettingSection>

            <SettingSection title="Security">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Disabled</span>
                </button>
                {user && !user.is_verified && (
                  <button
                    onClick={() => {
                      handleAccountVerification();
                    }}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <UserLock className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Account Verification
                        </h3>
                        <p className="text-sm text-gray-500">
                          Verify your account
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </SettingSection>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <SettingSection title="Support">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Contact Support
                      </h3>
                      <p className="text-sm text-gray-500">
                        Get help from our support team
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Help Center</h3>
                      <p className="text-sm text-gray-500">
                        Browse documentation and FAQs
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Community Forum
                      </h3>
                      <p className="text-sm text-gray-500">
                        Connect with other students
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </SettingSection>

            <SettingSection title="About">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">App Version</span>
                  <span className="text-sm font-medium text-gray-900">
                    1.0.0
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    Jan 15, 2024
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Terms of Service
                  </span>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    View
                  </button>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Privacy Policy</span>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    View
                  </button>
                </div>
              </div>
            </SettingSection>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout allowDefaultPadding={true}>
      <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pt-2">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">
                  Manage your account preferences and privacy settings
                </p>
              </div>
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={handleResetSettings}
                  className="px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 ">
              <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm p-1 sticky top-6">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <section.icon
                      className={`w-5 h-5 ${
                        activeSection === section.id
                          ? "text-indigo-600"
                          : section.color
                      }`}
                    />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}

                {/* Logout Button */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
