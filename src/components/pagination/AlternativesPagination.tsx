
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface AlternativesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AlternativesPagination({
  currentPage,
  totalPages,
  onPageChange
}: AlternativesPaginationProps) {
  // Only render if we have more than one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12">
      <Pagination>
        <PaginationContent>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default AlternativesPagination;
