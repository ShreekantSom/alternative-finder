
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Star, Sparkles, Award } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// Interface for a brand
interface Brand {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
  isNew: boolean;
  foundedYear: number;
}

// Example brand data
const newBrands: Brand[] = [
  {
    id: "brand-1",
    name: "EcoVibe",
    category: "Sustainable Fashion",
    shortDescription: "Eco-friendly clothing made from recycled materials with a focus on minimizing carbon footprint.",
    imageUrl: "https://picsum.photos/seed/ecovibe/200/200",
    isNew: true,
    foundedYear: 2022
  },
  {
    id: "brand-2",
    name: "NutriBox",
    category: "Health Foods",
    shortDescription: "Plant-based meal subscription delivering nutritionally balanced meals right to your door.",
    imageUrl: "https://picsum.photos/seed/nutribox/200/200",
    isNew: true,
    foundedYear: 2023
  },
  {
    id: "brand-3",
    name: "HomeSmart",
    category: "Smart Home",
    shortDescription: "Innovative home automation solutions that are easy to install and integrate with existing systems.",
    imageUrl: "https://picsum.photos/seed/homesmart/200/200",
    isNew: true,
    foundedYear: 2022
  }
];

export function NewBrandSpotlights() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              New Brand Spotlights
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover the latest additions to our directory - innovative brands making waves in the D2C space.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/collections/new-brands">View All New Brands</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <Card key={`skeleton-${i}`} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[200px] w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            // Actual brand cards
            newBrands.map(brand => (
              <Card key={brand.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {brand.category}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                      <Star className="h-3 w-3" /> New Brand
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">Founded {brand.foundedYear}</p>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                    <img 
                      src={brand.imageUrl} 
                      alt={brand.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{brand.shortDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="default" className="w-full">
                    <Link to={`/service/${brand.id}`}>
                      Explore Brand
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default NewBrandSpotlights;
