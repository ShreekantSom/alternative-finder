
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Home, Rocket, Package, Coffee, Heart, ShoppingBag, Palette } from 'lucide-react';
import { useEffect } from 'react';

export function Collections() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // This is a placeholder for a future Collections page
  // Will be expanded with more detailed collection information
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Curated Brand Collections</h1>
          <p className="text-muted-foreground">
            Explore our handpicked collections of the best D2C brands grouped by themes, 
            values, and interests to help you discover products that align with what matters to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Placeholder for collection cards - will be expanded with actual data */}
          <CollectionCard 
            title="Sustainable Fashion" 
            description="Eco-friendly brands revolutionizing the fashion industry."
            icon={<Leaf className="h-5 w-5" />}
            bgColor="bg-emerald-50 dark:bg-emerald-950/20"
            count={12}
          />
          <CollectionCard 
            title="Innovative Home Products" 
            description="Smart and innovative D2C brands for your home."
            icon={<Home className="h-5 w-5" />}
            bgColor="bg-blue-50 dark:bg-blue-950/20"
            count={15}
          />
          <CollectionCard 
            title="Emerging Brands to Watch" 
            description="Up-and-coming D2C brands disrupting traditional markets."
            icon={<Rocket className="h-5 w-5" />}
            bgColor="bg-purple-50 dark:bg-purple-950/20"
            count={8}
          />
          <CollectionCard 
            title="Premium Subscription Boxes" 
            description="Curated subscription services delivered to your door."
            icon={<Package className="h-5 w-5" />}
            bgColor="bg-amber-50 dark:bg-amber-950/20"
            count={10}
          />
          <CollectionCard 
            title="Artisanal Food & Beverage" 
            description="Small-batch, craft food and beverage makers."
            icon={<Coffee className="h-5 w-5" />}
            bgColor="bg-red-50 dark:bg-red-950/20"
            count={14}
          />
          <CollectionCard 
            title="Wellness & Self-Care" 
            description="Brands focused on health, wellness and personal care."
            icon={<Heart className="h-5 w-5" />}
            bgColor="bg-pink-50 dark:bg-pink-950/20"
            count={16}
          />
          <CollectionCard 
            title="Luxury at Direct Prices" 
            description="Premium quality brands without the retail markup."
            icon={<ShoppingBag className="h-5 w-5" />}
            bgColor="bg-slate-50 dark:bg-slate-950/20"
            count={9}
          />
          <CollectionCard 
            title="Design-Forward Brands" 
            description="Brands with exceptional design aesthetics and creativity."
            icon={<Palette className="h-5 w-5" />}
            bgColor="bg-indigo-50 dark:bg-indigo-950/20"
            count={11}
          />
        </div>

        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon: Create Your Own Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're working on allowing you to create and share your own curated collections of favorite D2C brands. 
            Stay tuned for updates!
          </p>
        </div>
      </main>
    </div>
  );
}

// Helper component for collection cards
function CollectionCard({ 
  title, 
  description, 
  icon, 
  bgColor,
  count
}: { 
  title: string; 
  description: string; 
  icon: JSX.Element;
  bgColor: string;
  count: number;
}) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${bgColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="px-3 py-1 flex gap-1 items-center">
            {icon}
            Collection
          </Badge>
          <Badge variant="secondary">{count} Brands</Badge>
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Badge variant="secondary" className="w-full justify-center py-2 cursor-pointer hover:bg-secondary/80">
          Coming Soon
        </Badge>
      </CardFooter>
    </Card>
  );
}

export default Collections;
