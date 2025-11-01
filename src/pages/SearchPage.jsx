import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Post } from '../components/post/Post';
import { generateMockPosts } from '../utils/mockData';

export const SearchPage = ({ onBack, onUserClick }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      // Mock search results
      const users = [
        { name: 'Sarah Chen', username: 'sarahc', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Marcus Johnson', username: 'mjohnson', avatar: 'https://i.pravatar.cc/150?img=2' },
      ];
      const posts = generateMockPosts(5);
      setResults({ users, posts });
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
            ← Back
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ConnectSphere..."
              className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>

        {debouncedQuery && (
          <>
            {/* Users */}
            {results.users.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">People</h2>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  {results.users.map((user, i) => (
                    <div
                      key={i}
                      onClick={() => onUserClick(user)}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b dark:border-gray-800 last:border-0"
                    >
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Posts</h2>
                {results.posts.map((post) => (
                  <Post key={post.id} post={post} onLike={() => {}} onComment={() => {}} />
                ))}
              </div>
            )}
          </>
        )}

        {!debouncedQuery && (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Search for people and posts</p>
          </div>
        )}
      </div>
    </div>
  );
};