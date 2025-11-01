import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';

export const LandingPage = ({ onNavigate }) => {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ConnectSphere
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
            <Button onClick={() => onNavigate('signup')}>Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Connect, Share, Inspire
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto animate-fade-in-delay">
            Join the next generation of social networking. Share moments, engage with communities, and build meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button size="lg" onClick={() => onNavigate('signup')} className="text-xl px-8 py-4">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="text-xl px-8 py-4">
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">Why ConnectSphere?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Real-Time Updates', desc: 'Stay connected with instant notifications and live updates' },
            { icon: '🎨', title: 'Rich Media', desc: 'Share photos, videos, and more with beautiful presentation' },
            { icon: '🔔', title: 'Smart Notifications', desc: 'Never miss important updates from your network' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};