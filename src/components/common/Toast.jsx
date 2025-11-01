import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-3 max-w-md ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? (
        <CheckCircle size={24} className="flex-shrink-0" />
      ) : (
        <XCircle size={24} className="flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};