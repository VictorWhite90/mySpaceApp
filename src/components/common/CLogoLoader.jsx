import { useState, useEffect } from "react";

export const ConnectSphereLoader = ({ onComplete }) => {
  const [loops, setLoops] = useState(0);
  const [text, setText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Syncing your world. Expanding your sphere";
  const maxLoops = 3;

  // Typewriter effect - runs only once
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setTypingComplete(true);
    }
  }, [charIndex]);

  useEffect(() => {
    if (loops >= maxLoops) {
      const done = setTimeout(() => onComplete?.(), 300);
      return () => clearTimeout(done);
    }
  }, [loops, onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loops < maxLoops) setLoops((prev) => prev + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [loops]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-black overflow-hidden dark-mode-transition">
      {/* Morphing Blob Background - Same as landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary Morphing Blob */}
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 morphing-blob-1 opacity-20 dark:opacity-15 transition-all duration-1000"
          style={{
            animation: 'morph 15s ease-in-out infinite, float 12s ease-in-out infinite'
          }}
        />

        {/* Secondary Morphing Blob */}
        <div
          className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 morphing-blob-2 opacity-25 dark:opacity-10 transition-all duration-1000"
          style={{
            animation: 'morph 12s ease-in-out infinite reverse, float 10s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />

        {/* Tertiary Morphing Blob */}
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 morphing-blob-3 opacity-15 dark:opacity-20 transition-all duration-1000"
          style={{
            animation: 'morph 18s ease-in-out infinite, float 14s ease-in-out infinite',
            animationDelay: '4s'
          }}
        />

        {/* Additional floating elements */}
        <div
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-gray-400 dark:bg-gray-600 rounded-full opacity-10"
          style={{
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s'
          }}
        />

        <div
          className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gray-500 dark:bg-gray-500 rounded-full opacity-15"
          style={{
            animation: 'float 6s ease-in-out infinite reverse',
            animationDelay: '3s'
          }}
        />
      </div>

      {/* Logo and Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            {/* Outer C (rotating) */}
            <div className="absolute w-full h-full flex items-center justify-center animate-sway text-black dark:text-white font-serif">
              <span className="text-[85px] font-bold leading-none">C</span>
            </div>

            {/* Inner c (static) */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 dark:text-gray-400 font-serif">
              <span className="text-[38px] font-bold ml-[6px] mt-[3px] leading-none">
                c
              </span>
            </div>

            {/* Soft Glow */}
            <div className="absolute inset-0 rounded-full opacity-10 blur-xl bg-black dark:bg-white" />
          </div>

          {/* Typewriter Text */}
          <div className="text-center max-w-md px-4">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4 min-h-[60px] leading-relaxed">
              {text}
              {!typingComplete && <span className="animate-pulse">|</span>}
            </h1>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(30deg);
          }
        }
        .animate-sway {
          animation: sway 1.5s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
};