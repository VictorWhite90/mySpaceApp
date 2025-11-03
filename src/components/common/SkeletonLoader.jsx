export const SkeletonLoader = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 skeleton rounded mb-2 w-3/4" />
          <div className="h-3 skeleton rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-5/6" />
        <div className="h-4 skeleton rounded w-4/6" />
      </div>
      <div className="h-48 skeleton rounded-lg mb-3" />
      <div className="flex gap-4">
        <div className="h-4 skeleton rounded w-16" />
        <div className="h-4 skeleton rounded w-16" />
      </div>
    </div>
  );
};

export const SkeletonPost = () => {
  return (
    <div className="space-y-4">
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </div>
  );
};