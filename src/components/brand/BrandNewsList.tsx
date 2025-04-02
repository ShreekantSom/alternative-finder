
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import BrandNewsForm from './BrandNewsForm';

interface BrandNewsItem {
  id: string;
  brandId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

interface BrandNewsListProps {
  brandId: string;
  brandName: string;
}

export default function BrandNewsList({ brandId, brandName }: BrandNewsListProps) {
  const [newsItems, setNewsItems] = useState<BrandNewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<BrandNewsItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load news from localStorage
    const loadNews = () => {
      const newsJson = localStorage.getItem('brand_news');
      const allNews: BrandNewsItem[] = newsJson ? JSON.parse(newsJson) : [];
      return allNews.filter(item => item.brandId === brandId);
    };
    
    setNewsItems(loadNews());
  }, [brandId]);

  const handleSaveNews = (newsData: Partial<BrandNewsItem>) => {
    // Load all news first
    const newsJson = localStorage.getItem('brand_news');
    const allNews: BrandNewsItem[] = newsJson ? JSON.parse(newsJson) : [];
    
    let updatedNews: BrandNewsItem[];
    
    if (editingNews) {
      // Update existing news
      updatedNews = allNews.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...newsData, brandId } 
          : item
      );
      toast({
        title: "News Updated",
        description: "Your news item has been updated successfully"
      });
    } else {
      // Create new news
      const newNewsItem: BrandNewsItem = {
        id: `news-${Date.now()}`,
        brandId,
        title: newsData.title || '',
        content: newsData.content || '',
        imageUrl: newsData.imageUrl,
        createdAt: new Date().toISOString()
      };
      updatedNews = [...allNews, newNewsItem];
      toast({
        title: "News Created",
        description: "Your news item has been published successfully"
      });
    }
    
    // Save to localStorage
    localStorage.setItem('brand_news', JSON.stringify(updatedNews));
    
    // Update state
    setNewsItems(updatedNews.filter(item => item.brandId === brandId));
    setIsFormOpen(false);
    setEditingNews(null);
  };

  const handleEditNews = (newsItem: BrandNewsItem) => {
    setEditingNews(newsItem);
    setIsFormOpen(true);
  };

  const handleDeleteNews = (newsId: string) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      const newsJson = localStorage.getItem('brand_news');
      const allNews: BrandNewsItem[] = newsJson ? JSON.parse(newsJson) : [];
      const updatedNews = allNews.filter(item => item.id !== newsId);
      
      localStorage.setItem('brand_news', JSON.stringify(updatedNews));
      setNewsItems(updatedNews.filter(item => item.brandId === brandId));
      
      toast({
        title: "News Deleted",
        description: "Your news item has been deleted successfully"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{brandName} News</h2>
        <Button onClick={() => {
          setEditingNews(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add News
        </Button>
      </div>

      {isFormOpen && (
        <BrandNewsForm 
          initialData={editingNews} 
          onSave={handleSaveNews}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingNews(null);
          }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't published any news yet</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First News
            </Button>
          </div>
        ) : (
          newsItems.map(news => (
            <Card key={news.id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                <CardDescription>
                  {new Date(news.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{news.content}</p>
                {news.imageUrl && (
                  <div className="mt-4 h-32 overflow-hidden rounded-md">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditNews(news)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteNews(news.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
