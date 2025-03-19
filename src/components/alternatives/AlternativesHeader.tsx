
import { ReactNode } from 'react';

interface AlternativesHeaderProps {
  title: string;
  description: string;
  filterComponent?: ReactNode;
}

export function AlternativesHeader({ 
  title, 
  description, 
  filterComponent 
}: AlternativesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      {filterComponent}
    </div>
  );
}

export default AlternativesHeader;
