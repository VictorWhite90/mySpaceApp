import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Sparkles, Zap, Bell, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { useScrollReveal } from '../hooks/useScrollReveals';
import { useMetaTags } from '../utils/metaTags';

export const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  // Update meta tags for social sharing
  useMetaTags({
    title: 'ConnectSphere - Connect, Share, Inspire Together',
    description: 'Join the next generation of social networking. Share moments, engage with communities, and build meaningful connections in real-time.',
    url: window.location.href
  });

  // Initialize scroll reveal animations - attach ref to main container
  const scrollRevealRef = useScrollReveal('.scroll-reveal');

  return (
    <div ref={scrollRevealRef} className="min-h-screen bg-white dark:bg-black relative overflow-hidden dark-mode-transition">
      {/* Morphing Blob Background */}
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

      {/* Navbar */}
      <nav className="fixed top-0 w-full glass z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white dark:text-black font-bold text-xl sm:text-2xl">C</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-black dark:text-white hidden sm:block">
                ConnectSphere
              </span>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all transform hover:scale-110 active:scale-95 relative group"
                aria-label="Toggle dark mode"
              >
                <div className="relative w-6 h-6">
                  {darkMode ? (
                    <Sun size={20} className="text-white absolute inset-0 animate-fade-in" />
                  ) : (
                    <Moon size={20} className="text-black absolute inset-0 animate-fade-in" />
                  )}
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                size="sm"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-900 dark:text-white text-sm font-semibold mb-6 sm:mb-8 border border-gray-300 dark:border-gray-700">
              <Sparkles size={16} />
              <span className="hidden sm:inline">Join 10,000+ users worldwide</span>
              <span className="sm:hidden">10K+ users</span>
            </div>

            {/* Main Heading */}
            <h1 className="scroll-reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8">
              <span className="text-black dark:text-white">Connect, Share,</span>
              <br />
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white bg-clip-text text-transparent">
                Inspire Together
              </span>
            </h1>

            {/* Subtitle */}
            <p className="scroll-reveal text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join the next generation of social networking. Share moments, engage with communities, and build meaningful connections in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="scroll-reveal flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto hover-lift"
              >
                Get Started Free →
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto hover-lift"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
              {[
                { number: '10K+', label: 'Users' },
                { number: '50K+', label: 'Posts' },
                { number: '100K+', label: 'Connections' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`scroll-reveal stagger-${i + 1}`}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-12 sm:py-20 px-4 bg-gray-50 dark:bg-gray-950 dark-mode-transition">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
              Why Choose ConnectSphere?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay connected with your community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Zap,
                title: 'Real-Time Updates',
                desc: 'Stay connected with instant notifications and live updates from your network',
                blobColor: 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
              },
              {
                icon: Users,
                title: 'Rich Media Sharing',
                desc: 'Share photos, videos, and content with beautiful, responsive layouts',
                blobColor: 'from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600'
              },
              {
                icon: Bell,
                title: 'Smart Notifications',
                desc: 'Never miss important updates with intelligent notification system',
                blobColor: 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
              },
              {
                icon: TrendingUp,
                title: 'Trending Content',
                desc: 'Discover what\'s popular and join conversations that matter',
                blobColor: 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
              },
              {
                icon: Sparkles,
                title: 'Beautiful Design',
                desc: 'Enjoy a modern, intuitive interface that works on all devices',
                blobColor: 'from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600'
              },
              {
                icon: Users,
                title: 'Community First',
                desc: 'Build meaningful connections and engage with like-minded people',
                blobColor: 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`scroll-reveal group bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover-lift stagger-${i + 1} relative overflow-hidden`}
                >
                  {/* Mini Morphing Blob behind icon */}
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${feature.blobColor} morphing-blob opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                    style={{
                      animation: `morph ${8 + i * 2}s ease-in-out infinite`
                    }}
                  />

                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="text-white dark:text-black" size={28} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-black dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section with Morphing Background */}
      <div className="relative py-12 sm:py-20 px-4 overflow-hidden">
        {/* Background Blobs for CTA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full opacity-10 morphing-blob"
            style={{
              animation: 'morph 10s ease-in-out infinite, float 8s ease-in-out infinite'
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full opacity-15 morphing-blob"
            style={{
              animation: 'morph 8s ease-in-out infinite reverse, float 6s ease-in-out infinite',
              animationDelay: '3s'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="scroll-reveal animated-gradient rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
            {/* Overlay morphing blob */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full morphing-blob"
              style={{
                animation: 'morph 15s ease-in-out infinite'
              }}
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 relative z-10">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of users already connecting, sharing, and inspiring on ConnectSphere
            </p>
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 hover:shadow-2xl w-full sm:w-auto relative z-10 ripple-button"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 ConnectSphere. Designed with minimalism in mind.</p>
        </div>
      </footer>
    </div>
  );
};