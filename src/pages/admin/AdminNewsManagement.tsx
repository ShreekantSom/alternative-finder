
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Search, Calendar, Eye } from 'lucide-react';
import { NewsItem } from '@/components/service/tabs/BusinessNewsTab';
import { Badge } from '@/components/ui/badge';

// Mock news data
const mockNews: (NewsItem & { status: 'published' | 'draft' | 'scheduled', businessName: string })[] = [
  {
    id: '1',
    title: 'DoorDash Expands to 5 New Cities',
    content: 'DoorDash announced their expansion into 5 new metropolitan areas, increasing their delivery coverage by 15%.',
    date: '2023-11-15',
    source: 'Press Release',
    url: 'https://example.com/doordash-expansion',
    excerpt: 'DoorDash expands delivery coverage by 15%.',
    imageUrl: 'https://example.com/doordash-image.jpg',
    status: 'published',
    businessName: 'DoorDash'
  },
  {
    id: '2',
    title: 'Netflix Introduces New Subscription Tier',
    content: 'Netflix is rolling out a new budget-friendly subscription tier with limited advertisements to attract more subscribers.',
    date: '2023-12-01',
    source: 'Company Blog',
    url: 'https://example.com/netflix-tier',
    excerpt: 'New budget-friendly subscription with limited ads.',
    imageUrl: 'https://example.com/netflix-image.jpg',
    status: 'published',
    businessName: 'Netflix'
  },
  {
    id: '3',
    title: 'Uber to Launch Sustainable Transport Initiative',
    content: 'Uber has announced a new initiative to increase the number of electric vehicles in its fleet by 30% over the next two years.',
    date: '2024-01-10',
    source: 'Press Release',
    url: 'https://example.com/uber-initiative',
    excerpt: 'New initiative to increase electric vehicles in fleet.',
    imageUrl: 'https://example.com/uber-image.jpg',
    status: 'scheduled',
    businessName: 'Uber'
  },
  {
    id: '4',
    title: 'Amazon Prime Day Dates Announced',
    content: 'Amazon has revealed the dates for its annual Prime Day sale event, promising bigger discounts than ever before.',
    date: '2023-11-30',
    source: 'Internal',
    excerpt: 'Annual Prime Day sale dates announced.',
    status: 'draft',
    businessName: 'Amazon'
  }
];

export function AdminNewsManagement() {
  const [news, setNews] = useState(mockNews);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return '';
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">News Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add News
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.businessName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No news found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminNewsManagement;
