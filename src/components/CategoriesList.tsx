
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { categories } from '@/assets/data';
import { useAnimateInView } from '@/lib/animations';
import { LucideIcon, Globe, Paintbrush, Code, Gamepad2, Music, Briefcase, Image, Shield, MessageCircle, Wrench, GraduationCap, Landmark } from 'lucide-react';
import { crawlCategories } from '@/lib/crawler';
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function CategoriesList({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const [allCategories, setAllCategories] = useState<Category[]>(categories);
  const { ref, isInView } = useAnimateInView();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await crawlCategories();
      if (result.success && result.data) {
        setAllCategories([
          { id: 'all', name: 'All Categories', icon: 'layers', count: result.data.reduce((acc: number, cat: Category) => acc + cat.count, 0) },
          ...result.data
        ]);
      } else {
        toast({
          title: "Couldn't fetch categories",
          description: result.error || "Please try again later",
          variant: "destructive",
        });
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
      'tool': Wrench, // Changed Tool to Wrench
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
                onClick={() => onCategorySelect(category.id === 'all' ? 'All' : category.name)}
              >
                <div className="flex flex-col items-center p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-all duration-200">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent rounded-full mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-center">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} apps</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesList;
