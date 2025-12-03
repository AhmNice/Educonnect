import React, { useState, useEffect } from "react";
import StudentNavbar from "../components/StudentNavbar";
import AdminNavbar from "../components/AdminNavbar";
import Header from "../components/Header";
import { useAuthStore } from "../store/authStore";


const PageLayout = ({allowDefaultPadding, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse sidebar on mobile, expand on desktop
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu when clicking on overlay
  const handleOverlayClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${
          isMobile
            ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out"
            : "relative"
        }
        ${isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0"}
        ${!isMobile ? (sidebarCollapsed ? "w-16" : "w-64") : "w-80"}
        transition-all duration-300 ease-in-out flex-shrink-0
      `}
      >
        {user?.role === "admin" ? (
          <AdminNavbar
            collapse={isMobile ? false : sidebarCollapsed}
            isMobile={isMobile}
            onClose={handleCloseSidebar}
            user={user}
          />
        ) : (
          <StudentNavbar
            collapse={isMobile ? false : sidebarCollapsed}
            isMobile={isMobile}
            onClose={handleCloseSidebar}
            user={user}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={handleMenuToggle} user={user} />

        {/* Main Content */}
        <main className="flex-1 no-scrollbar overflow-y-auto overflow-x-hidden">
          <div className={`${allowDefaultPadding? 'p-4 md:p-6': null}`}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
