
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { UserCircle, Bell, ShieldAlert, BookmarkPlus } from "lucide-react";

export function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Tech enthusiast and business analyst",
    phone: "+1 (555) 123-4567",
    notifications: {
      email: true,
      push: false,
      marketing: true
    },
    privacy: {
      publicProfile: true,
      shareActivities: false
    }
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  const handleNotificationToggle = (setting: keyof typeof user.notifications) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handlePrivacyToggle = (setting: keyof typeof user.privacy) => {
    setUser(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal-info">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="personal-info" className="flex items-center space-x-2">
              <UserCircle className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal-info">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email} 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={user.phone}
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio"
                    className="w-full h-32 p-3 rounded-md border border-input bg-transparent text-sm"
                    value={user.bio}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                  />
                </div>
              </div>
              
              <Button type="submit" className="mt-6">Save Changes</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                </div>
                <Switch 
                  checked={user.notifications.email} 
                  onCheckedChange={() => handleNotificationToggle('email')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                </div>
                <Switch 
                  checked={user.notifications.push} 
                  onCheckedChange={() => handleNotificationToggle('push')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">Receive emails about new features and businesses</p>
                </div>
                <Switch 
                  checked={user.notifications.marketing} 
                  onCheckedChange={() => handleNotificationToggle('marketing')} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Public Profile</h3>
                  <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                </div>
                <Switch 
                  checked={user.privacy.publicProfile} 
                  onCheckedChange={() => handlePrivacyToggle('publicProfile')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Activity Sharing</h3>
                  <p className="text-sm text-muted-foreground">Share your likes and comments with other users</p>
                </div>
                <Switch 
                  checked={user.privacy.shareActivities} 
                  onCheckedChange={() => handlePrivacyToggle('shareActivities')} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UserProfile;
