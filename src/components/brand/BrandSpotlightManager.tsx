
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface BrandSpotlightProps {
  brandId: string;
  brandName: string;
}

interface SpotlightData {
  brandId: string;
  brandName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function BrandSpotlightManager({ brandId, brandName }: BrandSpotlightProps) {
  const [spotlightData, setSpotlightData] = useState<SpotlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load spotlight data from localStorage
    const spotlightsJson = localStorage.getItem('brand_spotlights');
    const spotlights: SpotlightData[] = spotlightsJson ? JSON.parse(spotlightsJson) : [];
    const brandSpotlight = spotlights.find(s => s.brandId === brandId);
    
    if (brandSpotlight) {
      setSpotlightData(brandSpotlight);
      setDescription(brandSpotlight.description);
      setImageUrl(brandSpotlight.imageUrl);
      setIsActive(brandSpotlight.isActive);
    }
  }, [brandId]);

  const handleSaveSpotlight = async () => {
    if (!description || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both a description and an image URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Load all spotlights
      const spotlightsJson = localStorage.getItem('brand_spotlights');
      let spotlights: SpotlightData[] = spotlightsJson ? JSON.parse(spotlightsJson) : [];
      
      const newSpotlightData: SpotlightData = {
        brandId,
        brandName,
        description,
        imageUrl,
        isActive,
        createdAt: spotlightData?.createdAt || new Date().toISOString()
      };

      // Update or add the spotlight
      if (spotlightData) {
        spotlights = spotlights.map(s => 
          s.brandId === brandId ? newSpotlightData : s
        );
      } else {
        spotlights.push(newSpotlightData);
      }

      // Save to localStorage
      localStorage.setItem('brand_spotlights', JSON.stringify(spotlights));
      setSpotlightData(newSpotlightData);

      toast({
        title: spotlightData ? "Spotlight Updated" : "Spotlight Created",
        description: spotlightData 
          ? "Your brand spotlight has been updated successfully" 
          : "Your brand spotlight has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save spotlight",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Spotlight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Spotlight Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what makes your brand special..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Brand Image URL</Label>
          <Input
            id="imageUrl"
            placeholder="https://example.com/your-brand-image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="active">Make spotlight active</Label>
        </div>

        {imageUrl && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Image Preview</h4>
            <div className="border rounded-md overflow-hidden w-full h-40">
              <img
                src={imageUrl}
                alt="Spotlight preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleSaveSpotlight} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading 
            ? "Saving..." 
            : spotlightData 
              ? "Update Spotlight" 
              : "Create Spotlight"
          }
        </Button>
      </CardContent>
    </Card>
  );
}
