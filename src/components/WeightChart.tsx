import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { WeightEntry } from '../types/weight-tracker';
import { calculateDoubleExponentialMovingAverage } from '../utils/weight-calculations';

interface WeightChartProps {
  entries: WeightEntry[];
  unit: 'kg' | 'lbs';
  showMovingAverage?: boolean;
}

export function WeightChart({ entries, unit, showMovingAverage = true }: WeightChartProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const chartData = sortedEntries.map((entry, index) => {
    // For chart we need to reverse the order for calculation (most recent first)
    const reversedEntries = [...sortedEntries].reverse();
    const reversedIndex = reversedEntries.length - 1 - index;
    const movingAvg = showMovingAverage ? calculateDoubleExponentialMovingAverage(reversedEntries, reversedIndex) : null;
    
    return {
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(entry.weight.toFixed(1)),
      movingAverage: movingAvg ? parseFloat(movingAvg.toFixed(1)) : null,
      weeklyRate: entry.weeklyRate || 0,
      fullDate: entry.date,
      notes: entry.notes
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-blue-600">Weight: </span>
            {data.weight.toFixed(1)} {unit}
          </p>
          {showMovingAverage && data.movingAverage && (
            <p className="text-sm">
              <span className="text-purple-600">Moving Avg: </span>
              {data.movingAverage.toFixed(1)} {unit}
            </p>
          )}
          <p className="text-sm">
            <span className="text-gray-600">Weekly Rate: </span>
            <span className={data.weeklyRate > 0 ? 'text-red-500' : data.weeklyRate < 0 ? 'text-green-500' : 'text-gray-500'}>
              {data.weeklyRate > 0 ? '+' : ''}{data.weeklyRate.toFixed(2)} {unit}/week
            </span>
          </p>
          {data.notes && (
            <p className="text-sm text-gray-500 mt-1">
              Note: {data.notes}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis 
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value.toFixed(1)} ${unit}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
          {showMovingAverage && (
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#7c3aed"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#7c3aed', strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}