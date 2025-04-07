
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
  if (!newsItems || newsItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">News & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No news or updates available at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">News & Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {newsItems.map((item) => (
          <div key={item.id} className="border-b pb-4 last:border-0">
            <h3 className="font-medium text-lg mb-1">{item.title}</h3>
            {item.excerpt ? (
              <p className="text-muted-foreground mb-2">{item.excerpt}</p>
            ) : (
              <p className="text-muted-foreground mb-2">{item.content.substring(0, 150)}...</p>
            )}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {new Date(item.date).toLocaleDateString()} 
                {item.source && <span> • {item.source}</span>}
              </div>
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Read more
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default BusinessNewsTab;
