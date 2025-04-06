
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { z } from "zod";
import { Alternative, Category } from '@/assets/data';
import { businessService } from '@/lib/businessService';
import { categoryService } from '@/lib/categoryService';
import { BusinessTable } from './BusinessTable';
import { BusinessFormDialog } from './BusinessFormDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

// This schema must match the one in BusinessForm and BusinessFormDialog
const businessSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  imageUrl: z.string().url(),
  url: z.string().url(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"]),
  platform: z.array(z.string()).min(1),
});

export function BusinessManager() {
  const [businesses, setBusinesses] = useState<Alternative[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Alternative | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Alternative | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBusinesses();
    loadCategories();
  }, []);

  const loadBusinesses = async () => {
    const result = await businessService.getAllBusinesses();
    if (result.success) {
      setBusinesses(result.data);
    }
  };

  const loadCategories = async () => {
    const result = await categoryService.getAllCategories();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const handleAddNewBusiness = () => {
    setEditingBusiness(null);
    setIsFormDialogOpen(true);
  };

  const handleEditBusiness = (item: Alternative) => {
    setEditingBusiness(item);
    setIsFormDialogOpen(true);
  };

  const handleDeleteBusiness = (item: Alternative) => {
    setBusinessToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!businessToDelete) return;

    const result = await businessService.deleteBusiness(businessToDelete.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      loadBusinesses();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete business",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  const handleSubmitForm = async (data: z.infer<typeof businessSchema>) => {
    try {
      let result;
      if (editingBusiness) {
        result = await businessService.updateBusiness(editingBusiness.id, {
          ...data,
          likes: editingBusiness.likes,
        });
      } else {
        // Ensure all required fields are provided when creating new business
        const newBusiness: Omit<Alternative, 'id'> = {
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
          url: data.url,
          pricing: data.pricing,
          platform: data.platform,
          likes: 0,
        };
        
        result = await businessService.createBusiness(newBusiness);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Business ${editingBusiness ? "updated" : "created"} successfully`,
        });
        loadBusinesses();
        setIsFormDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${editingBusiness ? "update" : "create"} business`,
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Business Management</h2>
        <Button onClick={handleAddNewBusiness}>
          <Plus className="w-4 h-4 mr-2" />
          Add Business
        </Button>
      </div>

      <BusinessTable 
        businesses={businesses}
        onEdit={handleEditBusiness}
        onDelete={handleDeleteBusiness}
      />

      <BusinessFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        editingBusiness={editingBusiness}
        categories={categories}
        onSubmit={handleSubmitForm}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        businessToDelete={businessToDelete}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}

export default BusinessManager;
