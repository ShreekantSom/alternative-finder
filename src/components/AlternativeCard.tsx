
import { useState, useRef } from 'react';
import { Heart, Share2, ExternalLink, Tag } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

interface AlternativeCardProps {
  alternative: Alternative;
  index: number;
}

export function AlternativeCard({ alternative, index }: AlternativeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Get appropriate background color for pricing badge
  const getPricingBgColor = (pricing: string) => {
    switch(pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Freemium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Subscription':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 relative group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden h-48 bg-secondary/30">
        <img
          src={alternative.imageUrl}
          alt={alternative.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-500 p-6 ${
            imageLoaded ? 'blur-none' : 'blur-md'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category label */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
            <Tag size={12} />
            {alternative.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{alternative.name}</h3>
          
          <div className="flex items-center space-x-1">
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
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {alternative.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center space-x-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getPricingBgColor(alternative.pricing)}`}>
              {alternative.pricing}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLike}
              className={`p-1.5 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Visit button - appears on hover */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <a 
          href={alternative.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-transform duration-200 transform hover:scale-105"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

export default AlternativeCard;
