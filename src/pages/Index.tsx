
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Home from './Home';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if there's a user email in local storage
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      setIsAuthenticated(!!userEmail);
      setIsLoading(false);
    };
    
    // Small timeout to prevent flickering on fast connections
    setTimeout(checkAuth, 300);
  }, []);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Home />;
};

export default Index;
