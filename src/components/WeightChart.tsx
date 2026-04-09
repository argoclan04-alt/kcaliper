import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { WeightEntry } from '../types/weight-tracker';
import { calculateDoubleExponentialMovingAverage, calculateWeeklyRate } from '../utils/weight-calculations';

interface WeightChartProps {
  entries: WeightEntry[];
  unit: 'kg' | 'lbs';
  showMovingAverage?: boolean;
}

export function WeightChart({ entries, unit, showMovingAverage = true }: WeightChartProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const chartData = sortedEntries.map((entry, index) => {
    const reversedEntries = [...sortedEntries].reverse();
    const reversedIndex = reversedEntries.length - 1 - index;
    const movingAvg = showMovingAverage ? calculateDoubleExponentialMovingAverage(reversedEntries, reversedIndex) : null;
    const weeklyRate = calculateWeeklyRate(reversedEntries, reversedIndex);
    
    return {
      date: new Date(entry.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      weight: parseFloat(entry.weight.toFixed(1)),
      movingAverage: movingAvg ? parseFloat(movingAvg.toFixed(1)) : null,
      weeklyRate: weeklyRate !== 0 ? weeklyRate : (entry.weeklyRate || 0),
      fullDate: entry.date,
      notes: entry.notes
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border border-white/20 dark:border-gray-700 rounded-2xl shadow-xl">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Peso</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{data.weight.toFixed(1)} {unit}</span>
            </div>
            {showMovingAverage && data.movingAverage && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">Promedio</span>
                <span className="font-bold text-gray-900 dark:text-white">{data.movingAverage.toFixed(1)} {unit}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-200 dark:border-gray-700 mt-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tasa/Sem</span>
              <span className={`font-bold ${data.weeklyRate > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {data.weeklyRate > 0 ? '+' : ''}{data.weeklyRate.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-800" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickMargin={10}
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            animationDuration={1500}
          />
          {showMovingAverage && (
            <Area
              type="monotone"
              dataKey="movingAverage"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorAvg)"
              animationDuration={2000}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}