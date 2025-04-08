
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, Line, Pie } from "recharts";

export function BusinessAnalytics() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        {["performance", "traffic", "demographics", "engagement"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{tab === "performance" ? "Views & Interactions" : 
                             tab === "traffic" ? "Traffic Sources" :
                             tab === "demographics" ? "User Demographics" : "Engagement Metrics"}</CardTitle>
                  <CardDescription>Data from the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">{tab} chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Performance summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Total Views", value: "3,872", change: "+15.2%" },
                      { label: "Unique Visitors", value: "1,245", change: "+8.7%" },
                      { label: "Avg. Session Duration", value: "2:34", change: "+1:12" },
                      { label: "Conversion Rate", value: "3.8%", change: "+0.5%" }
                    ].map((metric, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-muted/10 rounded-md">
                        <span className="font-medium">{metric.label}</span>
                        <div className="text-right">
                          <div className="font-bold">{metric.value}</div>
                          <div className="text-xs text-green-500">{metric.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default BusinessAnalytics;
