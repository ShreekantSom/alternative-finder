
import { useEffect, useState, useRef } from 'react';

// Custom hook for animate on scroll
export function useAnimateOnScroll(rootMargin = '0px') {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(ref);
          }
        },
        { rootMargin }
      );

      observer.observe(ref);
      
      return () => {
        if (ref) {
          observer.unobserve(ref);
        }
      };
    }
  }, [ref, rootMargin]);

  return { ref: setRef, isVisible };
}

// Custom hook for lazy loading images
export function useLazyLoadImage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (imgRef.current && imgRef.current.dataset.src) {
              imgRef.current.src = imgRef.current.dataset.src;
              imgRef.current.onload = () => setIsLoaded(true);
            }
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '200px' }
      );
      
      observer.observe(imgRef.current);
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, []);

  return { imgRef, isLoaded };
}

// Page transition animation
export function usePageTransition() {
  const [isPageVisible, setIsPageVisible] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return {
    pageClass: `transition-opacity duration-700 ease-in-out ${
      isPageVisible ? 'opacity-100' : 'opacity-0'
    }`
  };
}
