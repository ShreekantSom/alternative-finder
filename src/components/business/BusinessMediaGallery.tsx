
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Upload, Edit } from "lucide-react";

export function BusinessMediaGallery() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Gallery</CardTitle>
          <CardDescription>Manage visual assets for your business listing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logos">
            <TabsList className="mb-4">
              <TabsTrigger value="logos">Logos</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="banners">Banner Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logos" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <img src="/images/doordash.png" alt="Primary Logo" className="max-w-full max-h-full" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Primary Logo</p>
                        <p className="text-xs text-muted-foreground">250 × 250px</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Replace</Button>
                        <Button size="sm" variant="destructive">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Upload Alternative Logo</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Upload</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="screenshots" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={`/images/screenshot${i}.jpg`} 
                            alt={`Screenshot ${i}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback for missing images
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/400x225/e9e9e9/999999?text=Screenshot";
                            }} 
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Dashboard View</p>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="aspect-video border-2 border-dashed rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Upload Screenshot</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Add Screenshot</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Screenshot Details</CardTitle>
                    <CardDescription>Add details to help users understand your screenshots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="screenshotCaption">Caption</Label>
                        <Input id="screenshotCaption" placeholder="e.g., Main dashboard interface" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="screenshotDescription">Description (Optional)</Label>
                        <Input id="screenshotDescription" placeholder="Brief description of what's shown" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="screenshotFile">Screenshot File</Label>
                        <Input id="screenshotFile" type="file" accept="image/*" />
                      </div>
                      <Button>Upload Screenshot</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="banners" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="aspect-[3/1] bg-gray-100 rounded overflow-hidden">
                      <img 
                        src="/images/banner.jpg" 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback for missing images
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/1200x400/e9e9e9/999999?text=Banner+Image";
                        }} 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Profile Banner</p>
                        <p className="text-xs text-muted-foreground">Recommended size: 1200 × 400px</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Replace</Button>
                        <Button variant="destructive" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Banner</CardTitle>
                  <CardDescription>Add a banner image to showcase your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bannerType">Banner Type</Label>
                      <select className="w-full border rounded-md p-2">
                        <option>Profile Header</option>
                        <option>Featured Promotion</option>
                        <option>Category Banner</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerFile">Banner Image</Label>
                      <Input id="bannerFile" type="file" accept="image/*" />
                    </div>
                    <Button>Upload Banner</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Demo Videos</CardTitle>
                  <CardDescription>Add videos to showcase your product features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="aspect-video md:w-1/3 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">Video Thumbnail</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Product Overview</h3>
                          <p className="text-sm text-muted-foreground">A quick tour of the main features</p>
                          <p className="text-xs text-muted-foreground mt-1">YouTube Link</p>
                          <div className="flex space-x-2 mt-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Remove</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Add Video</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="videoTitle">Video Title</Label>
                            <Input id="videoTitle" placeholder="e.g., Product Demo" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="videoDescription">Description</Label>
                            <Input id="videoDescription" placeholder="Brief description of the video" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="videoType">Video Source</Label>
                            <select className="w-full border rounded-md p-2">
                              <option>YouTube Link</option>
                              <option>Vimeo Link</option>
                              <option>Upload MP4</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input id="videoUrl" placeholder="e.g., https://youtube.com/watch?v=..." />
                          </div>
                          <Button>Add Video</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default BusinessMediaGallery;
