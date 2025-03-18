
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from '@/lib/auth';

const profileSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  confirmPassword: z.string().optional(),
}).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(data => !data.newPassword || data.currentPassword, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
});

export function Profile() {
  const [user, setUser] = useState<{id: string, email: string, role: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Redirect if not logged in
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    setUser(currentUser);
    form.setValue("email", currentUser.email);
  }, [navigate, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    // This is a mock implementation since we don't have a real backend
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved.",
    });
    
    setIsLoading(false);
  };

  if (!user) {
    return null; // Or loading spinner
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details and password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving changes..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Type</CardTitle>
            <CardDescription>Your current account permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account Role</p>
                <p className="text-muted-foreground">
                  {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                </p>
              </div>
              <div className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-sm">
                {user.role === 'admin' ? 'Full Access' : 'Limited Access'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  AuthService.logout();
                  navigate('/');
                }
              }}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
