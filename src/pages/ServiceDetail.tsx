import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, Truck, Globe, Check, DollarSign, Award, Smartphone, MessageSquare } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import ServiceHeader from '@/components/service/ServiceHeader';
import PincodeAlert from '@/components/service/PincodeAlert';
import ServiceCTA from '@/components/service/ServiceCTA';
import ServiceReviews from '@/components/service/ServiceReviews';
import RelatedServices from '@/components/service/RelatedServices';
import ServiceSocialLinks from '@/components/service/ServiceSocialLinks';
import ServiceComparisonTable from '@/components/service/ServiceComparisonTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ServiceDetail() {
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
          result = await softwareService.getSoftwareById(id);
        } else if (slug) {
          result = await softwareService.getSoftwareBySlug(slug);
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
            const businessSlug = softwareService.createSlug(result.data.name);
            navigate(`/d2c/${businessSlug}`, { replace: true });
          }
          
          const userPincode = localStorage.getItem("userPincode");
          if (userPincode && result.data.availablePincodes) {
            const isAvailable = result.data.availablePincodes.includes(userPincode);
            setIsAvailableInPincode(isAvailable);
          }
          
          const relatedResult = await softwareService.getSoftwareByCategory(result.data.category);
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (!business) {
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

        <ServiceHeader 
          service={business} 
          isLiked={isLiked} 
          onLike={handleLike} 
          onShare={handleShare} 
          getPricingBgColor={getPricingBgColor} 
        />
        
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="franchise">Franchise</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            {business.products && business.products.length > 0 && (
              <TabsTrigger value="products">Products</TabsTrigger>
            )}
            {business.services && business.services.length > 0 && (
              <TabsTrigger value="services">Services</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details">
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Store className="mr-2 h-5 w-5 text-primary" />
                    Business Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{business.businessType || 'Not specified'}</p>
                  {business.establishedYear && (
                    <p className="text-sm text-muted-foreground mt-1">Est. {business.establishedYear}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {business.physicalLocations && business.physicalLocations.length > 0 ? (
                    <div className="space-y-2">
                      {business.physicalLocations.map((location, index) => (
                        <div key={index} className="text-sm">
                          <p>{location.address}</p>
                          <p>{location.city}, {location.state} {location.zipCode}</p>
                          {index < business.physicalLocations!.length - 1 && <Separator className="my-2" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No physical locations</p>
                  )}
                  {business.businessType === 'Online Only' && <p className="mt-2 text-sm">Online presence only</p>}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-primary" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {business.deliveryOptions && business.deliveryOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {business.deliveryOptions.map((option, index) => (
                        <Badge key={index} variant="outline" className="bg-secondary/20">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No delivery information available</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {business.appLinks && Object.values(business.appLinks).some(link => !!link) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Smartphone className="mr-2 h-5 w-5 text-primary" />
                    Available on
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {business.appLinks.playStore && (
                      <a 
                        href={business.appLinks.playStore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Google Play
                      </a>
                    )}
                    {business.appLinks.appStore && (
                      <a 
                        href={business.appLinks.appStore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a9.96 9.96 0 0 1 6.29 2.23 10 10 0 0 1 3.66 5.47A9.93 9.93 0 0 1 22 12a9.96 9.96 0 0 1-2.23 6.29 10 10 0 0 1-5.47 3.66 9.93 9.93 0 0 1-2.3.05 10 10 0 0 1-6.25-2.97 10.11 10.11 0 0 1-3.45-6.55 10.07 10.07 0 0 1 .9-5.34 10 10 0 0 1 3.78-4.8A9.96 9.96 0 0 1 12 2Z" />
                        </svg>
                        App Store
                      </a>
                    )}
                    {business.appLinks.chromeWebStore && (
                      <a 
                        href={business.appLinks.chromeWebStore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="4" />
                          <line x1="21.17" y1="8" x2="12" y2="8" />
                          <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                          <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                        </svg>
                        Chrome Web Store
                      </a>
                    )}
                    {business.appLinks.tvOS && (
                      <a 
                        href={business.appLinks.tvOS} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                          <polyline points="17 2 12 7 7 2" />
                        </svg>
                        TV OS App
                      </a>
                    )}
                    {business.appLinks.amazonBrand && (
                      <a 
                        href={business.appLinks.amazonBrand} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2 11 8-9 8 9" />
                          <path d="M12 4v7.5" />
                          <path d="M9 9c0 9.13 2 13 8 13" />
                          <path d="M15 9c0 8-2 13-8 13" />
                        </svg>
                        Amazon Brand Page
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                {business.features && business.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {business.features.map((feature, index) => (
                      <div key={index} className="flex items-start p-4 border border-border rounded-lg">
                        <div className="mr-4 p-2 bg-primary/10 rounded-full">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{typeof feature === 'string' ? feature : feature.name}</h3>
                          {typeof feature !== 'string' && feature.description && (
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No features listed for this business.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="franchise">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Award className="mr-2 h-6 w-6 text-primary" />
                  Franchise Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {business.franchise ? (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <Badge variant={business.franchise.available ? "default" : "destructive"} className="text-md">
                        {business.franchise.available ? 'Franchise Opportunities Available' : 'Not Available for Franchising'}
                      </Badge>
                    </div>
                    
                    {business.franchise.available && (
                      <>
                        {business.franchise.initialInvestment && (
                          <div>
                            <h3 className="text-lg font-medium mb-2 flex items-center">
                              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                              Initial Investment
                            </h3>
                            <p className="text-lg">
                              {formatCurrency(business.franchise.initialInvestment.min, business.franchise.initialInvestment.currency)} - {formatCurrency(business.franchise.initialInvestment.max, business.franchise.initialInvestment.currency)}
                            </p>
                          </div>
                        )}
                        
                        {business.franchise.fees && Object.keys(business.franchise.fees).length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Franchise Fees</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {business.franchise.fees.franchiseFee !== undefined && (
                                <div className="bg-secondary/20 p-4 rounded-lg">
                                  <p className="font-medium">Franchise Fee</p>
                                  <p className="text-lg">{formatCurrency(business.franchise.fees.franchiseFee)}</p>
                                </div>
                              )}
                              
                              {business.franchise.fees.royaltyFee !== undefined && (
                                <div className="bg-secondary/20 p-4 rounded-lg">
                                  <p className="font-medium">Royalty Fee</p>
                                  <p className="text-lg">{business.franchise.fees.royaltyFee}%</p>
                                </div>
                              )}
                              
                              {business.franchise.fees.marketingFee !== undefined && (
                                <div className="bg-secondary/20 p-4 rounded-lg">
                                  <p className="font-medium">Marketing Fee</p>
                                  <p className="text-lg">{business.franchise.fees.marketingFee}%</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {business.franchise.requirements && business.franchise.requirements.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Franchise Requirements</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {business.franchise.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {business.franchise.support && business.franchise.support.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Franchisee Support</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {business.franchise.support.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                            
                            {business.franchise.trainingProvided && (
                              <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Training Provided
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {business.franchise.locations !== undefined && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Current Franchise Locations</h3>
                            <p className="text-lg">{business.franchise.locations}+ locations worldwide</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">No franchise information available for this business.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Company News</CardTitle>
              </CardHeader>
              <CardContent>
                {business.newsItems && business.newsItems.length > 0 ? (
                  <div className="space-y-6">
                    {business.newsItems.map((news, index) => (
                      <div key={news.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium">{news.title}</h3>
                          <span className="text-sm text-muted-foreground">{news.date}</span>
                        </div>
                        {news.imageUrl && (
                          <img 
                            src={news.imageUrl} 
                            alt={news.title} 
                            className="w-full h-48 object-cover rounded-md mb-4" 
                          />
                        )}
                        <p>{news.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">No news available for this business.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {business.products && business.products.length > 0 && (
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {business.products.map((product, index) => (
                      <li key={index} className="text-lg">{product}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {business.services && business.services.length > 0 && (
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {business.services.map((service, index) => (
                      <li key={index} className="text-lg">{service}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        <ServiceSocialLinks service={business} />

        <ServiceCTA 
          serviceName={business.name} 
          serviceUrl={business.url} 
        />
        
        <ServiceComparisonTable mainService={business} />
        
        <ServiceReviews 
          serviceId={business.id}
          serviceName={business.name}
        />

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Similar Businesses in {business.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sameCategory.slice(0, 6).map((alt, index) => (
              <Link to={`/service/${alt.id}`} key={alt.id} className="block">
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

        <RelatedServices 
          services={relatedBusinesses} 
          isLoading={false} 
          category={business.category} 
        />
      </main>
    </div>
  );
}

export default ServiceDetail;
