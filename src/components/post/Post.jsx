import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatTimestamp } from '../../utils/helpers';

export const Post = ({ post, onLike, onComment, clickable = false }) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl p-4 sm:p-6 mb-4 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3">
        {/* Avatar - Fixed width */}
        <img 
          src={post.user.avatar} 
          alt={post.user.name} 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-gray-200 dark:ring-gray-800 flex-shrink-0" 
        />
        
        {/* Content - Flexible width with overflow control */}
        <div className="flex-1 min-w-0"> {/* min-w-0 is crucial for text truncation */}
          
          {/* Header - Name, Username, Time */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
              {post.user.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
              @{post.user.username}
            </span>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">
              {formatTimestamp(post.timestamp)}
            </span>
          </div>

          {/* Post Text - Proper word wrap */}
          <p className="text-gray-800 dark:text-gray-200 mb-3 text-sm sm:text-base break-words whitespace-pre-wrap overflow-wrap-anywhere">
            {post.text}
          </p>

          {/* Image - Responsive */}
          {post.image && (
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full rounded-xl mb-3 max-h-64 sm:max-h-96 object-cover border border-gray-200 dark:border-gray-800" 
            />
          )}

          {/* Source Badge */}
          {post.source && (
            <span className="inline-block text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full mb-3">
              {post.source}
            </span>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-red-500 transition-colors group"
            >
              <Heart 
                size={18} 
                className={`${post.liked ? 'fill-red-500 text-red-500' : ''} group-hover:scale-110 transition-transform sm:w-5 sm:h-5`} 
              />
              <span className={`text-xs sm:text-sm ${post.liked ? 'text-red-500 font-semibold' : ''}`}>
                {post.likes}
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onComment(post);
              }}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MessageCircle size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">{post.comments}</span>
            </button>

            <button 
              className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};