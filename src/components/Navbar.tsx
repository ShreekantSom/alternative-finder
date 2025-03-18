
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthService } from "@/lib/auth";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };
    
    checkAuth();
    
    // Setup an interval to periodically check auth status
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              AlternaFind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#categories"
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Categories
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" className="ml-2">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[75vw] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/#categories"
                  className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  Categories
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="mt-2">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">
                        <LogIn className="w-4 h-4 mr-2" /> Login
                      </Button>
                    </Link>
                    <Link to="/auth?tab=signup">
                      <Button className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
