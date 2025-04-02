
import { useState, useEffect } from 'react';
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceComparisonTableProps {
  mainService: Alternative;
}

export function ServiceComparisonTable({ mainService }: ServiceComparisonTableProps) {
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

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

  // Define comparison features
  const comparisonFeatures = [
    { name: 'Pricing', key: 'pricing' },
    { name: 'Rating', key: 'likes' },
    { name: 'Platform', key: 'platform' },
    { name: 'Key Features', key: 'features' },
    { name: 'Location Support', key: 'availablePincodes' },
  ];

  const renderValue = (service: Alternative, feature: { name: string; key: string }) => {
    const key = feature.key as keyof Alternative;
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
      // This is a mock since we don't have features in our data model
      // In a real app, this would come from the service data
      return (
        <ul className="text-sm list-disc pl-4 space-y-1">
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      );
    }

    return value ? value : <MinusCircle className="h-5 w-5 text-gray-400" />;
  };

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
      <div className="overflow-x-auto">
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
            {comparisonFeatures.map((feature) => (
              <TableRow key={feature.key}>
                <TableCell className="font-medium">{feature.name}</TableCell>
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
      </div>
      
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
