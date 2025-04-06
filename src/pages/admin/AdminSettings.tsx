
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';

export function AdminSettings() {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Alternative Finder',
    siteDescription: 'Find the best alternatives to popular business services',
    contactEmail: 'admin@example.com',
    featuredBusinessesCount: 4,
    enableUserRegistration: true,
    enableBusinessSubmissions: true
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setGeneralSettings({
      ...generalSettings,
      [name]: checked
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage basic site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featuredBusinessesCount">Featured Businesses Count</Label>
                  <Input
                    id="featuredBusinessesCount"
                    name="featuredBusinessesCount"
                    type="number"
                    value={generalSettings.featuredBusinessesCount.toString()}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableUserRegistration"
                    checked={generalSettings.enableUserRegistration}
                    onCheckedChange={(checked) => handleSwitchChange('enableUserRegistration', checked)}
                  />
                  <Label htmlFor="enableUserRegistration">Enable User Registration</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableBusinessSubmissions"
                    checked={generalSettings.enableBusinessSubmissions}
                    onCheckedChange={(checked) => handleSwitchChange('enableBusinessSubmissions', checked)}
                  />
                  <Label htmlFor="enableBusinessSubmissions">Enable Business Submissions</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the site looks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Appearance settings will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Security settings will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>Manage system backups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backup functionality will be implemented in a future update.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Create Backup</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
