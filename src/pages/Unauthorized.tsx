
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-yellow-100 p-6 rounded-full inline-block mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-16 w-16 text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          You don't have permission to access this page. Please login with an account that has the required permissions.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
            <Link to="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout and Switch Account
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
