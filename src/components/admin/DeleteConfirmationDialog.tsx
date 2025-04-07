
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alternative } from "@/assets/data";

export interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  businessToDelete?: Alternative; // For business deletion
  softwareToDelete?: Alternative; // Add this for software deletion
  onConfirmDelete: () => Promise<void>;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  businessToDelete,
  softwareToDelete,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  // Use either businessToDelete or softwareToDelete, prioritizing businessToDelete
  const itemToDelete = businessToDelete || softwareToDelete;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete{" "}
            {itemToDelete ? (
              <span className="font-semibold">{itemToDelete.name}</span>
            ) : (
              "this item"
            )}{" "}
            from the database. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await onConfirmDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfirmationDialog;
