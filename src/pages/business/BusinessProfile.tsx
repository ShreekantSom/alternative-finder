
import { useState } from "react";
import Navbar from "@/components/Navbar";
import BusinessProfileEditor from "@/components/business/BusinessProfileEditor";
import { useToast } from "@/components/ui/use-toast";

export function BusinessProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
          <p className="text-muted-foreground">
            Manage your business information and settings
          </p>
        </div>
        
        <BusinessProfileEditor />
      </main>
    </div>
  );
}

export default BusinessProfile;
