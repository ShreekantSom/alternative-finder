
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alternative, Category } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { categoryService } from '@/lib/categoryService';

const softwareSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"], {
    required_error: "Please select a pricing model.",
  }),
  platform: z.array(z.string()).min(1, { message: "Select at least one platform." }),
});

export function SoftwareManager() {
  const [software, setSoftware] = useState<Alternative[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingSoftware, setEditingSoftware] = useState<Alternative | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Alternative | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
    },
  });

  useEffect(() => {
    loadSoftware();
    loadCategories();
  }, []);

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
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        url: "",
        pricing: "Free",
        platform: [],
      });
    }
  }, [editingSoftware, form]);

  const loadSoftware = async () => {
    const result = await softwareService.getAllSoftware();
    if (result.success) {
      setSoftware(result.data);
    }
  };

  const loadCategories = async () => {
    const result = await categoryService.getAllCategories();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const filteredSoftware = searchTerm.trim() === '' 
    ? software 
    : software.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleAddNewSoftware = () => {
    setEditingSoftware(null);
    setIsDialogOpen(true);
  };

  const handleEditSoftware = (item: Alternative) => {
    setEditingSoftware(item);
    setIsDialogOpen(true);
  };

  const handleDeleteSoftware = (item: Alternative) => {
    setSoftwareToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!softwareToDelete) return;

    const result = await softwareService.deleteSoftware(softwareToDelete.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Software deleted successfully",
      });
      loadSoftware();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete software",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setSoftwareToDelete(null);
  };

  const onSubmit = async (data: z.infer<typeof softwareSchema>) => {
    try {
      let result;
      if (editingSoftware) {
        result = await softwareService.updateSoftware(editingSoftware.id, {
          ...data,
          id: editingSoftware.id,
          likes: editingSoftware.likes,
        });
      } else {
        result = await softwareService.createSoftware({
          ...data,
          id: `new-${Date.now()}`,
          likes: 0,
        });
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Software ${editingSoftware ? "updated" : "created"} successfully`,
        });
        loadSoftware();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${editingSoftware ? "update" : "create"} software`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const platforms = [
    { id: "windows", label: "Windows" },
    { id: "macos", label: "macOS" },
    { id: "linux", label: "Linux" },
    { id: "android", label: "Android" },
    { id: "ios", label: "iOS" },
    { id: "web", label: "Web" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Software Management</h2>
        <Button onClick={handleAddNewSoftware}>
          <Plus className="w-4 h-4 mr-2" />
          Add Software
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search software" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSoftware.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "No software found matching your search." : "No software found. Add one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredSoftware.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.pricing}</TableCell>
                  <TableCell>{item.platform.join(", ")}</TableCell>
                  <TableCell>{item.likes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditSoftware(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSoftware(item)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Software Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSoftware ? "Edit Software" : "Add New Software"}</DialogTitle>
            <DialogDescription>
              {editingSoftware 
                ? "Update the details of this software." 
                : "Fill in the details for the new software."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <SelectItem value="Open Source">Open Source</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the software "{softwareToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
