
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  source?: string;
  url?: string;
  excerpt?: string;
  imageUrl?: string;
}

interface BusinessNewsTabProps {
  newsItems?: NewsItem[];
}

export function BusinessNewsTab({ newsItems }: BusinessNewsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Company News</CardTitle>
      </CardHeader>
      <CardContent>
        {newsItems && newsItems.length > 0 ? (
          <div className="space-y-6">
            {newsItems.map((news) => (
              <div key={news.id} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{news.title}</h3>
                  <span className="text-sm text-muted-foreground">{news.date}</span>
                </div>
                {news.imageUrl && (
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-48 object-cover rounded-md mb-4" 
                  />
                )}
                <p>{news.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No news available for this business.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BusinessNewsTab;
export type { NewsItem };
