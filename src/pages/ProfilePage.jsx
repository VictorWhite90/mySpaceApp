// src/components/profile/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Edit2, MapPin, Link as LinkIcon, UserPlus, Users, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { auth } from '../firebase/config.js';
import { CreatePostModal } from '../components/post/CreatePostModal.jsx'
import { createUserPost } from '../services/firebaseService';

import { 
  followUser, 
  unfollowUser, 
  checkFollowingStatus, 
  getUserPosts,
  subscribeToUserProfile,
  subscribeToUserPosts 
} from '../services/firebaseService.js';

export const ProfilePage = ({ user, onEditProfile }) => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  
  const [profileUser, setProfileUser] = useState(user);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Check if current user is viewing their own profile
  useEffect(() => {
    if (user && auth.currentUser) {
      setIsOwnProfile(user.id === auth.currentUser.uid);
      setProfileUser(user);
      setFollowersCount(user.followers?.length || 0);
      setFollowingCount(user.following?.length || 0);
    }
  }, [user]);

  // Set up real-time listeners for profile and posts
  useEffect(() => {
    if (!user?.id) return;

    let unsubscribeProfile = () => {};
    let unsubscribePosts = () => {};

    const setupListeners = async () => {
      setLoading(true);
      try {
        // Set up real-time profile listener
        unsubscribeProfile = subscribeToUserProfile(user.id, (userData) => {
          if (userData) {
            setProfileUser(userData);
            setFollowersCount(userData.followers?.length || 0);
            setFollowingCount(userData.following?.length || 0);
          }
        });

        // Set up real-time posts listener
        unsubscribePosts = subscribeToUserPosts(user.id, (posts) => {
          setUserPosts(posts || []);
        });

        // Check follow status if not own profile
        if (!isOwnProfile && auth.currentUser) {
          const followingStatus = await checkFollowingStatus(auth.currentUser.uid, user.id);
          setIsFollowing(followingStatus);
        }

      } catch (error) {
        console.error('Error setting up profile listeners:', error);
        showToast('Error loading profile data', 'error');
        
        // Fallback: Load posts without real-time updates
        try {
          const posts = await getUserPosts(user.id);
          setUserPosts(posts);
        } catch (postError) {
          console.error('Error loading posts:', postError);
        }
      } finally {
        setLoading(false);
      }
    };

    setupListeners();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeProfile();
      unsubscribePosts();
    };
  }, [user?.id, isOwnProfile, showToast]);

  const handleCreatePost = async (newPost) => {
    try {
      if (!auth.currentUser || !profileUser) {
        showToast('Please log in to create posts', 'error');
        return;
      }

      // Save to Firestore
      await createUserPost(profileUser.id, {
        text: newPost.text,
        image: newPost.image,
        user: {
          name: profileUser.name,
          username: profileUser.username,
          avatar: profileUser.avatar
        }
      });

      showToast('Post created successfully!', 'success');
      setShowCreateModal(false);
      
      // The real-time listener will automatically update the posts
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Error creating post', 'error');
    }
  };

  const handleFollow = async () => {
    if (!auth.currentUser) {
      showToast('Please log in to follow users', 'error');
      return;
    }

    if (!profileUser) return;

    try {
      if (isFollowing) {
        await unfollowUser(auth.currentUser.uid, profileUser.id);
        setIsFollowing(false);
        showToast(`Unfollowed ${profileUser.name}`, 'success');
      } else {
        await followUser(auth.currentUser.uid, profileUser.id);
        setIsFollowing(true);
        showToast(`Following ${profileUser.name}`, 'success');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      showToast('Error updating follow status', 'error');
    }
  };

  const handlePostClick = (post) => {
    showToast('Opening post...', 'info');
    // You can implement: navigate(`/post/${post.id}`)
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessage = () => {
    if (!auth.currentUser) {
      showToast('Please log in to message users', 'error');
      return;
    }
    showToast('Messaging feature coming soon!', 'info');
  };

  const handleShareProfile = () => {
    if (!profileUser) return;
    
    const profileUrl = `${window.location.origin}/profile/${profileUser.username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${profileUser.name} on ConnectSphere`,
        text: `Check out ${profileUser.name}'s profile on ConnectSphere`,
        url: profileUrl,
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      showToast('Profile link copied to clipboard!', 'success');
    }
  };

  const getAccountAge = () => {
    if (!profileUser?.createdAt) return 'Recently';
    
    try {
      const created = profileUser.createdAt.toDate ? profileUser.createdAt.toDate() : new Date(profileUser.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months === 1 ? '' : 's'}`;
      }
      const years = Math.floor(diffDays / 365);
      return `${years} year${years === 1 ? '' : 's'}`;
    } catch (error) {
      return 'Recently';
    }
  };

  // Show loading only when initially setting up
  if (loading && !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl animate-bounce mx-auto mb-4">
            <span className="text-white dark:text-black font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
        >
          ← Back
        </button>
        
        {/* Profile Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            onClick={handleShareProfile}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Share
          </Button>
          {!isOwnProfile && (
            <Button
              onClick={handleMessage}
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Message
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-12 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img
              src={profileUser.avatar || 'https://i.pravatar.cc/150?img=20'}
              alt={profileUser.name}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-900"
            />
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
              <p className="text-gray-500">@{profileUser.username}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            {!isOwnProfile && (
              <Button 
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "primary"}
                className="min-w-32"
              >
                <UserPlus size={16} className="mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            {isOwnProfile && (
              <>
                <Button onClick={() => setShowCreateModal(true)} variant="primary">
                  <Edit2 size={16} className="mr-2" />
                  Create Post
                </Button>
                <Button onClick={onEditProfile} variant="outline">
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg">
            {profileUser.bio || '✨ Living life one post at a time. Sharing thoughts, moments, and ideas with the world.'}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {profileUser.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{profileUser.location}</span>
              </div>
            )}
            {profileUser.website && (
              <div className="flex items-center gap-1">
                <LinkIcon size={16} />
                <a 
                  href={profileUser.website} 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {getAccountAge()} ago</span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-gray-400" />
              <span className="font-bold text-gray-900 dark:text-white">{followersCount.toLocaleString()}</span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex items-center gap-1">
              <UserPlus size={16} className="text-gray-400" />
              <span className="font-bold text-gray-900 dark:text-white">{followingCount.toLocaleString()}</span>
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Posts ({userPosts.length})
          </h2>
          
          {userPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit2 size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isOwnProfile ? 'No posts yet' : 'No posts yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {isOwnProfile 
                  ? 'Share your first post to get started!' 
                  : `${profileUser.name} hasn't posted anything yet.`}
              </p>
              {isOwnProfile && (
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                >
                  Create Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer group"
                >
                  {post.image ? (
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 flex items-center">
                      <p className="text-gray-800 dark:text-gray-200 line-clamp-4 text-sm">
                        {post.text}
                      </p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart size={14} /> 
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} /> 
                        {post.comments || 0}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.timestamp?.toDate ? 
                        post.timestamp.toDate().toLocaleDateString() : 
                        'Recent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};