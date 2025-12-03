import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
  FileText,
  Users,
  BookOpen
} from "lucide-react";
import PageLayout from "../layout/PageLayout";

const SupportContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    urgency: "medium"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const categories = [
    { value: "technical", label: "Technical Support", icon: HelpCircle },
    { value: "account", label: "Account Issues", icon: Users },
    { value: "billing", label: "Billing & Payments", icon: FileText },
    { value: "academic", label: "Academic Features", icon: BookOpen },
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "bug", label: "Report a Bug", icon: AlertCircle }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. We'll send a reset link to your email."
    },
    {
      question: "Why can't I access my courses?",
      answer: "This could be due to browser cache issues or account verification. Try clearing your cache or contact support."
    },
    {
      question: "How do I join a study group?",
      answer: "Navigate to the 'Study Groups' section in your dashboard and browse available groups for your courses."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and follow best practices to protect your information."
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.subject.trim()) {
      setError("Please enter a subject");
      return false;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setError("Please enter a detailed message (at least 10 characters)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Replace with actual API call
      // const response = await axios.post('/api/support/contact', formData);

      setIsSubmitted(true);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send message. Please try again or email us directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isSubmitted) {
    return (

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success Message */}
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                  <div className="absolute inset-0 bg-green-100 rounded-full blur-sm"></div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Message Sent Successfully!
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Thank you for reaching out to EduConnect support. We've received your message and will get back to you within 24 hours.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li>• You'll receive a confirmation email shortly</li>
                      <li>• Our team will review your request</li>
                      <li>• We'll respond via email within 24 hours</li>
                      <li>• For urgent issues, we may contact you by phone</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Send Another Message
                </button>
                <button
                  onClick={handleBack}
                  className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

    );
  }

  return (

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              We're Here to Help
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our support team. We're dedicated to helping you succeed with EduConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information - Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Methods */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Methods</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">support@educconnect.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-EDUC</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Response Time</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Email Support:</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support:</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Chat:</span>
                    <span className="font-medium">Instant</span>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="your@university.edu"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Category & Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Need help soon</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - System down</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief description of your issue"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-vertical"
                      placeholder="Please provide detailed information about your issue or question..."
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Please include any error messages, steps to reproduce, and what you were trying to accomplish.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/help"
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                  >
                    View all FAQs and help articles →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default SupportContact;