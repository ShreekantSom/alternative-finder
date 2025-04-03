
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ServiceDetail from "./pages/ServiceDetail";
import NewsSection from "./pages/NewsSection";
import Collections from "./pages/Collections";
import Discover from "./pages/Discover";
import BrandDashboard from "./pages/BrandDashboard";
import CategoryDetail from "./pages/CategoryDetail";
import BrandSubmission from "./pages/BrandSubmission";
import UserWishlists from "./pages/UserWishlists";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brand-dashboard" element={<BrandDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/brand-submission" element={<BrandSubmission />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/d2c/:slug" element={<ServiceDetail />} />
        <Route path="/news" element={<NewsSection />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collection/:id" element={<Collections />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/category/:categoryId" element={<CategoryDetail />} />
        <Route path="/wishlists" element={<UserWishlists />} />
        <Route path="/shared-wishlist/:id" element={<UserWishlists />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
