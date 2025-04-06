
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { businessService } from '@/lib/businessService';
import { useToast } from '@/components/ui/use-toast';
import { Alternative } from '@/assets/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Star, Check, X, Plus, Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AdminBusinessManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Alternative[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Alternative | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setIsLoading(true);
        const result = await businessService.getAllBusinesses();
        if (result.success) {
          setBusinesses(result.data);
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load businesses',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, [toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (business: Alternative) => {
    setBusinessToDelete(business);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!businessToDelete) return;
    
    try {
      const result = await businessService.deleteBusiness(businessToDelete.id);
      if (result.success) {
        setBusinesses(businesses.filter(b => b.id !== businessToDelete.id));
        toast({
          title: 'Success',
          description: 'Business deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete business',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
    
    setIsDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Business Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Business
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
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
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Likes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{business.category}</TableCell>
                    <TableCell>{business.pricing}</TableCell>
                    <TableCell className="text-center">
                      {/* This is just a placeholder, in a real app we would update this value */}
                      {Math.random() > 0.5 ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-center">{business.likes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(business)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No businesses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {businessToDelete?.name}? This action cannot be undone.
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
    </AdminLayout>
  );
}

export default AdminBusinessManagement;
