import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SessionChecker = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();
  const lastCheckRef = useRef(0);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const performAuthCheck = async () => {
      const now = Date.now();
      // Throttle checks - only check every 10 seconds minimum
      if (now - lastCheckRef.current < 10000 || isCheckingRef.current) {
        return;
      }
      if (!isMounted || isCheckingRef.current) return;

      isCheckingRef.current = true;
      lastCheckRef.current = Date.now();

      try {
        await checkAuth({ location, showToast: true });
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        if (isMounted) {
          isCheckingRef.current = false;
        }
      }
    };

    performAuthCheck();

    // Background interval checks
    const interval = setInterval(() => {
      console.log("checking auth by interval");
      performAuthCheck();
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname, checkAuth]); // Check on all route changes

  return null;
};

export default SessionChecker;
