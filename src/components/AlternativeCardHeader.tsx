
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Alternative } from '@/assets/data';

interface AlternativeCardHeaderProps {
  alternative: Alternative;
}

export function AlternativeCardHeader({ alternative }: AlternativeCardHeaderProps) {
  return (
    <CardHeader className="pb-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">{alternative.name}</CardTitle>
      </div>
      <div className="flex items-center mt-1 space-x-1">
        {alternative.platform.slice(0, 3).map((platform, i) => (
          <span key={i} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
            {platform === 'iOS' ? 'iOS' : 
             platform === 'Android' ? 'And' : 
             platform === 'Web' ? 'Web' : 
             platform === 'Desktop' ? 'Dsk' :
             platform === 'Smart TVs' ? 'TV' : 
             platform}
          </span>
        ))}
        {alternative.platform.length > 3 && (
          <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
            +{alternative.platform.length - 3}
          </span>
        )}
      </div>
    </CardHeader>
  );
}

export default AlternativeCardHeader;
