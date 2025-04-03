
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoriesList from '@/components/CategoriesList';
import CuratedCollections from '@/components/home/CuratedCollections';
import NewBrandSpotlights from '@/components/home/NewBrandSpotlights';
import { useNavigate } from 'react-router-dom';
import { Compass, Award, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alternative } from '@/assets/data'; // Import directly from assets/data
import { softwareService } from '@/lib/softwareService';
import AlternativesGrid from '@/components/alternatives/AlternativesGrid';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Discover() {
  const navigate = useNavigate();
  const [franchiseOptions, setFranchiseOptions] = useState<Alternative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchFranchiseOptions = async () => {
      setIsLoading(true);
      try {
        const allBusinesses = await softwareService.getAllSoftware();
        if (allBusinesses.success && allBusinesses.data) {
          // Filter businesses that offer franchising options
          const franchiseBusiness = (allBusinesses.data as Alternative[])
            .filter(business => business.franchise?.available === true)
            .slice(0, 6); // Limit to 6 for display
          
          setFranchiseOptions(franchiseBusiness);
        }
      } catch (error) {
        console.error("Error fetching franchise businesses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFranchiseOptions();
  }, []);
  
  const handleCategorySelect = (category: string) => {
    navigate('/', { state: { selectedCategory: category } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 text-center">
            <Compass className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Discover Businesses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections, discover new brand spotlights, browse franchise opportunities, and find businesses by categories.
            </p>
          </div>
        </section>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="franchise">Franchise Options</TabsTrigger>
              <TabsTrigger value="new">New Businesses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              {/* Categories Section */}
              <CategoriesList onCategorySelect={handleCategorySelect} />
            </TabsContent>
            
            <TabsContent value="collections">
              {/* Curated Collections */}
              <CuratedCollections />
            </TabsContent>
            
            <TabsContent value="franchise">
              {/* Franchise Options */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <Award className="mr-2 h-6 w-6 text-primary" />
                      Franchise Opportunities
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Discover businesses offering franchise opportunities
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/franchise-directory')}
                  >
                    <Filter className="h-4 w-4" />
                    View All
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-56">
                        <CardContent className="p-6 flex flex-col space-y-4 animate-pulse">
                          <div className="h-24 bg-secondary rounded-md" />
                          <div className="h-4 bg-secondary rounded w-3/4" />
                          <div className="h-4 bg-secondary rounded w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : franchiseOptions.length > 0 ? (
                  <AlternativesGrid alternatives={franchiseOptions} />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No franchise opportunities available at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              {/* New Brand Spotlights */}
              <NewBrandSpotlights />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default Discover;
