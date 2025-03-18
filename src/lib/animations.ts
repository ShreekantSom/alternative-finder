
import { useEffect, useState, useRef } from 'react';
import { useMotionValue, useSpring, useInView } from 'framer-motion';

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
        { rootMargin, threshold: 0.1 }
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

// Enhanced version that works better with Framer Motion
export function useAnimateInView(options = { once: true, amount: 0.3 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, options);
  
  return { ref, isInView };
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

// Smooth counter animation hook
export function useSmoothCounter(value: number, duration = 2) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);
  
  useEffect(() => {
    const unsubscribe = springValue.onChange(latest => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);
  
  return displayValue;
}

// Stagger children animation hook
export function useStaggerChildren() {
  return {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }
  };
}
