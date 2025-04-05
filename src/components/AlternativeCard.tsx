
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Alternative } from '@/assets/data';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { AlternativeCardImage } from './AlternativeCardImage';
import { AlternativeCardHeader } from './AlternativeCardHeader';
import { AlternativeCardContent } from './AlternativeCardContent';
import { AlternativeCardFooter } from './AlternativeCardFooter';

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
    
    const serviceUrl = `${window.location.origin}/business/${alternative.id}`;
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
      <Link to={`/business/${alternative.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 group">
          <AlternativeCardImage 
            alternative={alternative} 
            isHovered={isHovered} 
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
          />
          <AlternativeCardHeader alternative={alternative} />
          <AlternativeCardContent alternative={alternative} />
          <AlternativeCardFooter 
            alternative={alternative} 
            isLiked={isLiked}
            onLike={handleLike}
            onShare={handleShare}
          />
        </Card>
      </Link>
    </motion.div>
  );
}

export default AlternativeCard;
