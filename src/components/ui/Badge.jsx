import { cn } from '../../utils/helpers';

const variants = {
  green: 'bg-green-50 text-green-700 border-green-200',
  gold: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  saudi: 'bg-[#006C35]/10 text-[#006C35] border-[#006C35]/20',
};

export default function Badge({ children, variant = 'gray', className = '', dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full bg-current')} />
      )}
      {children}
    </span>
  );
}
