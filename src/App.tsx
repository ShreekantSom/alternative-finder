
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBusinessManagement from "./pages/admin/AdminBusinessManagement";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminNewsManagement from "./pages/admin/AdminNewsManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Profile from "./pages/Profile";
import BusinessDetail from "./pages/BusinessDetail";
import NewsSection from "./pages/NewsSection";
import Collections from "./pages/Collections";
import Discover from "./pages/Discover";
import BrandDashboard from "./pages/BrandDashboard";
import CategoryDetail from "./pages/CategoryDetail";
import BrandSubmission from "./pages/BrandSubmission";
import UserWishlists from "./pages/UserWishlists";
import ThemeProvider from "./components/ThemeProvider";
import Footer from "./components/Footer";
import BusinessLogin from "./pages/business/BusinessLogin";
import BusinessProfile from "./pages/business/BusinessProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/brand-dashboard" element={<BrandDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/brand-submission" element={<BrandSubmission />} />
              <Route path="/business/:id" element={<BusinessDetail />} />
              <Route path="/d2c/:slug" element={<BusinessDetail />} />
              <Route path="/news" element={<NewsSection />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collection/:id" element={<Collections />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/category/:categoryId" element={<CategoryDetail />} />
              <Route path="/wishlists" element={<UserWishlists />} />
              <Route path="/shared-wishlist/:id" element={<UserWishlists />} />
              
              {/* Business User Routes */}
              <Route path="/business/login" element={<BusinessLogin />} />
              <Route path="/business/dashboard" element={<Dashboard />} />
              <Route path="/business/profile" element={<BusinessProfile />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/businesses" element={
                <ProtectedAdminRoute>
                  <AdminBusinessManagement />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedAdminRoute>
                  <AdminCategoryManagement />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedAdminRoute>
                  <AdminUserManagement />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/news" element={
                <ProtectedAdminRoute>
                  <AdminNewsManagement />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedAdminRoute>
                  <AdminSettings />
                </ProtectedAdminRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
