import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatTimestamp } from '../../utils/helpers';

export const CommentModal = ({ isOpen, onClose, post }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: 'Alice Brown', username: 'aliceb', avatar: 'https://i.pravatar.cc/150?img=10' },
      text: 'Great post!',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      user: { name: 'Bob Wilson', username: 'bobw', avatar: 'https://i.pravatar.cc/150?img=11' },
      text: 'Thanks for sharing this!',
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  const handleSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        user: { name: 'You', username: 'you', avatar: 'https://i.pravatar.cc/150?img=20' },
        text: comment,
        timestamp: new Date(),
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comments" size="lg">
      <div className="p-6">
        {/* Original Post */}
        <div className="mb-6 pb-6 border-b dark:border-gray-800">
          <div className="flex items-start gap-3">
            <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 dark:text-white">{post.user.name}</span>
                <span className="text-gray-500">@{post.user.username}</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{post.text}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <img src={c.user.avatar} alt={c.user.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{c.user.name}</span>
                  <span className="text-gray-500 text-sm">@{c.user.username}</span>
                  <span className="text-gray-400 text-sm">· {formatTimestamp(c.timestamp)}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="flex gap-3">
          <img src="https://i.pravatar.cc/150?img=20" alt="You" className="w-10 h-10 rounded-full" />
          <div className="flex-1 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={!comment.trim()}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};