import { useEffect, useRef } from 'react';
import { formatTimestamp } from '../../utils/helpers';

export const NotificationsDropdown = ({ isOpen, onClose, notifications, onMarkRead }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      onMarkRead();
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, onMarkRead]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-scale-in"
    >
      <div className="p-4 border-b dark:border-gray-800">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-800 last:border-0 ${
                !notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <img src={notif.user.avatar} alt={notif.user.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    <span className="font-semibold">{notif.user.name}</span> {notif.text}
                  </p>
                  <span className="text-gray-500 text-xs">{formatTimestamp(notif.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};