import { cn } from '../../utils/helpers';

export default function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35]',
            'transition-all duration-200',
            icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-200 focus:border-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35]',
          'transition-all duration-200 cursor-pointer',
          error && 'border-red-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
