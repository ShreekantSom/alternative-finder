
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { businessService } from '@/lib/businessService';
import { createSlug } from '@/lib/softwareUtils';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import BusinessHeader from '@/components/service/BusinessHeader';
import PincodeAlert from '@/components/service/PincodeAlert';
import BusinessCTA from '@/components/service/BusinessCTA';
import BusinessReviews from '@/components/service/BusinessReviews';
import RelatedBusinesses from '@/components/service/RelatedBusinesses';
import BusinessSocialLinks from '@/components/service/BusinessSocialLinks';
import BusinessComparisonTable from '@/components/service/BusinessComparisonTable';
import BusinessDetailTabs from '@/components/service/BusinessDetailTabs';
import ExternalReviews from '@/components/service/ExternalReviews';

export function BusinessDetail() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [business, setBusiness] = useState<Alternative | null>(null);
  const [relatedBusinesses, setRelatedBusinesses] = useState<Alternative[]>([]);
  const [sameCategory, setSameCategory] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isAvailableInPincode, setIsAvailableInPincode] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setIsLoading(true);
      try {
        let result;
        
        if (id) {
          result = await businessService.getBusinessById(id);
        } else if (slug) {
          // Check if the method exists, otherwise fallback to fetching all and filtering
          if (typeof businessService.getSoftwareBySlug === 'function') {
            result = await businessService.getSoftwareBySlug(slug);
          } else {
            // Fallback: Get all businesses and filter by slug
            const allResult = await businessService.getAllBusinesses();
            if (allResult.success && allResult.data) {
              const businesses = allResult.data;
              const foundBusiness = businesses.find(b => createSlug(b.name) === slug);
              
              if (foundBusiness) {
                result = { success: true, data: foundBusiness };
              } else {
                result = { success: false, error: "Business not found" };
              }
            } else {
              result = { success: false, error: "Failed to fetch businesses" };
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Invalid business identifier",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        if (result.success && result.data) {
          setBusiness(result.data);
          
          if (id && !slug) {
            const businessSlug = createSlug(result.data.name);
            navigate(`/business/${id}/${businessSlug}`, { replace: true });
          }
          
          const userPincode = localStorage.getItem("userPincode");
          if (userPincode && result.data.availablePincodes) {
            const isAvailable = result.data.availablePincodes.includes(userPincode);
            setIsAvailableInPincode(isAvailable);
          }
          
          const relatedResult = await businessService.getBusinessesByCategory(result.data.category);
          if (relatedResult.success) {
            const others = relatedResult.data.filter((item: Alternative) => item.id !== result.data.id);
            setRelatedBusinesses(others.slice(0, 3));
            setSameCategory(others);
          }
        } else {
          toast({
            title: "Error",
            description: "Business not found",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        toast({
          title: "Error",
          description: "Failed to load business details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id, slug, toast, navigate]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Business removed from your favorites" : "Business added to your favorites",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Business link copied to clipboard",
    });
  };

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
    return <BusinessDetailSkeleton />;
  }

  if (!business) {
    return <BusinessDetailNotFound />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>

        <PincodeAlert 
          isAvailable={isAvailableInPincode} 
          serviceName={business.name} 
          userPincode={localStorage.getItem("userPincode")} 
        />

        <BusinessHeader 
          business={business} 
          isLiked={isLiked} 
          onLike={handleLike} 
          onShare={handleShare} 
          getPricingBgColor={getPricingBgColor} 
        />
        
        <BusinessDetailTabs business={business} />
        
        <BusinessSocialLinks business={business} />

        <BusinessCTA 
          businessName={business.name} 
          businessUrl={business.url} 
        />
        
        {business.externalReviews && business.externalReviews.length > 0 && (
          <ExternalReviews 
            reviews={business.externalReviews} 
            serviceName={business.name}
          />
        )}
        
        <BusinessComparisonTable mainBusiness={business} />
        
        <BusinessReviews 
          businessId={business.id}
          businessName={business.name}
        />

        <SimilarBusinesses 
          businesses={sameCategory.slice(0, 6)} 
          category={business.category}
          getPricingBgColor={getPricingBgColor}
        />

        <RelatedBusinesses 
          businesses={relatedBusinesses} 
          isLoading={false} 
          category={business.category} 
        />
      </main>
    </div>
  );
}

function BusinessDetailSkeleton() {
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

function BusinessDetailNotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
        <p className="mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SimilarBusinesses({ businesses, category, getPricingBgColor }: { 
  businesses: Alternative[],
  category: string,
  getPricingBgColor: (pricing: string) => string
}) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Similar Businesses in {category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((alt) => (
          <Link to={`/business/${alt.id}`} key={alt.id} className="block">
            <Card className="h-full hover:shadow-md transition-all duration-300">
              <div className="p-4 flex items-center">
                <img 
                  src={alt.imageUrl} 
                  alt={alt.name} 
                  className="w-16 h-16 object-contain mr-4"
                />
                <div>
                  <h3 className="font-medium">{alt.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{alt.description}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getPricingBgColor(alt.pricing)}`}>
                    {alt.pricing}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BusinessDetail;
