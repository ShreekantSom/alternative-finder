
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart } from "@/components/ui/recharts";
import BusinessProfileEditor from "./BusinessProfileEditor";
import BusinessAnalytics from "./BusinessAnalytics";
import BusinessEngagement from "./BusinessEngagement";
import BusinessMediaGallery from "./BusinessMediaGallery";
import { Briefcase, BarChart as BarChartIcon, MessageSquare, Image, Settings } from "lucide-react";

export function BusinessUserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
          <p className="text-muted-foreground">Manage your business presence and monitor performance</p>
        </div>
        <Button className="mt-4 sm:mt-0">View Public Listing</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Engagement
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" /> Media
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Comparison Inclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">189</div>
                <p className="text-xs text-muted-foreground">+3.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Wishlist Saves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+8.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Daily views and interactions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={[
                    { name: 'Jan', value: 400 },
                    { name: 'Feb', value: 300 },
                    { name: 'Mar', value: 500 },
                    { name: 'Apr', value: 350 },
                    { name: 'May', value: 450 },
                    { name: 'Jun', value: 600 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                  className="h-72" 
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Platform user segments interested in your business</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'Small Business', value: 35 },
                    { name: 'Enterprise', value: 25 },
                    { name: 'Freelancer', value: 20 },
                    { name: 'Consumer', value: 15 },
                    { name: 'Other', value: 5 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                  className="h-72" 
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest interactions with your business listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-2 border-b">
                    <div>
                      <p className="font-medium">New Review Posted</p>
                      <p className="text-muted-foreground text-sm">User rated your business 4/5 stars</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b">
                    <div>
                      <p className="font-medium">Feature Comparison</p>
                      <p className="text-muted-foreground text-sm">Your business was compared with 2 others</p>
                    </div>
                    <span className="text-sm text-muted-foreground">Yesterday</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b">
                    <div>
                      <p className="font-medium">Added to Wishlist</p>
                      <p className="text-muted-foreground text-sm">3 users added your business to their wishlists</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Question Asked</p>
                      <p className="text-muted-foreground text-sm">New question about your pricing model</p>
                    </div>
                    <span className="text-sm text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <BusinessAnalytics />
        </TabsContent>

        <TabsContent value="engagement">
          <BusinessEngagement />
        </TabsContent>

        <TabsContent value="media">
          <BusinessMediaGallery />
        </TabsContent>

        <TabsContent value="settings">
          <BusinessProfileEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BusinessUserDashboard;
