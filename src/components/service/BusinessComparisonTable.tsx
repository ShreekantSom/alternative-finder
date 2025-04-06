
import { useState, useEffect } from "react";
import { Alternative } from "@/assets/data";
import { softwareService } from "@/lib/softwareService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define a type for features to handle both string and object formats
interface FeatureItem {
  name: string;
  description?: string;
  available?: boolean;
}

type Feature = string | FeatureItem;

interface BusinessComparisonTableProps {
  mainBusiness: Alternative;
}

export function BusinessComparisonTable({ mainBusiness }: BusinessComparisonTableProps) {
  const [competitors, setCompetitors] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("features");
  
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const result = await softwareService.getSoftwareByCategory(mainBusiness.category);
        if (result.success && result.data) {
          // Get only 3 competitors excluding the main business
          const filtered = (result.data as Alternative[])
            .filter(item => item.id !== mainBusiness.id)
            .slice(0, 3);
          setCompetitors(filtered);
        }
      } catch (error) {
        console.error("Error fetching competitors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompetitors();
  }, [mainBusiness]);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  if (isLoading || competitors.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>How {mainBusiness.name} compares to alternatives</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ComparisonSection 
            title="Features" 
            isExpanded={expandedSection === "features"}
            onToggle={() => toggleSection("features")}
          >
            <FeatureComparison mainBusiness={mainBusiness} competitors={competitors} />
          </ComparisonSection>
          
          <ComparisonSection 
            title="Pricing" 
            isExpanded={expandedSection === "pricing"}
            onToggle={() => toggleSection("pricing")}
          >
            <PricingComparison mainBusiness={mainBusiness} competitors={competitors} />
          </ComparisonSection>
          
          <ComparisonSection 
            title="Platforms" 
            isExpanded={expandedSection === "platforms"}
            onToggle={() => toggleSection("platforms")}
          >
            <PlatformComparison mainBusiness={mainBusiness} competitors={competitors} />
          </ComparisonSection>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ComparisonSection({ title, isExpanded, onToggle, children }: ComparisonSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

function FeatureComparison({ 
  mainBusiness, 
  competitors 
}: { 
  mainBusiness: Alternative; 
  competitors: Alternative[] 
}) {
  // Helper function to extract feature name regardless of format
  const getFeatureName = (feature: Feature): string => {
    if (typeof feature === 'string') {
      return feature;
    }
    return feature.name;
  };

  // Check if business has a feature by name
  const businessHasFeature = (business: Alternative, featureName: string): boolean => {
    if (!business.features) return false;
    
    return business.features.some(f => {
      if (typeof f === 'string') {
        return f === featureName;
      }
      return f.name === featureName;
    });
  };

  // Combine all features for comparison
  const allFeatures = Array.from(new Set([
    ...(mainBusiness.features || []).map(getFeatureName),
    ...competitors.flatMap(comp => (comp.features || []).map(getFeatureName))
  ]));
  
  if (allFeatures.length === 0) {
    return <p className="text-muted-foreground">No feature information available for comparison.</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Feature</TableHead>
            <TableHead>{mainBusiness.name}</TableHead>
            {competitors.map(comp => (
              <TableHead key={comp.id}>{comp.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allFeatures.map(feature => (
            <TableRow key={feature}>
              <TableCell className="font-medium">{feature}</TableCell>
              <TableCell>
                {businessHasFeature(mainBusiness, feature) ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              {competitors.map(comp => (
                <TableCell key={comp.id}>
                  {businessHasFeature(comp, feature) ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PricingComparison({ 
  mainBusiness, 
  competitors 
}: { 
  mainBusiness: Alternative; 
  competitors: Alternative[] 
}) {
  const getPricingBadge = (pricing: string) => {
    let color = "bg-gray-100 text-gray-800";
    
    switch (pricing) {
      case "Free":
        color = "bg-green-100 text-green-800";
        break;
      case "Freemium":
        color = "bg-blue-100 text-blue-800";
        break;
      case "Paid":
        color = "bg-purple-100 text-purple-800";
        break;
      case "Subscription":
        color = "bg-amber-100 text-amber-800";
        break;
      case "Open Source":
        color = "bg-indigo-100 text-indigo-800";
        break;
    }
    
    return (
      <Badge className={`${color} border-0`}>{pricing}</Badge>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Business</TableHead>
            <TableHead>Pricing Model</TableHead>
            <TableHead>Starting Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{mainBusiness.name}</TableCell>
            <TableCell>{getPricingBadge(mainBusiness.pricing)}</TableCell>
            <TableCell>{"Not available"}</TableCell>
          </TableRow>
          {competitors.map(comp => (
            <TableRow key={comp.id}>
              <TableCell className="font-medium">{comp.name}</TableCell>
              <TableCell>{getPricingBadge(comp.pricing)}</TableCell>
              <TableCell>{"Not available"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PlatformComparison({ 
  mainBusiness, 
  competitors 
}: { 
  mainBusiness: Alternative; 
  competitors: Alternative[] 
}) {
  // Combine all platforms for comparison
  const allPlatforms = Array.from(new Set([
    ...mainBusiness.platform,
    ...competitors.flatMap(comp => comp.platform)
  ]));
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Platform</TableHead>
            <TableHead>{mainBusiness.name}</TableHead>
            {competitors.map(comp => (
              <TableHead key={comp.id}>{comp.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPlatforms.map(platform => (
            <TableRow key={platform}>
              <TableCell className="font-medium">{platform}</TableCell>
              <TableCell>
                {mainBusiness.platform.includes(platform) ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              {competitors.map(comp => (
                <TableCell key={comp.id}>
                  {comp.platform.includes(platform) ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default BusinessComparisonTable;
