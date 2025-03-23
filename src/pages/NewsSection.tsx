
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Tag } from 'lucide-react';

// Define the news article type
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl: string;
}

// Mock data for news articles
const mockNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "New D2C Brands Disrupting the Fashion Industry",
    summary: "Discover how these innovative D2C fashion brands are challenging traditional retail models.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas euismod, nunc ut aliquet faucibus, nisi nunc tincidunt nisi, euismod aliquet nunc nisl euismod.",
    category: "Fashion",
    author: "Jane Smith",
    publishedAt: "2023-06-15",
    readTime: "5 min",
    tags: ["fashion", "d2c", "retail", "ecommerce"],
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "The Rise of D2C Health and Wellness Products",
    summary: "How consumer health brands are bypassing traditional channels to reach customers directly.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas euismod, nunc ut aliquet faucibus, nisi nunc tincidunt nisi, euismod aliquet nunc nisl euismod.",
    category: "Health",
    author: "Michael Johnson",
    publishedAt: "2023-05-22",
    readTime: "7 min",
    tags: ["health", "wellness", "d2c", "supplements"],
    imageUrl: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "D2C Food Delivery Services Expanding Nationwide",
    summary: "These meal kit and specialty food D2C brands are seeing record growth post-pandemic.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas euismod, nunc ut aliquet faucibus, nisi nunc tincidunt nisi, euismod aliquet nunc nisl euismod.",
    category: "Food",
    author: "Sarah Williams",
    publishedAt: "2023-04-18",
    readTime: "4 min",
    tags: ["food", "delivery", "meal-kits", "d2c"],
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Tech Gadgets Going Direct: The New D2C Electronics Wave",
    summary: "Consumer electronics companies are increasingly adopting direct-to-consumer sales strategies.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas euismod, nunc ut aliquet faucibus, nisi nunc tincidunt nisi, euismod aliquet nunc nisl euismod.",
    category: "Technology",
    author: "David Chen",
    publishedAt: "2023-03-30",
    readTime: "6 min",
    tags: ["technology", "electronics", "d2c", "gadgets"],
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "How D2C Furniture Brands Are Redesigning the Customer Experience",
    summary: "Innovative furniture companies are eliminating the middleman and offering better value.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas euismod, nunc ut aliquet faucibus, nisi nunc tincidunt nisi, euismod aliquet nunc nisl euismod.",
    category: "Home",
    author: "Emily Rodriguez",
    publishedAt: "2023-02-14",
    readTime: "8 min",
    tags: ["furniture", "home", "d2c", "design"],
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop"
  }
];

// Get unique categories from mock data
const categories = ["All", ...Array.from(new Set(mockNewsArticles.map(article => article.category)))];

export function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(mockNewsArticles);
  
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredArticles(mockNewsArticles);
    } else {
      setFilteredArticles(mockNewsArticles.filter(article => article.category === selectedCategory));
    }
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">D2C Industry News</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and developments in the Direct-to-Consumer industry.
          </p>
        </div>
        
        <Tabs defaultValue="All" className="mb-10">
          <TabsList className="flex justify-start overflow-x-auto pb-2 mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                    <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs gap-2 mt-2">
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {article.readTime}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {article.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs flex items-center">
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs" aria-label="Read more">
                      Read more <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default NewsSection;
