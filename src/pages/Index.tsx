import { useState, useEffect } from "react";
import { Auth } from "./Auth";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication state
    // This will be replaced with Supabase session checking
    const checkAuthState = async () => {
      // Simulate checking authentication state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, check if user was previously authenticated
      const wasAuthenticated = localStorage.getItem('demo-auth') === 'true';
      setIsAuthenticated(wasAuthenticated);
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const handleAuthSuccess = () => {
    localStorage.setItem('demo-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('demo-auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onSignOut={handleSignOut} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
};

export default Index;
