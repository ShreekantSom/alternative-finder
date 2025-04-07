
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";

export function BusinessAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Insights</CardTitle>
          <CardDescription>Track performance metrics for your business listing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="traffic">
            <TabsList className="mb-4">
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
              <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic" className="space-y-4">
              <div className="h-[300px]">
                <LineChart 
                  data={[
                    { name: 'Mon', views: 120, unique: 80 },
                    { name: 'Tue', views: 140, unique: 90 },
                    { name: 'Wed', views: 180, unique: 110 },
                    { name: 'Thu', views: 160, unique: 95 },
                    { name: 'Fri', views: 200, unique: 130 },
                    { name: 'Sat', views: 100, unique: 70 },
                    { name: 'Sun', views: 80, unique: 50 },
                  ]}
                  index="name"
                  categories={['views', 'unique']}
                  colors={['blue', 'green']}
                  className="h-[300px]" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,942</div>
                    <div className="text-xs text-green-500">+12% vs last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Unique Visitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6,421</div>
                    <div className="text-xs text-green-500">+8% vs last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Avg. Time on Page</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2:35</div>
                    <div className="text-xs text-red-500">-3% vs last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Bounce Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32%</div>
                    <div className="text-xs text-green-500">-5% vs last month</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="conversion">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart 
                      data={[
                        { name: 'Direct', value: 40 },
                        { name: 'Search', value: 30 },
                        { name: 'Social', value: 20 },
                        { name: 'Referral', value: 10 },
                      ]}
                      index="name"
                      categories={['value']}
                      colors={['blue', 'green', 'yellow', 'red']}
                      className="h-[300px]" 
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LineChart 
                      data={[
                        { name: 'Jan', website: 45, wishlist: 28 },
                        { name: 'Feb', website: 52, wishlist: 32 },
                        { name: 'Mar', website: 49, wishlist: 34 },
                        { name: 'Apr', website: 63, wishlist: 42 },
                        { name: 'May', website: 59, wishlist: 45 },
                        { name: 'Jun', website: 68, wishlist: 51 },
                      ]}
                      index="name"
                      categories={['website', 'wishlist']}
                      colors={['blue', 'purple']}
                      className="h-[300px]" 
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="competitors">
              <p className="mb-4 text-muted-foreground">Compare key metrics with similar businesses in your category.</p>
              <BarChart 
                data={[
                  { name: 'Your Business', views: 100, engagement: 80, conversion: 60 },
                  { name: 'Competitor A', views: 80, engagement: 90, conversion: 50 },
                  { name: 'Competitor B', views: 120, engagement: 70, conversion: 40 },
                  { name: 'Competitor C', views: 90, engagement: 60, conversion: 70 },
                  { name: 'Category Avg', views: 95, engagement: 75, conversion: 55 },
                ]}
                index="name"
                categories={['views', 'engagement', 'conversion']}
                colors={['blue', 'green', 'purple']}
                className="h-[400px]" 
              />
            </TabsContent>
            
            <TabsContent value="keywords">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Search Keywords</CardTitle>
                    <CardDescription>Keywords that drive traffic to your listing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['business alternative', 'competitor to', 'vs', 'pricing comparison', 'features'].map((keyword, i) => (
                        <div key={i} className="flex justify-between items-center p-2 border-b">
                          <span>{keyword}</span>
                          <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 200) + 50} searches</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default BusinessAnalytics;
