
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alternative } from "@/assets/data";

interface BusinessTableProps {
  businesses: Alternative[];
  onEdit: (business: Alternative) => void;
  onDelete: (business: Alternative) => void;
}

export function BusinessTable({ businesses, onEdit, onDelete }: BusinessTableProps) {
  if (!businesses || businesses.length === 0) {
    return <div className="py-24 text-center">
      <p className="text-muted-foreground">No businesses found. Add your first business!</p>
    </div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id}>
              <TableCell className="font-medium">{business.name}</TableCell>
              <TableCell>{business.category}</TableCell>
              <TableCell>{business.pricing}</TableCell>
              <TableCell>{business.platform.join(", ")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(business)}
                  className="mr-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(business)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
