import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/common/Toast';
import { ConnectSphereLoader } from './components/common/CLogoLoader';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { createUserProfile } from './services/firebaseService';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl animate-bounce mx-auto mb-4 transition-colors duration-300">
        <span className="text-white dark:text-black font-bold text-3xl">C</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children, user }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { toast, setToast, showToast } = useApp();


 // Firebase Auth State Listener - FIXED VERSION

 
// Firebase Auth State Listener - FIXED VERSION
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        console.log('🔄 Firebase user detected:', firebaseUser.uid);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = { 
            ...userDoc.data(), 
            uid: firebaseUser.uid,
            id: firebaseUser.uid
          };
          console.log('✅ User data loaded from Firestore');
          setUser(userData);
          localStorage.setItem('connectsphere-current-user', JSON.stringify(userData));
        } else {
          console.log('📝 Creating new user document in Firestore');
          // Create user document if it doesn't exist
          await createUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
          });
          
          // Reload the user data
          const newUserDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (newUserDoc.exists()) {
            const userData = { 
              ...newUserDoc.data(), 
              uid: firebaseUser.uid,
              id: firebaseUser.uid
            };
            setUser(userData);
            localStorage.setItem('connectsphere-current-user', JSON.stringify(userData));
            console.log('✅ New user profile created and loaded');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      }
    } else {
      console.log('🚪 User signed out');
      setUser(null);
      localStorage.removeItem('connectsphere-current-user');
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Firebase handles persistence automatically
    showToast('Welcome back!', 'success');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    // Firebase handles persistence automatically
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('connectsphere-current-user');
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Error during logout', 'error');
    }
  };

  const handleProfileUpdate = async (updates) => {
    try {
      if (!user?.uid) {
        throw new Error('No user UID available');
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), updates);
      
      // Update localStorage for backward compatibility
      localStorage.setItem('connectsphere-current-user', JSON.stringify(updatedUser));
      
      showToast('Profile updated!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Error updating profile', 'error');
    }
  };

  // Show initial loader on first visit
  if (showInitialLoader) {
    return (
      <ConnectSphereLoader onComplete={() => setShowInitialLoader(false)} />
    );
  }

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute user={user}>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <LoginPage onLogin={handleLogin} />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute user={user}>
              <SignupPage onSignup={handleSignup} />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

 <Route
  path="/profile"
  element={
    <ProtectedRoute user={user}>
      <ProfilePage
        user={user} // ✅ Just pass user directly
        onEditProfile={() => setShowEditProfile(true)}
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile/:username"
  element={
    <ProtectedRoute user={user}>
      <ProfilePage
        user={user} // ✅ Just pass user directly
        onEditProfile={() => setShowEditProfile(true)}
      />
    </ProtectedRoute>
  }
/>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Edit Profile Modal */}
      {showEditProfile && user && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={user}
          onSave={(updates) => {
            handleProfileUpdate(updates);
            setShowEditProfile(false);
          }}
        />
      )}

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;