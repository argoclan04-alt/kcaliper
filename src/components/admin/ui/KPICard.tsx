import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'violet' | 'cyan' | 'coral' | 'green' | 'red' | 'yellow';
  tooltip?: string;
  icon?: React.ReactNode;
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  violet: { bg: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
  cyan: { bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
  coral: { bg: 'from-orange-500/10 to-red-600/5', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/10' },
  green: { bg: 'from-emerald-500/10 to-green-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  red: { bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/10' },
  yellow: { bg: 'from-yellow-500/10 to-yellow-600/5', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-yellow-500/10' },
};

export function KPICard({ title, value, delta, deltaLabel, trend = 'neutral', color = 'violet', tooltip, icon }: KPICardProps) {
  const c = COLOR_MAP[color];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/30';

  return (
    <div className={`relative group bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow}`}>
      {tooltip && (
        <div className="absolute top-3 right-3 group/tip">
          <Info className="w-4 h-4 text-white/20 hover:text-white/50 cursor-help transition-colors" />
          <div className="absolute right-0 top-6 w-64 p-3 bg-[#1a1a3a] border border-white/10 rounded-xl text-xs text-white/60 opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-50 shadow-xl">
            {tooltip}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        {icon && <span className={c.text}>{icon}</span>}
        <p className="text-sm font-medium text-white/40 uppercase tracking-wider">{title}</p>
      </div>

      <p className="text-4xl font-black text-white tracking-tight mb-3">{typeof value === 'number' ? value.toLocaleString() : value}</p>

      {(delta !== undefined || deltaLabel) && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {delta !== undefined && (
              <span className="text-xs font-bold">{delta > 0 ? '+' : ''}{delta}%</span>
            )}
          </div>
          {deltaLabel && <span className="text-xs text-white/30">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
