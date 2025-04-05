
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from '@/assets/data';
import { categoryService } from '@/lib/categoryService';
import { CategoryDialog } from './category/CategoryDialog';
import { CategoryDeleteDialog } from './category/CategoryDeleteDialog';
import { CategoryTable } from './category/CategoryTable';

const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  icon: z.string().min(1, { message: "Please select an icon." }),
});

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        icon: editingCategory.icon,
      });
    } else {
      form.reset({
        name: "",
        icon: "",
      });
    }
  }, [editingCategory, form]);

  const loadCategories = async () => {
    const result = await categoryService.getAllCategories();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    const result = await categoryService.deleteCategory(categoryToDelete.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadCategories();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete category",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      let result;
      if (editingCategory) {
        result = await categoryService.updateCategory(editingCategory.id, {
          name: data.name,
          icon: data.icon,
          count: editingCategory.count,
        });
      } else {
        result = await categoryService.createCategory({
          name: data.name,
          icon: data.icon,
          count: 0,
        });
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Category ${editingCategory ? "updated" : "created"} successfully`,
        });
        loadCategories();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${editingCategory ? "update" : "create"} category`,
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

  const availableIcons = [
    { value: "layers", label: "All Categories" },
    { value: "briefcase", label: "Business & Finance" },
    { value: "message-circle", label: "Communication" },
    { value: "code", label: "Development" },
    { value: "graduation-cap", label: "Education & Reference" },
    { value: "gamepad-2", label: "Games & Entertainment" },
    { value: "landmark", label: "Home & Lifestyle" },
    { value: "image", label: "Multimedia" },
    { value: "music", label: "Music & Audio" },
    { value: "globe", label: "Network & Internet" },
    { value: "briefcase", label: "Productivity" },
    { value: "shield", label: "Security & Privacy" },
    { value: "wrench", label: "System & Utilities" },
    { value: "paintbrush", label: "Design & Photo" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={handleAddNewCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Software Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No categories found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category)}>
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

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Update the details of this category." 
                : "Fill in the details for the new category."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Create Category"}
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
              Are you sure you want to delete the category "{categoryToDelete?.name}"? 
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
