
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AlternativesGrid from '@/components/alternatives/AlternativesGrid';
import { softwareService } from '@/lib/softwareService';
import { categoryService } from '@/lib/categoryService';
import { Loader2, Tag, ThumbsUp } from 'lucide-react';
import { Alternative, Category } from '@/assets/data';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import CategoryFeatureBadge from '@/components/CategoryFeatureBadge';

export function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Alternative[]>([]);
  const [topServices, setTopServices] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        // Get category details
        const categoryResult = await categoryService.getCategoryById(categoryId);
        
        if (!categoryResult.success) {
          // If category not found by ID, try finding by name/slug
          const categoriesResult = await softwareService.getCategories();
          
          if (categoriesResult.success) {
            const foundCategory = categoriesResult.data.find(
              (cat: any) => 
                cat.id === categoryId || 
                cat.name.toLowerCase() === categoryId.toLowerCase() ||
                categoryService.createSlug(cat.name) === categoryId
            );
            
            if (foundCategory) {
              setCategory(foundCategory);
              
              // Get services for this category
              const servicesResult = await softwareService.getSoftwareByCategory(foundCategory.name);
              
              if (servicesResult.success) {
                setServices(servicesResult.data);
                
                // Sort services by likes to get top rated
                const topRatedServices = [...servicesResult.data]
                  .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                  .slice(0, 3);
                
                setTopServices(topRatedServices);
              }
              
              setIsLoading(false);
              return;
            }
          }
          
          toast({
            title: "Category not found",
            description: "We couldn't find this category",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setCategory(categoryResult.data);
        
        // Get services for this category
        const servicesResult = await softwareService.getSoftwareByCategory(categoryResult.data.name);
        
        if (servicesResult.success) {
          setServices(servicesResult.data);
          
          // Sort services by likes to get top rated
          const topRatedServices = [...servicesResult.data]
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 3);
          
          setTopServices(topRatedServices);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        toast({
          title: "Error",
          description: "Failed to load category details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryDetails();
  }, [categoryId, toast]);

  // Category descriptions based on category name
  const getCategoryDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      'Quick Commerce': 'Fast delivery services for all your needs, bringing products to your doorstep in minutes.',
      'Food Delivery': 'Enjoy meals from your favorite restaurants delivered right to your door.',
      'Ride-Sharing': 'Convenient transportation options that connect drivers with passengers for efficient travel.',
      'Entertainment': 'Services that provide content and experiences to keep you engaged and entertained.',
      'Meal Kits': 'Pre-portioned ingredients and recipes delivered to your home for easy meal preparation.',
      'Grocery': 'Shop for fresh food and household essentials from the comfort of your home.',
      'Health & Wellness': 'Services focused on improving your physical and mental wellbeing.',
      'Fashion': 'Trendy clothing, accessories, and style services delivered directly to consumers.',
      'Beauty': 'Cosmetics, skincare, and personal care products from innovative direct-to-consumer brands.',
      'Home Goods': 'Quality furnishings, decor, and household essentials for your living spaces.',
      'Pet Supplies': 'Everything your furry friends need, from food to toys and accessories.',
      'Subscription Boxes': 'Curated products delivered periodically to discover new brands and experiences.',
      'Travel': 'Services that help you book and enjoy trips, accommodations, and experiences.',
      'All Categories': 'Explore all direct-to-consumer services across various industries.',
    };
    
    return descriptions[name] || `Discover top ${name} services and alternatives from direct-to-consumer brands.`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-10">
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-10">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-10">
        {/* Category Header */}
        <section className="py-10 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {getCategoryDescription(category.name)}
          </p>
          
          {/* Category Stats */}
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant="outline" className="flex items-center gap-1 text-sm">
              <Tag className="h-3.5 w-3.5" />
              {category.count} services
            </Badge>
          </div>
        </section>
        
        {/* Top Rated Services Section */}
        {topServices.length > 0 && (
          <section className="py-10 border-b border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Rated Services</h2>
              <ThumbsUp className="h-5 w-5 text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topServices.map((service, index) => (
                <div key={service.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                      {service.imageUrl && (
                        <img 
                          src={service.imageUrl} 
                          alt={service.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.likes?.toLocaleString() || 0} likes</p>
                      {service.features && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.features.slice(0, 2).map((feature, idx) => (
                            <CategoryFeatureBadge key={idx} feature={feature} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* All Services Section */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">All {category.name} Services</h2>
          {services.length > 0 ? (
            <AlternativesGrid alternatives={services} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No services found in this category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CategoryDetail;
