import { useEffect, useRef } from 'react';

export const useScrollReveal = (selector = '.scroll-reveal') => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
      const elements = currentRef.querySelectorAll(selector);
      
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          // Set initial state
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          
          observer.observe(element);
        }
      });
    }

    return () => {
      if (currentRef) {
        const elements = currentRef.querySelectorAll(selector);
        elements.forEach((element) => {
          observer.unobserve(element);
        });
      }
    };
  }, [selector]);

  return ref;
};