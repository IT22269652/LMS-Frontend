import { cn } from '@/lib/utils';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md',
    secondary: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md',
    outline: 'border-2 border-blue-500 text-blue-700 bg-blue-50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}