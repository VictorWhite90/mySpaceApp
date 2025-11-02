import { useRef } from 'react';

export const useTilt = (intensity = 20) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    const rotateY = x * intensity;
    const rotateX = y * -intensity;
    
    ref.current.style.transform = `
      perspective(1000px)
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    
    ref.current.style.transform = `
      perspective(1000px)
      rotateY(0deg)
      rotateX(0deg)
      scale3d(1, 1, 1)
    `;
  };

  return { ref, handleMouseMove, handleMouseLeave };
};