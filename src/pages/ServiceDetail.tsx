
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import ServiceHeader from '@/components/service/ServiceHeader';
import PincodeAlert from '@/components/service/PincodeAlert';
import ServiceCTA from '@/components/service/ServiceCTA';
import RelatedServices from '@/components/service/RelatedServices';

export function ServiceDetail() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [service, setService] = useState<Alternative | null>(null);
  const [relatedServices, setRelatedServices] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isAvailableInPincode, setIsAvailableInPincode] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setIsLoading(true);
      try {
        let result;
        
        if (id) {
          // If ID is provided in URL, use it to fetch the service
          result = await softwareService.getSoftwareById(id);
        } else if (slug) {
          // If slug is provided in URL, use it to fetch the service
          result = await softwareService.getSoftwareBySlug(slug);
        } else {
          // No valid identifier provided
          toast({
            title: "Error",
            description: "Invalid service identifier",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        if (result.success && result.data) {
          setService(result.data);
          
          // If accessed by ID but slug is available, redirect to the slug URL
          if (id && !slug) {
            const serviceSlug = softwareService.createSlug(result.data.name);
            navigate(`/d2c/${serviceSlug}`, { replace: true });
          }
          
          // Check availability in user's pincode
          const userPincode = localStorage.getItem("userPincode");
          if (userPincode && result.data.availablePincodes) {
            const isAvailable = result.data.availablePincodes.includes(userPincode);
            setIsAvailableInPincode(isAvailable);
          }
          
          // Fetch related services from the same category
          const relatedResult = await softwareService.getSoftwareByCategory(result.data.category);
          if (relatedResult.success) {
            // Filter out the current service and limit to 3 items
            setRelatedServices(
              relatedResult.data
                .filter((item: Alternative) => item.id !== result.data.id)
                .slice(0, 3)
            );
          }
        } else {
          toast({
            title: "Error",
            description: "Service not found",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, slug, toast, navigate]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Service removed from your favorites" : "Service added to your favorites",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Service link copied to clipboard",
    });
  };

  // Get appropriate background color for pricing badge
  const getPricingBgColor = (pricing: string) => {
    switch(pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Freemium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Subscription':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Open Source':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>

        {/* Pincode availability alert */}
        <PincodeAlert 
          isAvailable={isAvailableInPincode} 
          serviceName={service.name} 
          userPincode={localStorage.getItem("userPincode")} 
        />

        {/* Service header */}
        <ServiceHeader 
          service={service} 
          isLiked={isLiked} 
          onLike={handleLike} 
          onShare={handleShare} 
          getPricingBgColor={getPricingBgColor} 
        />

        {/* CTA section */}
        <ServiceCTA 
          serviceName={service.name} 
          serviceUrl={service.url} 
        />
        
        {/* Reviews section */}
        <ServiceReviews 
          serviceId={service.id}
          serviceName={service.name}
        />

        {/* Related services */}
        <RelatedServices 
          services={relatedServices} 
          isLoading={false} 
          category={service.category} 
        />
      </main>
    </div>
  );
}

export default ServiceDetail;
