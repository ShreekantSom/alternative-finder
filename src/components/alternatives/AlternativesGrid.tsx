
import { motion } from 'framer-motion';
import AlternativeCard from '@/components/AlternativeCard';
import { Alternative } from '@/assets/data';

interface AlternativesGridProps {
  alternatives: Alternative[];
}

export function AlternativesGrid({ alternatives }: AlternativesGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (alternatives.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No alternatives found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to find more results</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {alternatives.map((alternative, index) => (
        <AlternativeCard 
          key={`${alternative.id}-${index}`} 
          alternative={alternative} 
          index={index}
        />
      ))}
    </motion.div>
  );
}

export default AlternativesGrid;
