
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimateInView } from '@/lib/animations';
import { Link } from 'react-router-dom';
import { LucideIcon, Globe, Paintbrush, Code, Gamepad2, Music, Briefcase, Image, Shield, MessageCircle, Wrench, GraduationCap, Landmark } from 'lucide-react';
import { crawlCategories } from '@/lib/crawler';
import { useToast } from "@/components/ui/use-toast";
import { softwareService } from '@/lib/softwareService';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function CategoriesList({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isInView } = useAnimateInView();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch all categories
        const categoriesResult = await crawlCategories();
        
        if (categoriesResult.success && categoriesResult.data) {
          // For each category, get the actual count of software items
          const categoriesWithCounts = await Promise.all(
            categoriesResult.data.map(async (category: Category) => {
              // Skip the 'all' category as its count will be calculated after
              if (category.id === 'all') {
                return category;
              }
              
              const result = await softwareService.getSoftwareByCategory(category.name);
              if (result.success) {
                return {
                  ...category,
                  count: result.data.length
                };
              }
              return category;
            })
          );
          
          // Update the 'all' category count
          const allSoftwareResult = await softwareService.getAllSoftware();
          const totalCount = allSoftwareResult.success ? allSoftwareResult.data.length : 0;
          
          const updatedCategories = categoriesWithCounts.map(category => 
            category.id === 'all' ? { ...category, count: totalCount } : category
          );
          
          setAllCategories(updatedCategories);
        } else {
          toast({
            title: "Couldn't fetch categories",
            description: categoriesResult.error || "Please try again later",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  const getIconComponent = (iconName: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'globe': Globe,
      'paintbrush': Paintbrush,
      'code': Code,
      'gamepad-2': Gamepad2,
      'music': Music,
      'briefcase': Briefcase,
      'image': Image,
      'shield': Shield,
      'message-circle': MessageCircle,
      'tool': Wrench,
      'wrench': Wrench,
      'graduation-cap': GraduationCap,
      'landmark': Landmark,
      // Add default
      'layers': Globe,
    };
    
    return iconMap[iconName] || Globe;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <section ref={ref} className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="flex flex-col items-center p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 bg-accent rounded-full mb-3"></div>
                  <div className="h-4 bg-accent rounded w-20 mb-2"></div>
                  <div className="h-3 bg-accent rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-8 px-4">
      <div className="container max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Browse by Category</h2>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {allCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="cursor-pointer"
              >
                <Link 
                  to={category.id === 'all' ? '/' : `/category/${category.id}`}
                  onClick={() => onCategorySelect(category.id === 'all' ? 'All' : category.name)}
                  className="block"
                >
                  <div className="flex flex-col items-center p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-all duration-200">
                    <div className="w-12 h-12 flex items-center justify-center bg-accent rounded-full mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-center">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} apps</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesList;
