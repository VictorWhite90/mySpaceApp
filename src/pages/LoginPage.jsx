import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../context/AppContext';
import { ConnectSphereLoader } from '../components/common/CLogoLoader';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { showToast } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Just handle authentication, let App.jsx handle user data
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      setShowLoader(true);
      
      // Wait for loader to complete (3 seconds)
      setTimeout(() => {
        onLogin(userCredential.user); // Just pass the basic user info
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setErrors({ email: 'Invalid email or password.' });
        showToast('Invalid email or password. Please try again.', 'error');
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ email: 'Account not found. Please sign up first.' });
        showToast('Account not found. Please sign up first.', 'error');
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password.' });
        showToast('Incorrect password. Please try again.', 'error');
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ email: 'Too many failed attempts. Please try again later.' });
        showToast('Too many failed attempts. Please try again later.', 'error');
      } else {
        setErrors({ email: 'Login failed. Please try again.' });
        showToast('Login failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showLoader) {
    return <ConnectSphereLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl animate-bounce-in hover:scale-110 transition-transform">
              <span className="text-white dark:text-black font-bold text-3xl">C</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue to ConnectSphere
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-950 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
            >
              <span className="mr-2">🔗</span>
              Continue with Google
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/signup')} 
                className="text-black dark:text-white hover:underline font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};