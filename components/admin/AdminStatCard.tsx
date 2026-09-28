import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'gold' | 'blue' | 'emerald' | 'purple' | 'amber';
}

const ACCENT_STYLES = {
  gold: {
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
    text: 'text-gold-400',
    glow: 'group-hover:border-gold-500/50',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'group-hover:border-blue-500/50',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'group-hover:border-emerald-500/50',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'group-hover:border-purple-500/50',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'group-hover:border-amber-500/50',
  },
};

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'gold',
}) => {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <div
      className={`group relative p-6 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${styles.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl ${styles.bg} ${styles.border} border flex items-center justify-center ${styles.text}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
