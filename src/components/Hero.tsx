
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Alternative } from '@/assets/data';

interface HeroProps {
  onSearch: (results: Alternative[]) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePopularSearch = (software: string) => {
    // Simulate clicking on popular software by executing a search
    const formElement = document.querySelector('form');
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    
    if (inputElement && formElement) {
      inputElement.value = software;
      // Update the input value to trigger the change event
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
      
      // Trigger the form submission after a small delay to allow for value change
      setTimeout(() => {
        const submitEvent = new Event('submit', { cancelable: true });
        formElement.dispatchEvent(submitEvent);
      }, 100);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black opacity-50 z-0"></div>
      
      {/* Content container */}
      <div className="container max-w-5xl mx-auto text-center z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
            Find better software alternatives
          </span>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Discover the perfect 
          <span className="relative">
            <span className="relative z-10"> alternative</span>
            <svg 
              className="absolute bottom-0 left-0 w-full h-3 md:h-4 text-primary/20 z-0" 
              viewBox="0 0 200 20" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0 C50,20 150,20 200,0 L200,20 L0,20 Z" 
                fill="currentColor"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Tired of your current software? We've curated thousands of alternatives 
          to help you find the perfect replacement for any application.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto mb-6"
        >
          <SearchBar onSearch={onSearch} />
        </motion.div>

        {/* Popular Software - Below search bar */}
        <motion.div 
          className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span>Popular:</span>
          <button 
            className="hover:text-primary transition-colors"
            onClick={() => handlePopularSearch("Photoshop")}
          >
            Photoshop
          </button>
          <span>•</span>
          <button 
            className="hover:text-primary transition-colors"
            onClick={() => handlePopularSearch("Spotify")}
          >
            Spotify
          </button>
          <span>•</span>
          <button 
            className="hover:text-primary transition-colors"
            onClick={() => handlePopularSearch("Chrome")}
          >
            Chrome
          </button>
          <span>•</span>
          <button 
            className="hover:text-primary transition-colors"
            onClick={() => handlePopularSearch("Microsoft Office")}
          >
            Microsoft Office
          </button>
          <span>•</span>
          <button 
            className="hover:text-primary transition-colors"
            onClick={() => handlePopularSearch("Visual Studio Code")}
          >
            VS Code
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-500 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        aria-label="Scroll down"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-sm font-medium mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}

export default Hero;
