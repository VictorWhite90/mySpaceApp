import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../context/AppContext';

export const SignupPage = ({ onNavigate, onSignup }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast, registerUser, users } = useApp();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (users.find(u => u.email === formData.email)) {
      newErrors.email = 'Email already registered. Please login instead.';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const userData = { 
        name: formData.name.trim(), 
        email: formData.email, 
        password: formData.password,
        username: formData.name.toLowerCase().replace(/\s+/g, ''),
        avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
        bio: '',
        location: '',
        website: ''
      };
      
      registerUser(userData);
      showToast('Account created successfully!', 'success');
      onSignup(userData);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl animate-bounce-in">
              <span className="text-white dark:text-black font-bold text-3xl">C</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join ConnectSphere today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="John Doe"
              autoComplete="name"
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => onNavigate('login')} 
                className="text-black dark:text-white hover:underline font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};