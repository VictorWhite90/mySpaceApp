import { Moon, Sun, Sparkles, Zap, Bell, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';

export const LandingPage = ({ onNavigate }) => {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-300 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary-300 dark:bg-secondary-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-accent-300 dark:bg-accent-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full glass border-b border-gray-200 dark:border-gray-800 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl sm:text-2xl">C</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gradient hidden sm:block">
                ConnectSphere
              </span>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform hover:scale-110 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-primary-500" />
                ) : (
                  <Moon size={20} className="text-secondary-600" />
                )}
              </button>
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('login')}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button 
                onClick={() => onNavigate('signup')}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-400 text-sm font-semibold mb-6 sm:mb-8 animate-bounce-in border border-primary-200 dark:border-primary-800">
              <Sparkles size={16} />
              <span className="hidden sm:inline">Join 10,000+ users worldwide</span>
              <span className="sm:hidden">10K+ users</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 animate-fade-in">
              <span className="text-gray-900 dark:text-white">Connect, Share,</span>
              <br />
              <span className="text-gradient">Inspire Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
              Join the next generation of social networking. Share moments, engage with communities, and build meaningful connections in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 animate-fade-in-up [animation-delay:400ms]">
              <Button 
                size="lg" 
                onClick={() => onNavigate('signup')}
                className="w-full sm:w-auto hover-lift"
              >
                Get Started Free →
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto hover-lift"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
              {[
                { number: '10K+', label: 'Users', delay: '0.1s' },
                { number: '50K+', label: 'Posts', delay: '0.2s' },
                { number: '100K+', label: 'Connections', delay: '0.3s' },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1">
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
      <div className="relative py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-scale-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
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
                gradient: 'from-primary-500 to-red-500',
                title: 'Real-Time Updates',
                desc: 'Stay connected with instant notifications and live updates from your network',
              },
              {
                icon: Users,
                gradient: 'from-secondary-500 to-blue-500',
                title: 'Rich Media Sharing',
                desc: 'Share photos, videos, and content with beautiful, responsive layouts',
              },
              {
                icon: Bell,
                gradient: 'from-accent-500 to-green-500',
                title: 'Smart Notifications',
                desc: 'Never miss important updates with intelligent notification system',
              },
              {
                icon: TrendingUp,
                gradient: 'from-pink-500 to-primary-500',
                title: 'Trending Content',
                desc: 'Discover what\'s popular and join conversations that matter',
              },
              {
                icon: Sparkles,
                gradient: 'from-purple-500 to-secondary-500',
                title: 'Beautiful Design',
                desc: 'Enjoy a modern, intuitive interface that works on all devices',
              },
              {
                icon: Users,
                gradient: 'from-green-500 to-accent-500',
                title: 'Community First',
                desc: 'Build meaningful connections and engage with like-minded people',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`group bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover-lift animate-fade-in-up stagger-${i + 1}`}
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animated-gradient rounded-3xl p-8 sm:p-12 shadow-2xl text-center animate-scale-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of users already connecting, sharing, and inspiring on ConnectSphere
            </p>
            <Button 
              onClick={() => onNavigate('signup')}
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 hover:shadow-2xl w-full sm:w-auto"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 ConnectSphere. Made with ❤️ for connecting people.</p>
        </div>
      </footer>
    </div>
  );
};