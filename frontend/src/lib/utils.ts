import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export const fmtDate = formatDate;

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) return 'Ended';
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function getTimeRemaining(endTime: Date) {
  if (!endTime || isNaN(endTime.getTime())) {
    return { 
      total: 0, 
      days: 0, 
      hours: 0, 
      minutes: 0, 
      seconds: 0, 
      isEnded: true 
    };
  }
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff < 0) {
    return { 
      total: 0, 
      days: 0, 
      hours: 0, 
      minutes: 0, 
      seconds: 0, 
      isEnded: true 
    };
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    total: diff,
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    isEnded: false,
  };
}


export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const formatPrice = formatCurrency;
export const fmtPrice = formatCurrency;

export function isIncoming(type: string) {
  return ['DEPOSIT', 'REFUND'].includes(type);
}
