
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserDashboard from "@/components/user/UserDashboard";
import BusinessUserDashboard from "@/components/business/BusinessUserDashboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For demo purposes, set to true
  const [userType, setUserType] = useState<"user" | "business">("user"); // Track user type
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // In a real app, this would check authentication status
  useEffect(() => {
    // This is a mock authentication check
    // In a real app, it would verify the user's authentication status
    const checkAuth = () => {
      // For demo purposes, we're assuming the user is authenticated
      // In a real app, this would check a token or session
      setIsAuthenticated(true);
      
      // Check if this is a business user based on URL or stored user data
      const path = location.pathname;
      if (path.includes("/business/")) {
        setUserType("business");
      } else {
        setUserType("user");
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const loginPath = userType === "business" ? "/business/login" : "/auth";
      
      toast({
        title: "Authentication Required",
        description: `Please log in to access your ${userType} dashboard`,
        variant: "destructive",
      });
      
      navigate(loginPath);
    }
  }, [isAuthenticated, navigate, toast, userType]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {userType === "business" ? <BusinessUserDashboard /> : <UserDashboard />}
    </div>
  );
}

export default Dashboard;
