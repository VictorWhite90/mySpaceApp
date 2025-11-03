// import { useState, useEffect } from 'react';

// export const AppLoader = () => {
//   const [currentText, setCurrentText] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showCursor, setShowCursor] = useState(true);

//   const loadingTexts = [
//     "Loading ConnectSphere...",
//     "Preparing your feeds...", 
//     "Almost ready...",
//     "Welcome to ConnectSphere!"
//   ];

//   useEffect(() => {
//     const text = loadingTexts[Math.floor(currentIndex / 40) % loadingTexts.length];
    
//     if (currentIndex < text.length * loadingTexts.length) {
//       const timeout = setTimeout(() => {
//         const textIndex = Math.floor(currentIndex / 40);
//         const charIndex = currentIndex % 40;
//         const currentText = loadingTexts[textIndex];
        
//         if (charIndex < currentText.length) {
//           setCurrentText(currentText.substring(0, charIndex + 1));
//         }
//         setCurrentIndex(currentIndex + 1);
//       }, 100);

//       return () => clearTimeout(timeout);
//     }
//   }, [currentIndex]);

//   // Blinking cursor effect
//   useEffect(() => {
//     const cursorInterval = setInterval(() => {
//       setShowCursor(prev => !prev);
//     }, 500);
//     return () => clearInterval(cursorInterval);
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
//       <div className="text-center">
//         {/* Animated Logo */}
//         <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
//           <span className="text-white font-bold text-3xl">C</span>
//         </div>
        
//         {/* Typewriter Text */}
//         <div className="typewriter-container">
//           <p className="text-gray-700 dark:text-gray-300 text-xl font-medium mb-2 min-h-8">
//             {currentText}
//             {showCursor && <span className="cursor">|</span>}
//           </p>
//           <div className="flex justify-center space-x-1">
//             {[0, 1, 2].map(i => (
//               <div
//                 key={i}
//                 className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
//                 style={{ animationDelay: `${i * 0.1}s` }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };