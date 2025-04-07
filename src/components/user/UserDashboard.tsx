
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "./UserProfile";
import UserWishlist from "./UserWishlist";
import UserCollections from "./UserCollections";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  UserCircle, 
  BookmarkIcon, 
  FolderIcon, 
  Settings, 
  Clock, 
  BarChart3 
} from "lucide-react";

export function UserDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
              <CardDescription>
                Last 7 days
              </CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
              <CardDescription>
                Wishlists & Collections
              </CardDescription>
            </div>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Comparisons</CardTitle>
              <CardDescription>
                Active comparisons
              </CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <UserCircle className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="wishlists" className="flex items-center space-x-2">
            <BookmarkIcon className="h-4 w-4" />
            <span>Wishlists</span>
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center space-x-2">
            <FolderIcon className="h-4 w-4" />
            <span>Collections</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="py-4">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="wishlists" className="py-4">
          <UserWishlist />
        </TabsContent>
        
        <TabsContent value="collections" className="py-4">
          <UserCollections />
        </TabsContent>
        
        <TabsContent value="history" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recently Viewed</CardTitle>
              <CardDescription>Your browsing history from the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex items-start border border-border rounded-md p-4">
                    <div className="h-14 w-14 rounded overflow-hidden mr-4">
                      <img 
                        src={`/images/placeholder${item % 3 + 1}.svg`} 
                        alt="Business logo" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Business Name {item}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Category Name</p>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          Viewed {Math.floor(Math.random() * 7) + 1} days ago
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserDashboard;
