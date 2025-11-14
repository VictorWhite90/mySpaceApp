// src/components/dashboard/Dashboard.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Plus, Moon, Sun, ChevronDown, Menu, X, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { Post } from '../components/post/Post';
import { CreatePostModal } from '../components/post/CreatePostModal';
import { CommentModal } from '../components/post/CommentModal';
import { NotificationsDropdown } from '../components/notifications/NotificationsDropdown';
import { PostSkeleton } from '../components/common/PostSkeleton';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { fetchAllNewsFeed, fetchRealComments } from '../utils/realDataApis';
import { useScrollReveal } from '../hooks/useScrollReveals.jsx';
import { useMetaTags } from '../utils/metaTags';

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
  const [error, setError] = useState(null);
  
  const { showToast, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const lastFetchTime = useRef(Date.now());
  const lastPostsSnapshot = useRef([]);
  const autoRefreshInterval = useRef(null);
  const isPageVisible = useRef(true);

  // Update meta tags for social sharing
  useMetaTags({
    title: 'Dashboard - ConnectSphere',
    description: 'Stay connected with the latest news feeds, updates, and community posts on ConnectSphere.',
    url: window.location.href
  });

  useScrollReveal();

  // Helper function for fallback posts - MUST be defined before loadPosts
  const getFallbackPosts = () => {
    const categories = ['tech', 'sports', 'crypto', 'music', 'nigeria'];
    const categoryNames = {
      tech: 'Technology News',
      sports: 'Sports Updates',
      crypto: 'Crypto Markets',
      music: 'Music News',
      nigeria: 'Nigeria News'
    };

    return Array.from({ length: 15 }, (_, i) => {
      const category = categories[i % categories.length];
      return {
        id: `fallback_${i}_${Date.now()}`,
        user: {
          name: categoryNames[category],
          username: `${category}_updates`,
          avatar: `https://i.pravatar.cc/150?img=${i + 1}`
        },
        text: `Sample ${category} post ${i + 1}`,
        content: `This is sample content for ${category} category. The API might be rate limited or experiencing issues.`,
        image: `https://picsum.photos/seed/${category}${i}/600/400`,
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 20) + 1,
        timestamp: new Date(Date.now() - i * 30 * 60 * 1000),
        category: category,
        source: 'Sample Source',
        url: '#',
        liked: false
      };
    });
  };

  // Memoized load posts function - MUST be defined before handleRefresh
  const loadPosts = useCallback(async (pageNum = 1, isNew = false, forceRefresh = false) => {
    try {
      console.log(`🔄 Loading posts... (forceRefresh: ${forceRefresh})`);
      setError(null);

      // Force refresh if explicitly requested
      const allPosts = await fetchAllNewsFeed(forceRefresh);

      // Posts are already sorted by timestamp from fetchAllNewsFeed
      const sortedPosts = allPosts.filter(post => post && post.timestamp);

      console.log(`✅ Loaded ${sortedPosts.length} posts`);

      // For new feeds or first load, return fresh posts
      if (isNew || pageNum === 1) {
        return sortedPosts.slice(0, 20);
      } else {
        // For load more, return additional posts
        return sortedPosts.slice(0, 20 * pageNum);
      }
    } catch (error) {
      console.error('❌ Error loading posts:', error);
      setError('Failed to load posts. Using demo data.');
      
      // Provide fallback data
      const fallbackPosts = getFallbackPosts();
      showToast('Using demo data - API might be limited', 'warning');
      return fallbackPosts.slice(0, 20);
    }
  }, [showToast]);

  // Pull to refresh implementation - Enhanced with better update detection
  const handleRefresh = useCallback(async () => {
    // Prevent rapid refreshes (reduced to 2 seconds for better UX)
    const timeSinceLastFetch = Date.now() - lastFetchTime.current;
    if (timeSinceLastFetch < 2000) {
      showToast('Please wait before refreshing again', 'info');
      return;
    }

    setLoadingNew(true);
    setPage(1);
    try {
      // Force fetch new data (bypass cache)
      const newPosts = await loadPosts(1, true, true);
      
      // Better content comparison - check if we have genuinely new posts
      const oldPostIds = new Set(lastPostsSnapshot.current.map(p => p.id?.split('_')[0] || p.id));
      const newPostIds = new Set(newPosts.map(p => p.id?.split('_')[0] || p.id));
      
      // Count how many posts are actually new
      const newPostCount = newPosts.filter(p => {
        const baseId = p.id?.split('_')[0] || p.id;
        return !oldPostIds.has(baseId);
      }).length;
      
      setPosts(newPosts);
      lastPostsSnapshot.current = newPosts;
      lastFetchTime.current = Date.now();
      
      if (newPostCount > 0) {
        showToast(`Feed updated! ${newPostCount} new ${newPostCount === 1 ? 'post' : 'posts'} available`, 'success');
      } else {
        showToast('You\'re all caught up! No new posts yet.', 'info');
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
      showToast('Error refreshing posts', 'error');
    } finally {
      setLoadingNew(false);
    }
  }, [loadPosts, showToast]);

  // Auto-refresh newsfeed every 5 minutes when page is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Auto-refresh every 5 minutes (300000ms) when page is visible
    autoRefreshInterval.current = setInterval(() => {
      if (isPageVisible.current && !loading && !loadingNew) {
        console.log('🔄 Auto-refreshing newsfeed...');
        handleRefresh();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [loading, loadingNew, handleRefresh]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showCommentModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showCommentModal]);

  // Initial data load
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
      lastPostsSnapshot.current = initialPosts;
      lastFetchTime.current = Date.now();
    } catch (error) {
      console.error('Error loading initial data:', error);
      showToast('Error loading posts', 'error');
    } finally {
      setLoading(false);
    }
  };


  const loadMorePosts = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newPosts = await loadPosts(nextPage);
      setPosts(newPosts);
      setPage(nextPage);
      setHasMore(newPosts.length >= 20 * nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
      showToast('Error loading more posts', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle post click to open comments
  const handlePostClick = async (post, event) => {
    // If user clicked on external link, don't open modal
    if (event.target.closest('.external-link-btn')) {
      return;
    }

    try {
      const realComments = await fetchRealComments(post.id);
      const postWithComments = {
        ...post,
        realComments,
        liked: post.liked || false,
        comments: post.comments || 0,
        likes: post.likes || 0
      };
      setSelectedPost(postWithComments);
      setShowCommentModal(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
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

  // Open external source link
  const handleOpenSource = (e, post) => {
    e.stopPropagation();
    if (post.url && post.url !== '#') {
      window.open(post.url, '_blank', 'noopener,noreferrer');
    } else {
      showToast('Source URL not available', 'warning');
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
      source: 'Your Post',
      url: '#'
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

  // Notifications
  const notifications = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      text: 'liked your post',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    },
    {
      id: 2,
      user: { name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=2' },
      text: 'commented on your post',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300">
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

            {/* Category Filters & Refresh - Desktop */}
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
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all text-gray-900 dark:text-white disabled:opacity-50"
                title="Refresh feed (Auto-refreshes every 5 minutes)"
                disabled={loading || loadingNew}
              >
                <RefreshCw size={18} className={loadingNew ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Right Side - Desktop & Mobile */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle - Always Visible */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all transform hover:scale-110 active:scale-95 text-gray-900 dark:text-white"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Desktop Only Actions */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                {/* Search */}
                <button
                  onClick={() => navigate('/search')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all text-gray-900 dark:text-white"
                >
                  <Search size={20} />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 relative transition-all text-gray-900 dark:text-white"
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
                    <ChevronDown size={16} className="hidden lg:block text-gray-900 dark:text-white" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-3 transition-colors text-gray-900 dark:text-white"
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
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Category Filters (Mobile) */}
          <div className="md:hidden flex items-center gap-4 pb-4">
            <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
              title="Refresh feed (Auto-refreshes every 5 minutes)"
              disabled={loading || loadingNew}
            >
              <RefreshCw size={18} className={loadingNew ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => {
                  navigate('/search');
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg text-gray-900 dark:text-white"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg text-gray-900 dark:text-white"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 rounded-lg text-gray-900 dark:text-white"
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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-32 md:pt-24 pb-24" ref={scrollContainerRef}>
        <div className="relative">
          {/* Pull to Refresh Indicator */}
          <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
            loadingNew ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-200 dark:border-gray-700">
              <RefreshCw size={18} className={`text-blue-600 dark:text-blue-400 ${loadingNew ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Loading new feeds...
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          )}

          {/* Pull to Refresh Hint */}
          {!loadingNew && !loading && filteredPosts.length > 0 && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <Sparkles size={12} />
                <span>Pull down to refresh</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4 min-h-screen">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative cursor-pointer transform hover:scale-[1.01] transition-all duration-200"
                    onClick={(e) => handlePostClick(post, e)}
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
                    
                    {/* External Link Button - FIXED: Always visible on mobile, shows on hover on desktop */}
                    {post.url && post.url !== '#' && (
                      <button
                        onClick={(e) => handleOpenSource(e, post)}
                        className="external-link-btn absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 border border-gray-200 dark:border-gray-700 z-10"
                        title={`Read full article on ${post.source}`}
                      >
                        <ExternalLink size={16} className="text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && filteredPosts.length > 0 && (
                <div className="text-center py-8">
                  <Button
                    onClick={loadMorePosts}
                    variant="outline"
                    className="min-w-32"
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
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg">No posts found in this category</p>
                  <p className="text-sm mt-2">Pull down to refresh or try selecting a different category</p>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="mt-4"
                    disabled={loadingNew}
                  >
                    <RefreshCw size={16} className={`mr-2 ${loadingNew ? 'animate-spin' : ''}`} />
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
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-black dark:bg-white rounded-full shadow-2xl flex items-center justify-center text-white dark:text-black transition-all hover:scale-110 active:scale-95 z-40"
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