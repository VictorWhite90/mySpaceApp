import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      // Set initial state
      currentRef.style.opacity = '0';
      currentRef.style.transform = 'translateY(20px)';
      currentRef.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return ref;
};

// Alternative version for multiple elements
export const useScrollRevealMultiple = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px'
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      const elements = currentRef.querySelectorAll('.reveal');
      
      elements.forEach((element) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        element.style.transitionDelay = element.dataset.delay || '0s';
        
        observer.observe(element);
      });
    }

    return () => {
      if (currentRef) {
        const elements = currentRef.querySelectorAll('.reveal');
        elements.forEach((element) => {
          observer.unobserve(element);
        });
      }
    };
  }, [options]);

  return ref;
};

// Simple fade-in version
export const useFadeIn = (duration = 0.6) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transition = `opacity ${duration}s ease`;
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;

    if (currentRef) {
      currentRef.style.opacity = '0';
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [duration]);

  return ref;
};