// App.js
import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  MessageCircle,
  FileText,
  Search,
  GraduationCap,
  Smartphone,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  X,
  Menu,
  Download,
  BookOpen,
  Target,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Study Groups",
      description: "Join or create groups based on your courses and subjects",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Discuss lectures, assignments, and projects instantly",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Share Resources",
      description:
        "Upload and access notes, past questions, and study materials",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Matching",
      description: "Find perfect study partners with similar goals and courses",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Peer Tutoring",
      description:
        "Learn from and teach your classmates in a collaborative space",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      course: "Computer Science",
      text: "EduConnect helped me find an amazing study group for Data Structures. My grades improved by a full letter!",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      course: "Biology",
      text: "The resource sharing feature saved me during finals. So many helpful notes and past papers!",
      rating: 5,
      avatar: "MJ",
    },
    {
      name: "Emily Rodriguez",
      course: "Business Administration",
      text: "I went from struggling alone to having a supportive learning community. Game changer!",
      rating: 5,
      avatar: "ER",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "200+", label: "Universities" },
    { number: "15K+", label: "Study Groups" },
    { number: "4.9", label: "App Store Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
                <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["Features", "How It Works", "Testimonials", "Download"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "_")}`}
                    className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {["Features", "How It Works", "Testimonials", "Download"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/ /g, "_")}`}
                      className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  )
                )}
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Campus.
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Connected.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop studying alone. EduConnect is the peer-to-peer app that
                brings your university's study network right to your fingertips.
                Form groups, share resources, and ace your courses—together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Join your campus study network today!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:rotate-1 transition-transform duration-300">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold">
                        Study Group - CS-201
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        A
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tl-none max-w-xs">
                        Hey! Anyone studying for CS-201 midterm?
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-gray-700 text-white p-4 rounded-2xl rounded-tr-none max-w-xs">
                        Yes! I have some great notes to share 📝
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        B
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        C
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tl-none max-w-xs">
                        Perfect! Let's form a study group 📚
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center space-x-2 mt-4 text-gray-400">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">Sarah is typing...</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl transform -rotate-6 animate-float">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl transform rotate-6 animate-float"
                style={{ animationDelay: "2s" }}
              >
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div
                className="absolute top-1/2 -right-12 bg-white p-4 rounded-2xl shadow-2xl transform -rotate-12 animate-float"
                style={{ animationDelay: "4s" }}
              >
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Collaborate smarter with tools designed specifically for
              university students. From study groups to resource sharing, we've
              got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how_it_works"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just three simple steps and transform your learning
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>

            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your profile with your university and courses",
                icon: <User className="w-6 h-6" />,
              },
              {
                step: "2",
                title: "Connect",
                desc: "Find study groups and partners with smart matching",
                icon: <Users className="w-6 h-6" />,
              },
              {
                step: "3",
                title: "Collaborate",
                desc: "Share resources, chat, and learn together",
                icon: <MessageCircle className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Students
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are already learning smarter and
              achieving more
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 shadow-lg">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial
                      ? "opacity-100 block"
                      : "opacity-0 hidden"
                  }`}
                >
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-2xl text-gray-700 mb-8 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600">{testimonial.course}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-indigo-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section
        id="download"
        className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who are already collaborating, sharing,
            and succeeding together on EduConnect. Download the app and start
            your journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-indigo-600 px-10 py-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
              <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Download Now - It's Free!</span>
            </button>

            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="group border-2 border-white text-white px-10 py-5 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300 font-bold text-lg flex items-center space-x-3"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* App Store Badges */}
          <div className="flex justify-center space-x-6 mt-12">
            <div className="bg-black/20 hover:bg-black/30 transition-colors duration-300 rounded-2xl px-8 py-4 cursor-pointer transform hover:scale-105">
              <div className="text-white text-center">
                <div className="font-semibold">Download on the</div>
                <div className="text-2xl font-bold">App Store</div>
              </div>
            </div>
            <div className="bg-black/20 hover:bg-black/30 transition-colors duration-300 rounded-2xl px-8 py-4 cursor-pointer transform hover:scale-105">
              <div className="text-white text-center">
                <div className="font-semibold">Get it on</div>
                <div className="text-2xl font-bold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="w-8 h-8 text-indigo-400" />
                <span className="text-2xl font-bold">EduConnect</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting students for smarter learning and better grades. Join
                the revolution in collaborative education.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Download", "Pricing", "Case Studies"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Blog"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Compliance"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 EduConnect. All rights reserved. Made with ❤️ for
              students everywhere.
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-4 -right-4 bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl">EduConnect Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
