import { cn } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, glass = false, gradient = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
        glass && 'glass',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
}
