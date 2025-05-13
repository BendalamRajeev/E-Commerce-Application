
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-9xl font-bold text-brand-purple mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          We're sorry, the page you requested could not be found. Please check the URL or go back to the homepage.
        </p>
        <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
