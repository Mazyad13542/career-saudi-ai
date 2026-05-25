import { cn } from '../../utils/helpers';

const variants = {
  primary: 'bg-[#006C35] hover:bg-[#005528] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm',
  gold: 'bg-gradient-to-r from-[#C8A951] to-[#E8C97A] hover:from-[#B8992E] hover:to-[#D4B55A] text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  outline: 'bg-transparent border border-[#006C35] text-[#006C35] hover:bg-[#006C35] hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-8 py-4 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer select-none',
        'focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="w-4 h-4 flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
}
