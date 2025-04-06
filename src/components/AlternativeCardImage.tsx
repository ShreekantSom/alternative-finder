
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Store, Tag as TagIcon, Award } from 'lucide-react';
import { Alternative } from '@/assets/data';

interface AlternativeCardImageProps {
  alternative: Alternative;
  isHovered: boolean;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

export function AlternativeCardImage({ 
  alternative, 
  isHovered, 
  imageLoaded, 
  setImageLoaded 
}: AlternativeCardImageProps) {
  return (
    <div className="relative overflow-hidden aspect-video bg-secondary/30">
      <img
        src={alternative.imageUrl}
        alt={alternative.name}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-contain transition-all duration-500 p-6 ${
          imageLoaded ? 'blur-none' : 'blur-md'
        } ${isHovered ? 'scale-105' : 'scale-100'}`}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-3 left-3">
        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
          <TagIcon size={12} />
          {alternative.category}
        </Badge>
      </div>
      
      {alternative.businessType && (
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/80 dark:bg-black/50 flex items-center gap-1 px-2 py-1">
            <Store size={12} />
            {alternative.businessType}
          </Badge>
        </div>
      )}
      
      {alternative.franchise && alternative.franchise.available && (
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="bg-primary/20 text-primary flex items-center gap-1 px-2 py-1">
            <Award size={12} />
            Franchise Available
          </Badge>
        </div>
      )}
    </div>
  );
}

export default AlternativeCardImage;
