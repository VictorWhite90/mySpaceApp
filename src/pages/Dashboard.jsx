import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Plus, Moon, Sun, ChevronDown, Menu, X, RefreshCw, Sparkles } from 'lucide-react';
import { Post } from '../components/post/Post';
import { CreatePostModal } from '../components/post/CreatePostModal';
import { CommentModal } from '../components/post/CommentModal';
import { NotificationsDropdown } from '../components/notifications/NotificationsDropdown';
import { PostSkeleton } from '../components/common/PostSkeleton';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { fetchRealTechNews, fetchRealSportsNews, fetchRealCryptoNews, fetchRealComments } from '../utils/realDataApis';
import { useScrollReveal } from '../hooks/useScrollReveals.jsx';

export const Dashboard = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { showToast, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  useScrollReveal();

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    setLoading(true);
    setPage(1);
    try {
      const initialPosts = await loadPosts(1);
      setPosts(initialPosts);
    } catch (error) {
      console.error('Error loading initial data:', error);
      showToast('Error loading posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadNewFeeds = async () => {
    setLoadingNew(true);
    setPage(1);
    try {
      const newPosts = await loadPosts(1, true);
      setPosts(newPosts);
      showToast('New feeds loaded!', 'success');
    } catch (error) {
      console.error('Error loading new feeds:', error);
      showToast('Error loading new feeds', 'error');
    } finally {
      setLoadingNew(false);
    }
  };

  const loadPosts = async (pageNum = 1, isNew = false) => {
    try {
      const [techPosts, sportsPosts, cryptoPosts] = await Promise.all([
        fetchRealTechNews(),
        fetchRealSportsNews(),
        fetchRealCryptoNews()
      ]);

      const allPosts = [...techPosts, ...sportsPosts, ...cryptoPosts]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // For new feeds or first load, return fresh posts
      if (isNew || pageNum === 1) {
        return allPosts.slice(0, 20);
      } else {
        // For load more, return additional posts
        return allPosts.slice(0, 20 * pageNum);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      throw error;
    }
  };

  const loadMorePosts = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newPosts = await loadPosts(nextPage);
      setPosts(newPosts);
      setPage(nextPage);
      // Simple hasMore logic - if we got less than expected, assume no more
      setHasMore(newPosts.length >= 20 * nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
      showToast('Error loading more posts', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newPosts = await loadPosts(1, true);
      setPosts(newPosts);
      setPage(1);
      showToast('Feed updated!', 'success');
    } catch (error) {
      console.error('Error refreshing posts:', error);
      showToast('Error refreshing posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post) => {
    try {
      // Fetch real comments for this post
      const realComments = await fetchRealComments(post.id);
      const postWithComments = { 
        ...post, 
        realComments,
        // Ensure post has all required properties
        liked: post.liked || false,
        comments: post.comments || 0,
        likes: post.likes || 0
      };
      setSelectedPost(postWithComments);
      setShowCommentModal(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Still show modal with fallback comments
      const postWithFallback = { 
        ...post, 
        realComments: [],
        liked: post.liked || false,
        comments: post.comments || 0,
        likes: post.likes || 0
      };
      setSelectedPost(postWithFallback);
      setShowCommentModal(true);
    }
  };

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { 
              ...post, 
              liked: !post.liked, 
              likes: post.liked ? (post.likes - 1) : (post.likes + 1) 
            }
          : post
      )
    );
  };

  const handleCreatePost = (newPost) => {
    const post = {
      id: `user_${Date.now()}`,
      user: { 
        name: user.name, 
        username: user.username, 
        avatar: user.avatar 
      },
      text: newPost.text,
      image: newPost.image,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      liked: false,
      category: 'user',
      content: newPost.text,
      source: 'Your Post'
    };
    setPosts([post, ...posts]);
    showToast('Post created successfully!', 'success');
  };

  const handleAddComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      )
    );
    showToast('Comment added!', 'success');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Notifications (simplified)
  const notifications = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      text: 'liked your post',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    }
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black dark-mode-transition">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass z-40 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white dark:text-black font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-black dark:text-white hidden sm:block">
                ConnectSphere
              </span>
            </div>

            {/* Category Filters & Refresh */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-2">
                {['all', 'tech', 'sports', 'crypto'].map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
                title="Refresh feed"
                disabled={loading}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all transform hover:scale-110 active:scale-95"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Search */}
              <button
                onClick={() => navigate('/search')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 relative transition-all"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                />
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-700"
                  />
                  <ChevronDown size={16} className="hidden lg:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-scale-in">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-3 transition-colors"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
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
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Category Filters (Mobile) */}
          <div className="md:hidden flex items-center gap-4 pb-4">
            <div className="flex gap-2 overflow-x-auto flex-1">
              {['all', 'tech', 'sports', 'crypto'].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm capitalize whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
              title="Refresh feed"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in-down">
              <button
                onClick={() => {
                  navigate('/search');
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>Toggle {darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg"
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
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 rounded-lg"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

    <div className="max-w-2xl mx-auto px-4 pt-32 md:pt-24 pb-24">
  {/* Pull to Refresh Container */}
  <div className="relative">
    {/* Pull Indicator */}
    <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
      loadingNew ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-200 dark:border-gray-700">
        <RefreshCw size={18} className={`text-blue-600 ${loadingNew ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {loadingNew ? 'Loading new feeds...' : 'Release to refresh'}
        </span>
      </div>
    </div>

    {/* Pull to Refresh Hint */}
    {!loadingNew && filteredPosts.length > 0 && (
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Sparkles size={12} />
          <span>Pull down to refresh</span>
        </div>
      </div>
    )}

    {loading ? (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    ) : (
      <>
        <div 
          className="space-y-4 min-h-screen"
          ref={(el) => {
            if (el) {
              let startY = 0;
              let currentY = 0;
              
              const handleTouchStart = (e) => {
                // Only trigger when at the top of the page
                if (window.scrollY === 0 && !loadingNew) {
                  startY = e.touches[0].clientY;
                  el.dataset.pulling = 'true';
                }
              };
              
              const handleTouchMove = (e) => {
                if (el.dataset.pulling === 'true' && !loadingNew) {
                  currentY = e.touches[0].clientY;
                  const pullDistance = currentY - startY;
                  
                  // Show visual feedback when pulling
                  if (pullDistance > 50) {
                    el.style.transform = `translateY(${Math.min(pullDistance, 100)}px)`;
                  }
                  
                  // Trigger refresh when pulled enough
                  if (pullDistance > 120) {
                    loadNewFeeds();
                    el.dataset.pulling = 'false';
                    el.style.transform = 'translateY(0px)';
                  }
                }
              };
              
              const handleTouchEnd = () => {
                if (el.dataset.pulling === 'true') {
                  el.dataset.pulling = 'false';
                  el.style.transform = 'translateY(0px)';
                }
              };
              
              // Add event listeners
              el.addEventListener('touchstart', handleTouchStart);
              el.addEventListener('touchmove', handleTouchMove);
              el.addEventListener('touchend', handleTouchEnd);
              
              // Cleanup function
              return () => {
                el.removeEventListener('touchstart', handleTouchStart);
                el.removeEventListener('touchmove', handleTouchMove);
                el.removeEventListener('touchend', handleTouchEnd);
              };
            }
          }}
        >
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="scroll-reveal cursor-pointer transform hover:scale-[1.01] transition-transform duration-200"
              onClick={() => handlePostClick(post)}
            >
              <Post
                post={post}
                onLike={handleLike}
                onComment={(post) => {
                  setSelectedPost(post);
                  setShowCommentModal(true);
                }}
                clickable={true}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && filteredPosts.length > 0 && (
          <div className="text-center py-8 scroll-reveal">
            <Button
              onClick={loadMorePosts}
              variant="outline"
              className="hover-lift min-w-32"
              disabled={loadingMore}
            >
              {loadingMore ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-fade-in">
            <p className="text-lg">No posts found in this category</p>
            <p className="text-sm mt-2">Pull down to refresh or try selecting a different category</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="mt-4"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh Feed
            </Button>
          </div>
        )}
      </>
    )}
  </div>
</div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-black dark:bg-white rounded-full shadow-2xl flex items-center justify-center text-white dark:text-black transition-all hover:scale-110 active:scale-95 z-40 animate-bounce-in"
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
        onAddComment={handleAddComment}
        realComments={selectedPost?.realComments}
      />
    </div>
  );
};