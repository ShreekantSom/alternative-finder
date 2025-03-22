
import { useState } from 'react';
import { Alternative } from '@/assets/data';
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
import { Edit, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';

interface SoftwareTableProps {
  software: Alternative[];
  onEdit: (software: Alternative) => void;
  onDelete: (software: Alternative) => void;
}

type SortField = 'name' | 'category' | 'pricing' | 'platform' | 'likes';
type SortDirection = 'asc' | 'desc';

export function SoftwareTable({ software, onEdit, onDelete }: SoftwareTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="inline ml-1 w-4 h-4" /> : 
      <ArrowDown className="inline ml-1 w-4 h-4" />;
  };

  // Filter software based on search term
  const filteredSoftware = searchTerm.trim() === '' 
    ? software 
    : software.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Sort the filtered software
  const sortedSoftware = [...filteredSoftware].sort((a, b) => {
    // Handle different field types
    if (sortField === 'likes') {
      // Numeric sort
      return sortDirection === 'asc' 
        ? a.likes - b.likes 
        : b.likes - a.likes;
    } else if (sortField === 'platform') {
      // Array field (platform) - sort by first platform name
      const aValue = a.platform[0] || '';
      const bValue = b.platform[0] || '';
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // String fields (name, category, pricing)
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  return (
    <>
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('pricing')}>
                Pricing {getSortIcon('pricing')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('platform')}>
                Platforms {getSortIcon('platform')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('likes')}>
                Likes {getSortIcon('likes')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSoftware.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "No software found matching your search." : "No software found. Add one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              sortedSoftware.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.pricing}</TableCell>
                  <TableCell>{item.platform.join(", ")}</TableCell>
                  <TableCell>{item.likes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
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
    </>
  );
}
