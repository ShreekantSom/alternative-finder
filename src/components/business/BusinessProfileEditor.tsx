
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BusinessProfileEditor() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your business profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" defaultValue="https://acme.example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description (150 chars)</Label>
                <Input 
                  id="shortDescription"
                  defaultValue="Enterprise SaaS platform for workflow automation and team collaboration"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea 
                  id="fullDescription"
                  defaultValue="Acme Corporation provides a comprehensive suite of business tools designed to streamline operations, enhance team collaboration, and boost productivity. Our platform integrates with popular third-party services and offers customizable workflows to meet the unique needs of businesses across industries."
                  className="h-32"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="productivityTools">
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="productivityTools">Productivity Tools</SelectItem>
                      <SelectItem value="crm">CRM Software</SelectItem>
                      <SelectItem value="marketing">Marketing Platforms</SelectItem>
                      <SelectItem value="hrSoftware">HR Software</SelectItem>
                      <SelectItem value="financeSoftware">Finance Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select defaultValue="projectManagement">
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projectManagement">Project Management</SelectItem>
                      <SelectItem value="taskManagement">Task Management</SelectItem>
                      <SelectItem value="teamCollaboration">Team Collaboration</SelectItem>
                      <SelectItem value="documentManagement">Document Management</SelectItem>
                      <SelectItem value="workflowAutomation">Workflow Automation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input id="foundedYear" type="number" defaultValue="2010" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="companySize">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">1-50 employees</SelectItem>
                      <SelectItem value="medium">51-200 employees</SelectItem>
                      <SelectItem value="large">201-1000 employees</SelectItem>
                      <SelectItem value="enterprise">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing Model</Label>
                <Select defaultValue="freemium">
                  <SelectTrigger id="pricingModel">
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="onetime">One-time Purchase</SelectItem>
                    <SelectItem value="custom">Custom Pricing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Web', 'iOS', 'Android', 'Windows', 'macOS', 'Linux'].map(platform => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={['Web', 'iOS', 'Android'].includes(platform)} />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSave}>
                {saveStatus === "idle" && "Save Changes"}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved!"}
                {saveStatus === "error" && "Error!"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your business social profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input id="twitter" defaultValue="https://twitter.com/acmecorp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" defaultValue="https://linkedin.com/company/acmecorp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" defaultValue="https://facebook.com/acmecorp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" defaultValue="" />
              </div>
              <Button onClick={handleSave}>Save Social Links</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Highlight your business's key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Feature 1: Task Management</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Create, assign, and track tasks with custom fields, priorities, and deadlines</p>
              </div>
              
              <div className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Feature 2: Team Collaboration</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Real-time communication and collaboration tools including chat, comments, and file sharing</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Feature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="featureName">Feature Name</Label>
                      <Input id="featureName" placeholder="e.g., Workflow Automation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featureDescription">Description</Label>
                      <Textarea id="featureDescription" placeholder="Describe this feature..." className="h-24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featureIcon">Icon (optional)</Label>
                      <Select>
                        <SelectTrigger id="featureIcon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workflow">Workflow</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="integration">Integration</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Add Feature</Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Showcase key team members or founders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <h3 className="font-medium">Jane Smith</h3>
                        <p className="text-sm text-muted-foreground">CEO & Co-Founder</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Team Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="memberName">Name</Label>
                          <Input id="memberName" placeholder="Full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="memberTitle">Title/Position</Label>
                          <Input id="memberTitle" placeholder="e.g., CTO" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberBio">Short Bio</Label>
                        <Textarea id="memberBio" placeholder="Brief biography..." className="h-24" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberPhoto">Photo</Label>
                        <Input id="memberPhoto" type="file" />
                      </div>
                      <Button>Add Team Member</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Verification</CardTitle>
              <CardDescription>
                Verify your business to gain credibility and display a verification badge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800">Verification Required</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Complete the verification process to confirm your business ownership and display a verification badge.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationMethod">Verification Method</Label>
                    <Select defaultValue="domain">
                      <SelectTrigger id="verificationMethod">
                        <SelectValue placeholder="Select verification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domain">Domain Verification</SelectItem>
                        <SelectItem value="document">Business Document</SelectItem>
                        <SelectItem value="phone">Phone Verification</SelectItem>
                        <SelectItem value="social">Social Media Verification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="border border-dashed p-4 rounded-md">
                    <h3 className="font-medium mb-2">Domain Verification Instructions</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add the following TXT record to your domain's DNS settings to verify ownership:
                    </p>
                    <div className="bg-muted p-2 rounded font-mono text-xs break-all">
                      verify-business=acme-12345
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      DNS changes may take up to 48 hours to propagate.
                    </p>
                  </div>
                  
                  <Button>Verify Business</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trust Certificates</CardTitle>
              <CardDescription>
                Display security, quality, or industry certifications your business has obtained
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">ISO 27001 Certified</h3>
                      <p className="text-sm text-muted-foreground">Information Security Management</p>
                    </div>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certificateName">Certificate Name</Label>
                  <Input id="certificateName" placeholder="e.g., SOC 2 Type II" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificateDescription">Description</Label>
                  <Input id="certificateDescription" placeholder="Brief description of certification" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificateFile">Upload Certificate (Optional)</Label>
                  <Input id="certificateFile" type="file" />
                </div>
                
                <Button>Add Certificate</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Access Management</CardTitle>
              <CardDescription>Add and manage access for team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">admin@acmecorp.com</h3>
                      <p className="text-sm text-muted-foreground">Admin (Owner)</p>
                    </div>
                    <div className="text-sm text-muted-foreground">Full Access</div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">marketing@acmecorp.com</h3>
                      <p className="text-sm text-muted-foreground">Marketing Team</p>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="text-sm text-muted-foreground">Limited Access</div>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Team Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamEmail">Email</Label>
                        <Input id="teamEmail" type="email" placeholder="colleague@company.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamRole">Role</Label>
                        <Select defaultValue="editor">
                          <SelectTrigger id="teamRole">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin (Full Access)</SelectItem>
                            <SelectItem value="editor">Editor (Edit Content)</SelectItem>
                            <SelectItem value="analyst">Analyst (View Analytics)</SelectItem>
                            <SelectItem value="support">Support (Reply to Q&A)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button>Add Team Member</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent account activity and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Profile updated", user: "admin@acmecorp.com", time: "Today, 10:23 AM" },
                  { action: "New team member added", user: "admin@acmecorp.com", time: "Yesterday, 3:45 PM" },
                  { action: "Feature listing updated", user: "marketing@acmecorp.com", time: "Dec 2, 2023" },
                  { action: "Business verification completed", user: "admin@acmecorp.com", time: "Nov 28, 2023" }
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">By {activity.user}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Email Notifications</h3>
                  
                  {[
                    { id: "newReviews", label: "New reviews", defaultChecked: true },
                    { id: "newQuestions", label: "New questions", defaultChecked: true },
                    { id: "listingComparisons", label: "Listing comparisons", defaultChecked: true },
                    { id: "wishlistAdditions", label: "Wishlist additions", defaultChecked: false },
                    { id: "profileViews", label: "Profile view summaries", defaultChecked: false },
                    { id: "marketingTips", label: "Marketing tips and platform updates", defaultChecked: true }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg mt-6">Notification Frequency</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notifFrequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="notifFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button>Save Notification Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BusinessProfileEditor;
