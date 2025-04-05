
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryService } from '@/lib/categoryService';
import { createSlug } from '@/lib/softwareUtils';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  count?: number;
}

interface SubcategoryListProps {
  categoryName: string;
}

export function SubcategoryList({ categoryName }: SubcategoryListProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setIsLoading(true);
      try {
        const result = await categoryService.getSubcategories(categoryName);
        if (result.success && result.data) {
          setSubcategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryName) {
      fetchSubcategories();
    }
  }, [categoryName]);

  if (isLoading) {
    return <SubcategoryListSkeleton />;
  }

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Subcategories in {categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => (
          <Link 
            key={subcategory.id} 
            to={`/subcategory/${createSlug(subcategory.name)}`}
            className="block group"
          >
            <Card className="h-full hover:shadow-md transition-all duration-300 border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                <CardDescription>
                  {subcategory.count !== undefined 
                    ? `${subcategory.count} service${subcategory.count !== 1 ? 's' : ''}`
                    : 'Browse services'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {categoryName}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SubcategoryListSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full border-border/40">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SubcategoryList;
