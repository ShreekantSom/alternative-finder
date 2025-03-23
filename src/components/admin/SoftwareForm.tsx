
import { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Alternative, Category } from '@/assets/data';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const softwareSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"], {
    required_error: "Please select a pricing model.",
  }),
  platform: z.array(z.string()).min(1, { message: "Select at least one platform." }),
  availablePincodes: z.array(z.string()).optional(),
});

interface SoftwareFormProps {
  editingSoftware: Alternative | null;
  categories: Category[];
  onSubmit: (data: z.infer<typeof softwareSchema>) => Promise<void>;
}

export function SoftwareForm({ editingSoftware, categories, onSubmit }: SoftwareFormProps) {
  const [newPincode, setNewPincode] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);

  const form = useForm<z.infer<typeof softwareSchema>>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      url: "",
      pricing: "Free",
      platform: [],
      availablePincodes: [],
    },
  });

  useEffect(() => {
    if (editingSoftware) {
      form.reset({
        name: editingSoftware.name,
        description: editingSoftware.description,
        category: editingSoftware.category,
        imageUrl: editingSoftware.imageUrl,
        url: editingSoftware.url,
        pricing: editingSoftware.pricing,
        platform: editingSoftware.platform,
        availablePincodes: editingSoftware.availablePincodes || [],
      });
      
      // Set pincodes for the UI
      setPincodes(editingSoftware.availablePincodes || []);
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        url: "",
        pricing: "Free",
        platform: [],
        availablePincodes: [],
      });
      setPincodes([]);
    }
  }, [editingSoftware, form]);

  const platforms = [
    { id: "windows", label: "Windows" },
    { id: "macos", label: "macOS" },
    { id: "linux", label: "Linux" },
    { id: "android", label: "Android" },
    { id: "ios", label: "iOS" },
    { id: "web", label: "Web" },
  ];

  const addPincode = () => {
    // Validate pincode format (6 digits for Indian pincodes)
    if (/^\d{6}$/.test(newPincode) && !pincodes.includes(newPincode)) {
      const updatedPincodes = [...pincodes, newPincode];
      setPincodes(updatedPincodes);
      form.setValue('availablePincodes', updatedPincodes);
      setNewPincode('');
    }
  };

  const removePincode = (pincode: string) => {
    const updatedPincodes = pincodes.filter(p => p !== pincode);
    setPincodes(updatedPincodes);
    form.setValue('availablePincodes', updatedPincodes);
  };

  const handlePincodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPincode();
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof softwareSchema>) => {
    // Ensure pincodes are included in the form data
    const formData = {
      ...data,
      availablePincodes: pincodes
    };
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Software name" {...field} />
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
                <FormControl>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Software description" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Model</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Open Source">Open Source</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Available Pincodes Field */}
        <FormField
          control={form.control}
          name="availablePincodes"
          render={() => (
            <FormItem>
              <FormLabel>Available Pincodes</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    onKeyPress={handlePincodeKeyPress}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addPincode}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {pincodes.map((pincode) => (
                  <Badge 
                    key={pincode} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {pincode}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removePincode(pincode)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Add pincodes where this service is available
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel>Platforms</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <FormField
                    key={platform.id}
                    control={form.control}
                    name="platform"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={platform.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(platform.label)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, platform.label])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== platform.label
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {platform.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">
            {editingSoftware ? "Update Software" : "Create Software"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
