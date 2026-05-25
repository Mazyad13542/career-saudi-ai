import Card from './Card';
import { cn } from '../../utils/helpers';

export default function StatCard({ icon, label, value, sub, color = 'green', trend }) {
  const colors = {
    green: { bg: 'bg-[#006C35]/8', text: 'text-[#006C35]', ring: 'ring-[#006C35]/10' },
    gold: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  };

  const c = colors[color] || colors.green;

  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl ring-1', c.bg, c.ring)}>
          <span className={cn('block w-5 h-5', c.text)}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </Card>
  );
}
