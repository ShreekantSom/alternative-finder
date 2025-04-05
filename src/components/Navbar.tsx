
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
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
  Globe,
  Search,
  ChevronDown
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import PincodeMenu from "@/components/PincodeMenu";
import { AuthService } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import NavbarSearch from "./navbar/NavbarSearch";
import MobileMenu from "./navbar/MobileMenu";
import { Alternative } from "@/assets/data";
import { motion, AnimatePresence } from "framer-motion";
import { categoryService } from "@/lib/categoryService";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsLoggedIn(!!user);
    setUser(user);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
      setShowNavbarSearch(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    fetchCategories();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const fetchCategories = async () => {
    try {
      const result = await categoryService.getAllCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleItemSelect = (alternative: Alternative) => {
    navigate(`/business/${alternative.id}`);
    setShowNavbarSearch(false);
  };
  
  const handleAuthClick = () => {
    if (isLoggedIn) {
      if (user?.role === 'brand') {
        navigate('/brand-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  // Additional categories with subcategories
  const additionalCategories = [
    {
      name: "BFSI",
      subcategories: [
        { name: "Banking", slug: "banking" },
        { name: "Insurance", slug: "insurance" },
        { name: "Investments", slug: "investments" },
        { name: "Loans", slug: "loans" },
        { name: "Payment Services", slug: "payment-services" }
      ]
    },
    {
      name: "Entertainment",
      subcategories: [
        { name: "Music Labels", slug: "music-labels" },
        { name: "Music Streaming", slug: "music-streaming" },
        { name: "Cinema Chains", slug: "cinema-chains" },
        { name: "OTT Platforms", slug: "ott-platforms" }
      ]
    },
    {
      name: "Food & Beverages",
      subcategories: [
        { name: "Restaurants", slug: "restaurants" },
        { name: "Cloud Kitchens", slug: "cloud-kitchens" },
        { name: "Cafes", slug: "cafes" },
        { name: "Fast Food", slug: "fast-food" }
      ]
    }
  ];

  return (
    <div className={`sticky top-0 z-50 bg-background border-b transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg mr-4">
            Discover Businesses
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </Link>
            
            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[60vh] overflow-y-auto">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link to={`/category/${category.id}`} className="w-full">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  {/* BFSI Section */}
                  <DropdownMenuLabel className="mt-2">BFSI</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/category/banking" className="w-full">
                      Banking
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/insurance" className="w-full">
                      Insurance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/investments" className="w-full">
                      Investments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/loans" className="w-full">
                      Loans
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Entertainment Section */}
                  <DropdownMenuLabel className="mt-2">Entertainment</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/category/music-labels" className="w-full">
                      Music Labels
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/music-streaming" className="w-full">
                      Music Streaming
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/cinema-chains" className="w-full">
                      Cinema Chains
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/ott-platforms" className="w-full">
                      OTT Platforms
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </Link>
            <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
              News
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navbar Search that appears when scrolled */}
          <AnimatePresence>
            {showNavbarSearch && (
              <NavbarSearch 
                showSearch={showNavbarSearch} 
                onItemSelect={handleItemSelect} 
              />
            )}
          </AnimatePresence>
          
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
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
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
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        showNavbarSearch={showNavbarSearch}
        user={user}
        handleAuthClick={handleAuthClick}
        handleItemSelect={handleItemSelect}
      />
    </div>
  );
}
