
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Using the same mock data structure as in the NewsSection page
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

// Mock data for featured news articles (shortened version)
const featuredNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "New D2C Brands Disrupting the Fashion Industry",
    summary: "Discover how these innovative D2C fashion brands are challenging traditional retail models.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "Fashion",
    author: "Jane Smith",
    publishedAt: "2023-06-15",
    readTime: "5 min",
    tags: ["fashion", "d2c"],
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "The Rise of D2C Health and Wellness Products",
    summary: "How consumer health brands are bypassing traditional channels to reach customers directly.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "Health",
    author: "Michael Johnson",
    publishedAt: "2023-05-22",
    readTime: "7 min",
    tags: ["health", "wellness"],
    imageUrl: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "D2C Food Delivery Services Expanding Nationwide",
    summary: "These meal kit and specialty food D2C brands are seeing record growth post-pandemic.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "Food",
    author: "Sarah Williams",
    publishedAt: "2023-04-18",
    readTime: "4 min",
    tags: ["food", "delivery"],
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"
  }
];

export function HomeNews() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Latest Industry News</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends and developments in the Direct-to-Consumer industry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featuredNewsArticles.map(article => (
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
        
        <div className="text-center">
          <Link to="/news">
            <Button variant="outline" size="lg">
              View All News <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeNews;
