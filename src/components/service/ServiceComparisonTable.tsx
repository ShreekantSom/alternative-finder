import { useState, useEffect } from 'react';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureDisplay } from '@/components/service/FeatureDisplay';

interface ServiceComparisonTableProps {
  mainService: Alternative;
}

// Array of comparison features
const COMPARISON_FEATURES = [
  { name: 'Pricing', key: 'pricing', icon: <DollarSign className="h-4 w-4 mr-1" /> },
  { name: 'Rating', key: 'likes', icon: <ThumbsUp className="h-4 w-4 mr-1" /> },
  { name: 'Platform', key: 'platform', icon: <Clock className="h-4 w-4 mr-1" /> },
  { name: 'Key Features', key: 'features', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
  { name: 'Location Support', key: 'availablePincodes', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
  { name: 'Performance', key: 'performance', icon: <Clock className="h-4 w-4 mr-1" /> },
  { name: 'Customer Support', key: 'support', icon: <ThumbsUp className="h-4 w-4 mr-1" /> },
  { name: 'Referral Program', key: 'referralProgram', icon: <ThumbsUp className="h-4 w-4 mr-1" /> },
];

export function ServiceComparisonTable({ mainService }: ServiceComparisonTableProps) {
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [selectedView, setSelectedView] = useState('table');

  useEffect(() => {
    const fetchCompetitors = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would use a specific API endpoint for competitors
        // For now, we'll just get other services in the same category
        const result = await softwareService.getSoftwareByCategory(mainService.category);
        if (result.success) {
          // Filter out the main service and limit to 3 (or 6 if showing more)
          const otherServices = (result.data as Alternative[])
            .filter(service => service.id !== mainService.id)
            .slice(0, showMore ? 6 : 3);
            
          setCompetitors(otherServices);
        } else {
          toast({
            title: "Error",
            description: "Failed to load comparison data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching competitors:", error);
        toast({
          title: "Error",
          description: "Failed to load comparison data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitors();
  }, [mainService.id, mainService.category, showMore, toast]);

  const renderValue = (service: Alternative, feature: { name: string; key: string }) => {
    const key = feature.key as keyof Alternative;
    
    // Handle undefined values
    if (!service[key]) {
      if (key === 'referralProgram') {
        return <XCircle className="h-5 w-5 text-red-500" />;
      }
      if (key === 'performance' || key === 'support') {
        return <MinusCircle className="h-5 w-5 text-gray-400" />;
      }
      return <MinusCircle className="h-5 w-5 text-gray-400" />;
    }
    
    const value = service[key];
    
    if (key === 'pricing') {
      return <Badge variant="outline">{value as string}</Badge>;
    }
    
    if (key === 'likes') {
      return <span>{value as number} likes</span>;
    }

    if (key === 'platform') {
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((platform, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">{platform}</Badge>
          ))}
        </div>
      );
    }

    if (key === 'availablePincodes') {
      return (value && (value as string[]).length > 0) ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      );
    }

    if (key === 'features') {
      // In a real app, this would come from the service's actual features
      return (
        <ul className="text-sm list-disc pl-4 space-y-1">
          {(service.features || ['Basic feature']).map((feature, idx) => (
            <span key={idx}><FeatureDisplay feature={feature} /></span>
          ))}
        </ul>
      );
    }
    
    if (key === 'performance') {
      // Mock performance rating
      const rating = Math.floor(Math.random() * 5) + 1;
      return (
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <ThumbsUp key={i} className="h-4 w-4 text-green-500 mr-1" />
          ))}
        </div>
      );
    }
    
    if (key === 'support') {
      // Mock support rating
      const rating = Math.floor(Math.random() * 5) + 1;
      return (
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <ThumbsUp key={i} className="h-4 w-4 text-blue-500 mr-1" />
          ))}
        </div>
      );
    }
    
    if (key === 'referralProgram') {
      // Mock referral program info
      return service.id === mainService.id || Math.random() > 0.5 ? 
        <div className="text-sm">
          <CheckCircle className="h-5 w-5 text-green-500 inline mr-1" /> 
          <span>Available</span>
        </div> : 
        <XCircle className="h-5 w-5 text-red-500" />;
    }

    if (typeof value === 'object' && value !== null) {
      return <span>Available</span>;
    }

    return String(value);
  };

  // Card view for each service
  const renderServiceCard = (service: Alternative) => (
    <div className="bg-card border rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
          <img 
            src={service.imageUrl || "/placeholder.svg"} 
            alt={service.name} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{service.name}</h3>
          <p className="text-sm text-muted-foreground">{service.category}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {COMPARISON_FEATURES.map(feature => (
          <div key={feature.key} className="flex justify-between items-center py-1 border-b border-muted">
            <div className="flex items-center text-sm font-medium">
              {feature.icon} {feature.name}
            </div>
            <div className="text-sm">{renderValue(service, feature)}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Badge variant="outline" className={
          service.pricing === 'Free' ? 'bg-green-100 text-green-800' :
          service.pricing === 'Freemium' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }>
          {service.pricing}
        </Badge>
        <Button variant="link" size="sm" onClick={() => window.open(service.url, '_blank')}>
          Visit Website
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mt-12 mb-16">
        <h2 className="text-2xl font-bold mb-6">Compare with Alternatives</h2>
        <div className="w-full h-64 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading comparison data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (competitors.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-16">
      <h2 className="text-2xl font-bold mb-6">Compare with Alternatives</h2>
      
      <Tabs defaultValue="table" className="mb-6" onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="overflow-x-auto">
          <Table className="w-full">
            <TableCaption>
              Comparison of {mainService.name} with alternatives in the {mainService.category} category.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Features</TableHead>
                <TableHead className="bg-secondary/40">{mainService.name}</TableHead>
                {competitors.map(competitor => (
                  <TableHead key={competitor.id}>{competitor.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON_FEATURES.map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {feature.icon} {feature.name}
                    </div>
                  </TableCell>
                  <TableCell className="bg-secondary/20">
                    {renderValue(mainService, feature)}
                  </TableCell>
                  {competitors.map(competitor => (
                    <TableCell key={`${competitor.id}-${feature.key}`}>
                      {renderValue(competitor, feature)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {renderServiceCard(mainService)}
            </div>
            {competitors.map(competitor => (
              <div key={competitor.id} className="md:col-span-1">
                {renderServiceCard(competitor)}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {competitors.length > 2 && (
        <Button
          variant="outline"
          className="mt-4 mx-auto block"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}

export default ServiceComparisonTable;
