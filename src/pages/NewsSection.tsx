
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Calendar, News, Bookmark, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  date: string;
  source: string;
  sourceUrl: string;
  featured?: boolean;
}

// Mock news data - in a real app, this would come from an API
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Meesho Launches Same-Day Delivery in Metro Cities',
    summary: 'E-commerce platform Meesho expands its logistics network to offer same-day delivery.',
    content: 'D2C e-commerce platform Meesho announced today that it has expanded its logistics network to offer same-day delivery services in major metro cities across India. This move aims to compete directly with Amazon and Flipkart in the fast-delivery segment, especially for fashion and lifestyle products. The company has partnered with several regional logistics providers to enable this service.',
    category: 'E-commerce',
    imageUrl: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023-07-15',
    source: 'D2C News',
    sourceUrl: 'https://example.com/news1'
  },
  {
    id: '2',
    title: 'SUGAR Cosmetics Secures $50M in Series D Funding',
    summary: 'The D2C beauty brand plans to expand its offline presence and launch new product lines.',
    content: 'SUGAR Cosmetics, a leading D2C beauty brand, has successfully raised $50 million in its Series D funding round led by L Catterton with participation from existing investors. The company plans to use the funds to expand its offline retail presence across India and launch several new product lines focusing on skincare. This funding comes at a time when the Indian beauty market is experiencing rapid growth with increasing consumer interest in homegrown brands.',
    category: 'Funding',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023-08-20',
    source: 'Venture Beat',
    sourceUrl: 'https://example.com/news2',
    featured: true
  },
  {
    id: '3',
    title: 'Lenskart Opens 100th International Store in Singapore',
    summary: 'The eyewear giant continues its global expansion with new flagship store.',
    content: 'Lenskart, India\'s leading D2C eyewear brand, has inaugurated its 100th international store in Singapore\'s Orchard Road shopping district. This milestone comes as part of the company\'s aggressive global expansion strategy that began in 2019. The company has revealed plans to enter the Middle Eastern market by the end of this year, with initial stores in Dubai and Abu Dhabi. Lenskart\'s technology-first approach has been key to its international success.',
    category: 'Retail',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023-09-05',
    source: 'Retail Insights',
    sourceUrl: 'https://example.com/news3'
  },
  {
    id: '4',
    title: 'boAt Announces Manufacturing Partnership with Dixon Technologies',
    summary: 'The audio D2C brand moves to increase local manufacturing capacity.',
    content: 'boAt, India\'s leading audio and wearables D2C brand, has announced a strategic manufacturing partnership with Dixon Technologies to boost its local production capabilities. This move aligns with the company\'s commitment to the Make in India initiative and aims to reduce dependency on imports. The partnership will focus on producing wireless earbuds and smartwatches at Dixon\'s Noida facility, with plans to manufacture over 5 million units annually.',
    category: 'Manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023-10-10',
    source: 'Manufacturing Today',
    sourceUrl: 'https://example.com/news4',
    featured: true
  },
  {
    id: '5',
    title: 'Mamaearth's Parent Company Honasa Files for IPO',
    summary: 'The D2C personal care conglomerate aims to raise ₹3,000 crore through public offering.',
    content: 'Honasa Consumer, the parent company of D2C brands Mamaearth, The Derma Co, and BBlunt, has filed draft papers with SEBI for an initial public offering. The company aims to raise approximately ₹3,000 crore through fresh issue and offer for sale by existing shareholders. This marks a significant milestone as one of the first major D2C-focused companies in India to go public. The IPO proceeds will be used for marketing investments, retail expansion, and potential acquisitions.',
    category: 'Investment',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023-11-15',
    source: 'Financial Express',
    sourceUrl: 'https://example.com/news5'
  }
];

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setNews(mockNewsData);
      setFeaturedNews(mockNewsData.filter(item => item.featured));
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const categorizeNews = () => {
    // Get unique categories
    const categories = Array.from(new Set(news.map(item => item.category)));
    
    // Create tabs content based on categories
    return categories.map(category => ({
      id: category.toLowerCase().replace(' ', '-'),
      label: category,
      content: news.filter(item => item.category === category)
    }));
  };

  const handleNewsSelect = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNews = (newsId: string) => {
    toast({
      title: "News saved",
      description: "This article has been saved to your bookmarks",
    });
  };

  const categorizedNews = categorizeNews();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <News className="h-6 w-6" />
            D2C Industry News
          </h1>
          <p className="text-muted-foreground">Stay updated with the latest happenings in the D2C space</p>
        </div>

        {/* Featured News Section */}
        {featuredNews.length > 0 && !selectedNews && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Featured News
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary flex items-center gap-1"
                      onClick={() => handleNewsSelect(item)}
                    >
                      Read more <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveNews(item.id)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Selected News Detail View */}
        {selectedNews && (
          <section className="mb-12">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setSelectedNews(null)}
            >
              ← Back to all news
            </Button>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline">{selectedNews.category}</Badge>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {new Date(selectedNews.date).toLocaleDateString()}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-6">{selectedNews.title}</h1>
              
              <div className="aspect-[16/9] w-full mb-8">
                <img 
                  src={selectedNews.imageUrl} 
                  alt={selectedNews.title} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-muted-foreground text-lg font-medium mb-6">
                  {selectedNews.summary}
                </p>
                <p>{selectedNews.content}</p>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Source: {selectedNews.source}
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSaveNews(selectedNews.id)}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <a 
                    href={selectedNews.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Source
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All News Section */}
        {!selectedNews && (
          <section>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-12">
              <div className="border-b mb-6">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="all">All News</TabsTrigger>
                  {categorizedNews.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="space-y-6">
                  {news.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="md:w-3/4 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground line-clamp-2">{item.summary}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-primary flex items-center gap-1"
                              onClick={() => handleNewsSelect(item)}
                            >
                              Read more <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveNews(item.id)}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {categorizedNews.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="space-y-6">
                    {category.content.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="md:w-3/4 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{item.category}</Badge>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                              </div>
                              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                              <p className="text-muted-foreground line-clamp-2">{item.summary}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-primary flex items-center gap-1"
                                onClick={() => handleNewsSelect(item)}
                              >
                                Read more <ArrowRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveNews(item.id)}
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}
      </main>
    </div>
  );
}

export default NewsSection;
