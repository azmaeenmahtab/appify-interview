import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Fast check: if no token exists, redirect immediately
      if (!authService.isAuthenticated()) {
        setIsVerifying(false);
        setShowPopup(true);
        return;
      }

      // Token exists, verify with backend
      const result = await authService.verifyToken();
      setIsVerifying(false);
      
      if (!result.valid) {
        setShowPopup(true);
      }
    };

    verifyAuth();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, countdown]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && showPopup) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [countdown, showPopup]);

  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login after countdown
  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  // Show unauthorized popup
  if (showPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-6">
              Unauthorized request. Please login again to continue.
            </p>
            
            {/* Countdown */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{countdown}</div>
              <p className="text-sm text-gray-600">Redirecting to login page...</p>
            </div>
            
            {/* Manual redirect button */}
            <button
              onClick={() => setShouldRedirect(true)}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Token is valid, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
