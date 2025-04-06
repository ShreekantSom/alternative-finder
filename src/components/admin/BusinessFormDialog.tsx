
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alternative, Category } from "@/assets/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// This schema must match the one in BusinessManager
const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Please enter a valid URL"),
  url: z.string().url("Please enter a valid URL"),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"]),
  platform: z.array(z.string()).min(1, "At least one platform is required"),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

// Available platforms for the checkboxes
const availablePlatforms = ["Web", "iOS", "Android", "Windows", "macOS", "Linux", "Smart TV"];

interface BusinessFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingBusiness: Alternative | null;
  categories: Category[];
  onSubmit: (data: BusinessFormValues) => void;
}

export function BusinessFormDialog({
  isOpen,
  onOpenChange,
  editingBusiness,
  categories,
  onSubmit,
}: BusinessFormDialogProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      url: "",
      pricing: "Freemium",
      platform: [],
    },
  });

  useEffect(() => {
    if (editingBusiness) {
      form.reset({
        name: editingBusiness.name,
        description: editingBusiness.description,
        category: editingBusiness.category,
        imageUrl: editingBusiness.imageUrl,
        url: editingBusiness.url,
        pricing: editingBusiness.pricing,
        platform: editingBusiness.platform,
      });
      setSelectedPlatforms(editingBusiness.platform);
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        url: "",
        pricing: "Freemium",
        platform: ["Web"],
      });
      setSelectedPlatforms(["Web"]);
    }
  }, [editingBusiness, form, isOpen]);

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms((prev) => [...prev, platform]);
      form.setValue("platform", [...selectedPlatforms, platform]);
    } else {
      const filtered = selectedPlatforms.filter((p) => p !== platform);
      setSelectedPlatforms(filtered);
      form.setValue("platform", filtered);
    }
    form.trigger("platform");
  };

  const handleSubmit = (data: BusinessFormValues) => {
    onSubmit({
      ...data,
      platform: selectedPlatforms,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingBusiness ? "Edit" : "Add"} Business
          </DialogTitle>
          <DialogDescription>
            {editingBusiness
              ? "Update the business details below"
              : "Fill in the business details below to add it to the directory"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Business name" {...field} />
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
                      placeholder="Description"
                      className="resize-none"
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
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
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
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

            <FormField
              control={form.control}
              name="platform"
              render={() => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePlatforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) =>
                            handlePlatformChange(platform, checked === true)
                          }
                        />
                        <label
                          htmlFor={`platform-${platform}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.platform && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.platform.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {editingBusiness ? "Update" : "Add"} Business
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
