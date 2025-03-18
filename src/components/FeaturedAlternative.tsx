
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, ThumbsUp, Award, BarChart } from 'lucide-react';
import { featuredAlternative } from '@/assets/data';

export function FeaturedAlternative() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={variants}
          className="flex flex-col md:flex-row gap-10 lg:gap-16 items-center"
        >
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              Featured Alternative
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              {featuredAlternative.name}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              {featuredAlternative.description}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Category</span>
                </div>
                <span className="text-muted-foreground text-sm">{featuredAlternative.category}</span>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <ThumbsUp className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Likes</span>
                </div>
                <span className="text-muted-foreground text-sm">{featuredAlternative.likes.toLocaleString()}</span>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Pricing</span>
                </div>
                <span className="text-muted-foreground text-sm">{featuredAlternative.pricing}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <a 
                href={featuredAlternative.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <button className="bg-secondary hover:bg-secondary/70 px-5 py-3 rounded-lg font-medium transition-colors duration-200">
                See Alternatives
              </button>
            </div>
          </div>
          
          {/* Right image */}
          <div className="w-full md:w-1/2 lg:w-2/5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-secondary/30">
              <img
                src={featuredAlternative.imageUrl}
                alt={featuredAlternative.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-contain transition-all duration-700 p-8 ${
                  imageLoaded ? 'blur-none scale-100' : 'blur-md scale-95'
                }`}
              />
              
              {/* Decorative elements */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/5 to-transparent rounded-2xl -z-10" />
              
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 rounded-2xl -z-20 animate-pulse" style={{ animationDuration: '3s' }} />
              
              <div className="absolute top-0 right-0 bg-white dark:bg-gray-900 px-3 py-1 rounded-bl-xl text-xs font-medium">
                {featuredAlternative.platform.join(', ')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedAlternative;
