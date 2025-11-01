import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/common/Toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { EditProfileModal } from './components/profile/EditProfileModal';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { toast, setToast, showToast } = useApp();

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
    showToast('Welcome back!', 'success');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    showToast('Logged out successfully', 'success');
  };

  const handleProfileUpdate = (updates) => {
    setUser({ ...user, ...updates });
    showToast('Profile updated!', 'success');
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />}
      {currentPage === 'signup' && <SignupPage onNavigate={setCurrentPage} onSignup={handleSignup} />}
      {currentPage === 'dashboard' && user && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onProfileClick={() => setCurrentPage('profile')}
          onSearch={() => setCurrentPage('search')}
        />
      )}
      {currentPage === 'profile' && user && (
        <ProfilePage
          user={user}
          onBack={() => setCurrentPage('dashboard')}
          onEditProfile={() => setShowEditProfile(true)}
        />
      )}
      {currentPage === 'search' && (
        <SearchPage
          onBack={() => setCurrentPage('dashboard')}
          onUserClick={(clickedUser) => {
            setUser(clickedUser);
            setCurrentPage('profile');
          }}
        />
      )}
      
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
    </>
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