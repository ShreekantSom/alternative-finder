
import { Alternative } from '@/assets/data';
import { Link, useNavigate } from 'react-router-dom';
import AlternativeCard from '@/components/AlternativeCard';

interface AlternativesGridProps {
  alternatives: Alternative[];
  onBusinessClick?: (businessId: string) => void;
}

export function AlternativesGrid({ alternatives, onBusinessClick }: AlternativesGridProps) {
  const navigate = useNavigate();
  
  const handleClick = (businessId: string) => {
    if (onBusinessClick) {
      onBusinessClick(businessId);
    } else {
      navigate(`/business/${businessId}`);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {alternatives.length === 0 ? (
        <div className="col-span-full py-16 text-center">
          <p className="text-muted-foreground">No alternatives found matching your criteria.</p>
        </div>
      ) : (
        alternatives.map((alternative) => (
          <div 
            key={alternative.id} 
            className="cursor-pointer" 
            onClick={() => handleClick(alternative.id)}
          >
            <AlternativeCard alternative={alternative} />
          </div>
        ))
      )}
    </div>
  );
}

export default AlternativesGrid;
