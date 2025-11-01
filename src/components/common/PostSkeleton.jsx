export const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-4 border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
      </div>
    </div>
  </div>
);