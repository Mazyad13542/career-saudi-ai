import { cn } from '../../utils/helpers';

export default function ProgressBar({ value, max = 100, color = 'green', label, showValue = true, size = 'md' }) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    green: 'bg-[#006C35]',
    gold: 'bg-[#C8A951]',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex flex-col gap-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-gray-600 font-medium">{label}</span>}
          {showValue && <span className="text-gray-500">{value}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
