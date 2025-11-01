import { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const maxChars = 280;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit({ text, image });
      setText('');
      setImage(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post">
      <div className="p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-3 border dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          rows={4}
          maxLength={maxChars}
        />
        <div className="text-right text-sm text-gray-500 mb-3">
          {text.length}/{maxChars}
        </div>
        
        {image && (
          <div className="relative mb-3">
            <img src={image} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600"
          >
            <ImageIcon size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button onClick={handleSubmit} disabled={!text.trim()}>
            Post
          </Button>
        </div>
      </div>
    </Modal>
  );
};