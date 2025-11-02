export const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
    )}
    <input
      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-900 dark:border-gray-800 dark:text-white ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
      } ${className}`}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1.5 animate-fade-in">{error}</p>
    )}
  </div>
);