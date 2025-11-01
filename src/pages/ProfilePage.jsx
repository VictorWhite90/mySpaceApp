import { Heart, MessageCircle, Edit2, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { generateMockPosts } from '../utils/mockData';

export const ProfilePage = ({ user, onBack, onEditProfile }) => {
  const userPosts = generateMockPosts(12).map((post) => ({ ...post, user }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
        >
          ← Back
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-16 mb-4">
          <img
            src={user.avatar || 'https://i.pravatar.cc/150?img=20'}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
            <Button onClick={onEditProfile} variant="outline">
              <Edit2 size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>

          <p className="text-gray-800 dark:text-gray-200 mb-4">
            {user.bio || '✨ Living life one post at a time'}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <LinkIcon size={16} />
                <a href={user.website} className="text-blue-600 hover:underline">
                  {user.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <div>
              <span className="font-bold text-gray-900 dark:text-white">248</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">1.2K</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
            >
              {post.image ? (
                <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4 flex items-center">
                  <p className="text-gray-800 dark:text-gray-200 line-clamp-4">{post.text}</p>
                </div>
              )}
              <div className="p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> {post.comments}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};