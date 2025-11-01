import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Plus, Moon, Sun, ChevronDown, Menu, X } from 'lucide-react';
import { Post } from '../components/post/Post';
import { CreatePostModal } from '../components/post/CreatePostModal';
import { CommentModal } from '../components/post/CommentModal';
import { NotificationsDropdown } from '../components/notifications/NotificationsDropdown';
import { PostSkeleton } from '../components/common/PostSkeleton';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { generateMockPosts } from '../utils/mockData';

export const Dashboard = ({ user, onLogout, onProfileClick, onSearch }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      text: 'liked your post',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    },
    {
      id: 2,
      user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=2' },
      text: 'started following you',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 3,
      user: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?img=3' },
      text: 'commented on your post',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
  ]);
  const { showToast, darkMode, toggleDarkMode } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = () => {
    setTimeout(() => {
      setPosts(generateMockPosts(20));
      setLoading(false);
    }, 1000);
  };

  const loadMorePosts = () => {
    setTimeout(() => {
      const newPosts = generateMockPosts(10);
      setPosts((prev) => [...prev, ...newPosts]);
      if (posts.length > 40) setHasMore(false);
    }, 1000);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleCreatePost = (newPost) => {
    const post = {
      id: Date.now(),
      user: { name: user.name, username: user.username, avatar: user.avatar },
      text: newPost.text,
      image: newPost.image,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      liked: false,
    };
    setPosts([post, ...posts]);
    showToast('Post created successfully!', 'success');
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass border-b border-gray-200 dark:border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                ConnectSphere
              </span>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  onClick={onSearch}
                  placeholder="Search ConnectSphere..."
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white cursor-pointer transition-all"
                  readOnly
                />
              </div>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform hover:scale-110 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-primary-500" />
                ) : (
                  <Moon size={20} className="text-secondary-600" />
                )}
              </button>

              {/* Search (Tablet) */}
              <button
                onClick={onSearch}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-all transform hover:scale-110 active:scale-95"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationsRead}
                />
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-primary-500"
                  />
                  <ChevronDown size={16} className="hidden lg:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-scale-in">
                    <div className="p-3 border-b dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden py-4 border-t dark:border-gray-800 animate-fade-in-down">
              <button
                onClick={() => {
                  onSearch();
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>Toggle {darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
              <button
                onClick={() => {
                  onProfileClick();
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg"
              >
                <Bell size={20} />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 rounded-lg"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={(post) => {
                    setSelectedPost(post);
                    setShowCommentModal(true);
                  }}
                />
              ))}
            </div>
            {hasMore ? (
              <div className="text-center py-8">
                <Button onClick={loadMorePosts} variant="outline" className="hover-lift">
                  Load More Posts
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 animate-fade-in">
                <p className="text-lg">🎉 You're all caught up!</p>
                <p className="text-sm mt-2">No more posts to show</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 z-40 animate-bounce-in"
        aria-label="Create post"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        post={selectedPost}
      />
    </div>
  );
};