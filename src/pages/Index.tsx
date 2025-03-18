
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AlternativesList from '@/components/AlternativesList';
import FeaturedAlternative from '@/components/FeaturedAlternative';
import CategoriesList from '@/components/CategoriesList';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const Index = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Page loaded effect
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle search results
  const handleSearch = (results: any[]) => {
    setSearchResults(results);
    // Clear category selection when searching
    if (results.length > 0) {
      setSelectedCategory('All');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Clear search results when selecting category
    setSearchResults([]);
  };

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen overflow-x-hidden"
        initial="initial"
        animate={pageLoaded ? "animate" : "initial"}
        exit="exit"
        variants={pageVariants}
      >
        <Navbar onSearch={handleSearch} />
        
        <main>
          {searchResults.length === 0 && (
            <>
              <Hero />
              <FeaturedAlternative />
              <CategoriesList onCategorySelect={handleCategorySelect} />
            </>
          )}
          <AlternativesList searchResults={searchResults} />
        </main>
        
        <footer className="bg-secondary py-12 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="rounded-xl bg-primary p-1.5">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-lg">AlternativeFinder</span>
                </div>
                <p className="text-muted-foreground mt-2">Find better software alternatives with ease.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Explore</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Categories</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Trending</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">New</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Blog</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Guides</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Help Center</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Company</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">About</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Careers</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Legal</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Privacy</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Terms</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary text-sm">Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} AlternativeFinder. All rights reserved.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200 z-40"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
