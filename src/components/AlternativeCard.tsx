import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, ExternalLink, Tag, Star, Truck, Store, MapPin, Award } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { FeatureDisplay } from '@/components/service/FeatureDisplay';

interface AlternativeCardProps {
  alternative: Alternative;
  index: number;
}

export function AlternativeCard({ alternative, index }: AlternativeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${alternative.name} ${isLiked ? "removed from" : "added to"} your favorites`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const serviceUrl = `${window.location.origin}/service/${alternative.id}`;
    navigator.clipboard.writeText(serviceUrl);
    
    toast({
      title: "Link copied",
      description: `Link to ${alternative.name} copied to clipboard`,
    });
  };

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
      case 'Open Source':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/service/${alternative.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 group">
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
                <Tag size={12} />
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
            
            {alternative.franchise?.available && (
              <div className="absolute bottom-3 right-3">
                <Badge variant="outline" className="bg-primary/20 text-primary flex items-center gap-1 px-2 py-1">
                  <Award size={12} />
                  Franchise Available
                </Badge>
              </div>
            )}
          </div>

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
          
          <CardContent className="pt-4">
            <CardDescription className="line-clamp-2 min-h-[40px]">
              {alternative.description}
            </CardDescription>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 text-amber-500 mr-1" />
                <span className="font-medium">{alternative.likes.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">likes</span>
              </div>
              
              {alternative.deliveryOptions?.includes('Home Delivery') && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                  <Truck className="w-3 h-3" />
                  Delivery
                </Badge>
              )}
            </div>
            
            {Array.isArray(alternative.features) && alternative.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {alternative.features.slice(0, 2).map((feature, i) => (
                  <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    <FeatureDisplay feature={feature} />
                  </span>
                ))}
                {alternative.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{alternative.features.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
            <span className={`text-xs px-2 py-1 rounded-full ${getPricingBgColor(alternative.pricing)}`}>
              {alternative.pricing}
            </span>
            
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
                onClick={handleShare}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

export default AlternativeCard;
