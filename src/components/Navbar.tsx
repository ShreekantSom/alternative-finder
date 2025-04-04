
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  User, 
  Heart, 
  MapPin, 
  Globe 
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PincodeMenu from "@/components/PincodeMenu";
import { AuthService } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-semibold text-lg mr-8">
            Discover Businesses
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </Link>
            <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
              News
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Location Picker */}
          <PincodeMenu />
          
          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {/* Desktop User Menu */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlists" className="cursor-pointer flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>My Wishlists</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/brand-submission" className="cursor-pointer flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>Submit Your Business</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore and discover amazing businesses.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <Link to="/discover" className="hover:underline">
                  Discover
                </Link>
                <Link to="/collections" className="hover:underline">
                  Collections
                </Link>
                <Link to="/news" className="hover:underline">
                  News
                </Link>
                <Link to="/auth" className="hover:underline">
                  Sign In
                </Link>
                <Link to="/profile" className="hover:underline">
                  My Profile
                </Link>
                <Link to="/wishlists" className="hover:underline">
                  My Wishlists
                </Link>
                <Link to="/brand-submission" className="hover:underline">
                  Submit Your Business
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
