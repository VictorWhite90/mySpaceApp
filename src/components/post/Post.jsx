import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatTimestamp } from '../../utils/helpers';

export const Post = ({ post, onLike, onComment }) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl p-6 mb-4 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3">
        <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full ring-2 ring-gray-200 dark:ring-gray-800" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 dark:text-white">{post.user.name}</span>
            <span className="text-gray-500 dark:text-gray-400">@{post.user.username}</span>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{formatTimestamp(post.timestamp)}</span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">{post.text}</p>
          {post.image && (
            <img src={post.image} alt="Post" className="w-full rounded-xl mb-3 max-h-96 object-cover border border-gray-200 dark:border-gray-800" />
          )}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group"
            >
              <Heart size={20} className={`${post.liked ? 'fill-red-500 text-red-500' : ''} group-hover:scale-110 transition-transform`} />
              <span className={post.liked ? 'text-red-500 font-semibold' : ''}>{post.likes}</span>
            </button>
            <button
              onClick={() => onComment(post)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MessageCircle size={20} />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};