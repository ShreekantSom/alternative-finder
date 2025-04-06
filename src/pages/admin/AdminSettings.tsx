
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function AdminSettings() {
  const { toast } = useToast();
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Discover Businesses',
    siteDescription: 'Find the best businesses across various categories',
    logoUrl: '/logo.png',
    primaryColor: '#0091ff',
    allowRegistrations: true,
    requireEmailVerification: true,
    maxFeaturedBusinesses: 5,
    defaultPagination: 20
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'noreply@example.com',
    smtpPassword: '••••••••••••',
    senderName: 'Discover Businesses',
    senderEmail: 'noreply@example.com',
    emailFooterText: 'Copyright © 2023 Discover Businesses. All rights reserved.'
  });

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSiteSettings({
      ...siteSettings,
      [e.target.name]: e.target.name === 'allowRegistrations' || e.target.name === 'requireEmailVerification' 
        ? e.target.checked 
        : e.target.value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSiteSettings({
      ...siteSettings,
      [name]: checked
    });
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailSettings({
      ...emailSettings,
      [e.target.name]: e.target.value
    });
  };

  const saveSettings = () => {
    // In a real app, we would save to the database/API
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the general settings for your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      name="siteName" 
                      value={siteSettings.siteName} 
                      onChange={handleSiteSettingsChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      name="logoUrl" 
                      value={siteSettings.logoUrl} 
                      onChange={handleSiteSettingsChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea 
                    id="siteDescription" 
                    name="siteDescription" 
                    value={siteSettings.siteDescription} 
                    onChange={handleSiteSettingsChange} 
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="primaryColor" 
                        name="primaryColor" 
                        type="text"
                        value={siteSettings.primaryColor} 
                        onChange={handleSiteSettingsChange} 
                      />
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.primaryColor }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultPagination">Default Pagination</Label>
                    <Select 
                      value={siteSettings.defaultPagination.toString()}
                      onValueChange={(value) => 
                        setSiteSettings({
                          ...siteSettings,
                          defaultPagination: parseInt(value)
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pagination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 items per page</SelectItem>
                        <SelectItem value="20">20 items per page</SelectItem>
                        <SelectItem value="50">50 items per page</SelectItem>
                        <SelectItem value="100">100 items per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowRegistrations">Allow User Registrations</Label>
                    <Switch 
                      id="allowRegistrations" 
                      checked={siteSettings.allowRegistrations}
                      onCheckedChange={(checked) => handleSwitchChange('allowRegistrations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <Switch 
                      id="requireEmailVerification" 
                      checked={siteSettings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSwitchChange('requireEmailVerification', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxFeaturedBusinesses">Max Featured Businesses</Label>
                    <Input 
                      id="maxFeaturedBusinesses" 
                      name="maxFeaturedBusinesses" 
                      type="number"
                      value={siteSettings.maxFeaturedBusinesses.toString()} 
                      onChange={handleSiteSettingsChange} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure email server settings and templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input 
                      id="smtpServer" 
                      name="smtpServer" 
                      value={emailSettings.smtpServer} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input 
                      id="smtpPort" 
                      name="smtpPort" 
                      type="number"
                      value={emailSettings.smtpPort.toString()} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input 
                      id="smtpUsername" 
                      name="smtpUsername" 
                      value={emailSettings.smtpUsername} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input 
                      id="smtpPassword" 
                      name="smtpPassword" 
                      type="password"
                      value={emailSettings.smtpPassword} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input 
                      id="senderName" 
                      name="senderName" 
                      value={emailSettings.senderName} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input 
                      id="senderEmail" 
                      name="senderEmail" 
                      value={emailSettings.senderEmail} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailFooterText">Email Footer Text</Label>
                  <Textarea 
                    id="emailFooterText" 
                    name="emailFooterText" 
                    value={emailSettings.emailFooterText} 
                    onChange={handleEmailSettingsChange} 
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Manage your data backups and restoration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="font-medium mb-2">Automated Backups</div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Schedule automatic backups of your data
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="retentionDays">Retention Period (days)</Label>
                      <Input id="retentionDays" type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Manual Backup</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Create an immediate backup of your data
                  </div>
                  <Button>Create Backup Now</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Restore from Backup</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Upload a previous backup file to restore your data
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="file" />
                    <Button variant="outline">Upload & Restore</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2 text-destructive">Danger Zone</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Reset your database to its initial state. This action cannot be undone.
                  </div>
                  <Button variant="destructive">Reset Database</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
