import { useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { TrendingDown, TrendingUp, Target, Award } from 'lucide-react';

interface AchievementToastProps {
  type: 'lowest' | 'highest' | 'milestone' | 'target_streak';
  weight?: number;
  unit?: string;
  days?: number;
}

export function showAchievementToast({ type, weight, unit, days }: AchievementToastProps) {
  switch (type) {
    case 'lowest':
      toast.success('🎉 New Lowest Weight!', {
        description: `Congratulations! You've reached a new lowest weight: ${weight?.toFixed(1)} ${unit}`,
        duration: 5000,
        icon: <TrendingDown className="w-5 h-5 text-green-600" />,
        className: 'bg-green-50 border-green-500',
      });
      break;
      
    case 'highest':
      toast.success('🎯 New Highest Weight!', {
        description: `Great progress! You've reached a new highest weight: ${weight?.toFixed(1)} ${unit}`,
        duration: 5000,
        icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
        className: 'bg-blue-50 border-blue-500',
      });
      break;
      
    case 'milestone':
      toast.success('🏆 Milestone Achieved!', {
        description: `Amazing work! You've reached your weight milestone: ${weight?.toFixed(1)} ${unit}`,
        duration: 6000,
        icon: <Award className="w-5 h-5 text-yellow-600" />,
        className: 'bg-yellow-50 border-yellow-500',
      });
      break;
      
    case 'target_streak':
      toast.success('🔥 On Target Streak!', {
        description: `You've maintained your target rate for ${days} consecutive days. Keep it up!`,
        duration: 5000,
        icon: <Target className="w-5 h-5 text-purple-600" />,
        className: 'bg-purple-50 border-purple-500',
      });
      break;
  }
}
