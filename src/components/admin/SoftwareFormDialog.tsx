
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SoftwareForm } from "./SoftwareForm";
import { Alternative, Category } from '@/assets/data';
import { z } from "zod";

// This schema must match the one in SoftwareForm
const softwareSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  imageUrl: z.string().url(),
  url: z.string().url(),
  pricing: z.enum(["Free", "Freemium", "Paid", "Subscription", "Open Source"]),
  platform: z.array(z.string()).min(1),
});

interface SoftwareFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSoftware: Alternative | null;
  categories: Category[];
  onSubmit: (data: z.infer<typeof softwareSchema>) => Promise<void>;
}

export function SoftwareFormDialog({
  isOpen,
  onOpenChange,
  editingSoftware,
  categories,
  onSubmit,
}: SoftwareFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingSoftware ? "Edit Software" : "Add New Software"}</DialogTitle>
          <DialogDescription>
            {editingSoftware 
              ? "Update the details of this software." 
              : "Fill in the details for the new software."}
          </DialogDescription>
        </DialogHeader>
        <SoftwareForm 
          editingSoftware={editingSoftware} 
          categories={categories}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
