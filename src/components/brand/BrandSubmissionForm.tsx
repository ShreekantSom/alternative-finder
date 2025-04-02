
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AuthService } from "@/lib/auth";
import { categoryService } from "@/lib/categoryService";

const brandSubmissionSchema = z.object({
  name: z.string().min(2, { message: "Brand name must be at least 2 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL" }),
  logoUrl: z.string().url({ message: "Please enter a valid logo URL" }).optional().or(z.literal('')),
  tags: z.string().optional(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"]),
});

type BrandSubmissionFormData = z.infer<typeof brandSubmissionSchema>;

interface BrandSubmissionFormProps {
  isSuggestion?: boolean;
}

export default function BrandSubmissionForm({ isSuggestion = false }: BrandSubmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  // Load categories when component mounts
  useState(() => {
    async function loadCategories() {
      const result = await categoryService.getAllCategories();
      if (result.success) {
        setCategories(result.data);
      }
    }
    loadCategories();
  });

  const form = useForm<BrandSubmissionFormData>({
    resolver: zodResolver(brandSubmissionSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      websiteUrl: "",
      logoUrl: "",
      tags: "",
      pricing: "Free",
    },
  });

  const onSubmit = async (data: BrandSubmissionFormData) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a brand",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      // Process tags from comma-separated string to array
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];

      const submissionData = {
        ...data,
        tags: tagsArray,
        userId: currentUser.id,
        userRole: currentUser.role,
        brandId: currentUser.role === 'brand' ? currentUser.brandId : undefined,
        brandName: currentUser.role === 'brand' ? currentUser.brandName : undefined,
      };

      let result;
      if (isSuggestion) {
        // User suggesting a brand
        result = await AuthService.submitBrandSuggestion(submissionData, currentUser.id);
      } else {
        // Brand owner submitting their brand
        result = await AuthService.submitBrandForApproval(submissionData);
      }

      if (result.success) {
        toast({
          title: "Submission successful",
          description: isSuggestion 
            ? "Your brand suggestion has been submitted for review" 
            : "Your brand has been submitted for review",
        });
        form.reset();
        
        // Redirect after brief delay
        setTimeout(() => {
          navigate(currentUser.role === 'brand' ? '/brand-dashboard' : '/dashboard');
        }, 2000);
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "Failed to submit brand",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isSuggestion ? "Suggest a Brand" : "Submit Your Brand for Approval"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this brand offers"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e-commerce, marketing, analytics" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma separated tags to help users find this brand
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Freemium">Freemium</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Open Source">Open Source</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit for Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
