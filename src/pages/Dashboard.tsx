
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboard from "@/components/user/UserDashboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For demo purposes, set to true
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real app, this would check authentication status
  useEffect(() => {
    // This is a mock authentication check
    // In a real app, it would verify the user's authentication status
    const checkAuth = () => {
      // For demo purposes, we're assuming the user is authenticated
      // In a real app, this would check a token or session
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate, toast]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <UserDashboard />
    </div>
  );
}

export default Dashboard;
