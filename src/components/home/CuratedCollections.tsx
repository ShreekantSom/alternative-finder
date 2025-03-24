
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Home, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface for collection data
interface Collection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  brands: {
    id: string;
    name: string;
    logo?: string;
    category: string;
  }[];
  bgColor: string;
}

// Demo collection data
const collections: Collection[] = [
  {
    id: "sustainable-fashion",
    title: "Sustainable Fashion",
    description: "Eco-friendly brands revolutionizing the fashion industry with sustainable practices and materials.",
    icon: <Leaf className="h-5 w-5" />,
    brands: [
      { id: "1", name: "EcoWear", category: "Clothing" },
      { id: "2", name: "Green Threads", category: "Apparel" },
      { id: "3", name: "Nature's Closet", category: "Accessories" }
    ],
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
  },
  {
    id: "innovative-home",
    title: "Innovative Home Products",
    description: "Smart and innovative D2C brands transforming everyday home essentials.",
    icon: <Home className="h-5 w-5" />,
    brands: [
      { id: "4", name: "SmartLiving", category: "Smart Home" },
      { id: "5", name: "ModernSpace", category: "Furniture" },
      { id: "6", name: "CozyCraft", category: "Home Decor" }
    ],
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    id: "emerging-brands",
    title: "Emerging Brands to Watch",
    description: "Up-and-coming D2C brands that are disrupting traditional markets with fresh approaches.",
    icon: <Rocket className="h-5 w-5" />,
    brands: [
      { id: "7", name: "NovaBite", category: "Food" },
      { id: "8", name: "TechLife", category: "Electronics" },
      { id: "9", name: "WellnessNow", category: "Health" }
    ],
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  }
];

export function CuratedCollections() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Curated Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover D2C brands grouped by themes that match your interests and values.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {collections.map((collection) => (
            <Card 
              key={collection.id}
              className={`overflow-hidden transition-all duration-300 ${
                hoveredCard === collection.id ? 'shadow-lg translate-y-[-5px]' : 'shadow-md'
              } ${collection.bgColor}`}
              onMouseEnter={() => setHoveredCard(collection.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="px-3 py-1 flex gap-1 items-center">
                    {collection.icon}
                    {collection.title}
                  </Badge>
                </div>
                <CardTitle className="mt-3">{collection.title}</CardTitle>
                <CardDescription className="mt-2">
                  {collection.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Featured Brands:</h4>
                <ul className="space-y-2">
                  {collection.brands.map(brand => (
                    <li key={brand.id} className="flex items-center justify-between">
                      <span className="font-medium">{brand.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {brand.category}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to={`/collection/${collection.id}`}>
                    View Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/collections">
              Browse All Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CuratedCollections;
