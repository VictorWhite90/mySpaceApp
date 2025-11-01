import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Plus, Moon, Sun, ChevronDown } from 'lucide-react';
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
      user: { name: user.name, username: user.username, avatar: 'https://i.pravatar.cc/150?img=20' },
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
      <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
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
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white cursor-pointer"
                  readOnly
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search */}
              <button
                onClick={onSearch}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Search size={20} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hidden sm:block"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <img
                    src="https://i.pravatar.cc/150?img=20"
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
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
            {hasMore ? (
              <div className="text-center py-8">
                <Button onClick={loadMorePosts} variant="outline">
                  Load More
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You're all caught up! 🎉</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <Plus size={24} />
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