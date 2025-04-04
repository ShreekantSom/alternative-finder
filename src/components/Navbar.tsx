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
import { Menu } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  return (
    <div className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          Discover Businesses
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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
