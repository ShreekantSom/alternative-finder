
import { useEffect, useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alternative } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';

interface NewBrandSpotlightsProps {
  onBusinessClick?: (businessId: string) => void;
}

export default function NewBrandSpotlights({ onBusinessClick }: NewBrandSpotlightsProps) {
  const [newBrands, setNewBrands] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchNewBrands = async () => {
      try {
        const result = await softwareService.getAllSoftware();
        if (result.success) {
          // Get the most recent brands (for demo, just take a few random ones)
          const sortedBrands = result.data.sort(() => Math.random() - 0.5).slice(0, 6);
          setNewBrands(sortedBrands);
        }
      } catch (error) {
        console.error("Error fetching new brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewBrands();
  }, []);
  
  const handleBrandClick = (businessId: string) => {
    if (onBusinessClick) {
      onBusinessClick(businessId);
    } else {
      navigate(`/business/${businessId}`);
    }
  };
  
  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            <p className="mt-2 text-muted-foreground">Loading new brands...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">New Brand Spotlights</h2>
            <p className="text-muted-foreground">Discover the newest brands on our platform</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center" asChild>
            <Link to="/discover?sort=newest">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newBrands.map(brand => (
            <Card 
              key={brand.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleBrandClick(brand.id)}
            >
              <div className="relative h-40">
                <img 
                  src={brand.imageUrl} 
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  New
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{brand.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {brand.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">{brand.category}</span>
                  <div className="text-xs text-muted-foreground">{brand.likes} likes</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Button asChild>
            <Link to="/discover?sort=newest">
              View all new brands
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
