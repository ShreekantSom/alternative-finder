
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { z } from "zod";
import { Alternative, Category } from '@/assets/data';
import { softwareService } from '@/lib/softwareService';
import { categoryService } from '@/lib/categoryService';
import { SoftwareTable } from './SoftwareTable';
import { SoftwareFormDialog } from './SoftwareFormDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

// This schema must match the one in SoftwareForm and SoftwareFormDialog
const softwareSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  imageUrl: z.string().url(),
  url: z.string().url(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"]),
  platform: z.array(z.string()).min(1),
});

export function SoftwareManager() {
  const [software, setSoftware] = useState<Alternative[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingSoftware, setEditingSoftware] = useState<Alternative | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Alternative | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSoftware();
    loadCategories();
  }, []);

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

  const handleAddNewSoftware = () => {
    setEditingSoftware(null);
    setIsFormDialogOpen(true);
  };

  const handleEditSoftware = (item: Alternative) => {
    setEditingSoftware(item);
    setIsFormDialogOpen(true);
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

  const handleSubmitForm = async (data: z.infer<typeof softwareSchema>) => {
    try {
      let result;
      if (editingSoftware) {
        result = await softwareService.updateSoftware(editingSoftware.id, {
          ...data,
          likes: editingSoftware.likes,
        });
      } else {
        // Ensure all required fields are provided when creating new software
        const newSoftware: Omit<Alternative, 'id'> = {
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
          url: data.url,
          pricing: data.pricing,
          platform: data.platform,
          likes: 0,
        };
        
        result = await softwareService.createSoftware(newSoftware);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Software ${editingSoftware ? "updated" : "created"} successfully`,
        });
        loadSoftware();
        setIsFormDialogOpen(false);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Software Management</h2>
        <Button onClick={handleAddNewSoftware}>
          <Plus className="w-4 h-4 mr-2" />
          Add Software
        </Button>
      </div>

      <SoftwareTable 
        software={software}
        onEdit={handleEditSoftware}
        onDelete={handleDeleteSoftware}
      />

      <SoftwareFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        editingSoftware={editingSoftware}
        categories={categories}
        onSubmit={handleSubmitForm}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        softwareToDelete={softwareToDelete}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}
