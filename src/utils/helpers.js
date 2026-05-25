import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatSalary(salary) {
  return salary;
}

export function getDaysAgo(days) {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function getStatusColor(status) {
  const colors = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Replied: 'bg-blue-50 text-blue-700 border-blue-200',
    Interview: 'bg-green-50 text-green-700 border-green-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Active: 'bg-green-50 text-green-700 border-green-200',
    Closed: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200';
}

export function getEnglishLevelColor(level) {
  const colors = {
    A: 'text-green-600 bg-green-50 border-green-200',
    B: 'text-blue-600 bg-blue-50 border-blue-200',
    C: 'text-amber-600 bg-amber-50 border-amber-200',
    D: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[level] || 'text-gray-600 bg-gray-50 border-gray-200';
}

export function getEnglishLevelLabel(level) {
  const labels = {
    A: 'Advanced',
    B: 'Intermediate',
    C: 'Basic',
    D: 'Beginner',
  };
  return labels[level] || 'Unknown';
}

export function getScoreColor(score) {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 55) return 'text-amber-600';
  return 'text-red-600';
}

export function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '...' : str;
}
