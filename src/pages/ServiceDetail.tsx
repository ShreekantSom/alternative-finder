
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ExternalLink, Tag, Check, Users, Calendar, Star } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AlternativesList from '@/components/AlternativesList';

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Alternative | null>(null);
  const [relatedServices, setRelatedServices] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const result = await softwareService.getSoftwareById(id);
          if (result.success && result.data) {
            setService(result.data);
            // Fetch related services from the same category
            const relatedResult = await softwareService.getSoftwareByCategory(result.data.category);
            if (relatedResult.success) {
              // Filter out the current service and limit to 3 items
              setRelatedServices(
                relatedResult.data
                  .filter((item: Alternative) => item.id !== id)
                  .slice(0, 3)
              );
            }
          } else {
            toast({
              title: "Error",
              description: "Service not found",
              variant: "destructive",
            });
          }
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
  }, [id, toast]);

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

        {/* Service header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Service image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border/50 p-8 flex items-center justify-center">
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="max-h-48 max-w-full object-contain"
            />
          </div>

          {/* Service info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold">{service.name}</h1>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleLike}
                      className={`p-2 rounded-full transition-colors ${
                        isLiked 
                          ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-secondary text-muted-foreground'
                      }`}
                      aria-label={isLiked ? 'Unlike' : 'Like'}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-2 rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag size={12} />
                    {service.category}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPricingBgColor(service.pricing)}`}>
                    {service.pricing}
                  </span>
                </div>
                
                <p className="text-lg mb-6">{service.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-amber-500" />
                    <span><strong>{service.likes}</strong> likes</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Popular service</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                    <span>Updated regularly</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Available on:</h3>
                <div className="flex flex-wrap gap-2">
                  {service.platform.map((platform, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Check size={12} />
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <Card className="mb-12 bg-gradient-to-r from-primary/10 to-primary/5 border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready to try {service.name}?</h2>
                <p className="text-muted-foreground">Visit the official website to learn more and get started.</p>
              </div>
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Related services */}
        {relatedServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Services</h2>
            <AlternativesList 
              alternatives={relatedServices} 
              isLoading={false} 
              selectedCategory={service.category}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default ServiceDetail;
