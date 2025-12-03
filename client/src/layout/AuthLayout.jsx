// AuthLayout.jsx
import React from "react";
import { GraduationCap, Sparkles } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 h-full  flex overflow-x-hidden overflow-y-auto flex-col  py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduConnect
            </span>
          </div>

        </div>
         <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>

            {children}
          </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated Background Elements - NOW CONTAINED */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-24 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full flex flex-col justify-center items-center text-white px-12">
          <div className="max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Join Your Campus Network
              </h2>
              <p className="text-white/80 leading-relaxed">
                Connect with classmates, form study groups, and access shared
                resources. Thousands of students are already learning smarter
                together.
              </p>
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center font-bold">
                  SC
                </div>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-white/60 text-sm">Computer Science</p>
                </div>
              </div>
              <p className="text-white/80 italic">
                "EduConnect transformed how I study. Found my perfect study
                group in minutes!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
