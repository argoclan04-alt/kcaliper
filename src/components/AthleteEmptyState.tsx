import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UserPlus, Settings, ShieldCheck, Trophy } from 'lucide-react';

interface AthleteEmptyStateProps {
  athleteName: string;
  onJoinDemoCoach: () => void;
  loading?: boolean;
}

export function AthleteEmptyState({ athleteName, onJoinDemoCoach, loading }: AthleteEmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">¡Welcome, {athleteName}!</CardTitle>
          <CardDescription>
            You have successfully created your account. To start tracking your progress, you need to be linked with a coach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1.5 rounded-md">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Wait for Invitation</p>
                <p className="text-xs text-gray-500">Your coach can invite you using your email address.</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Demo Mode</p>
                <p className="text-xs text-gray-500">You can join Coach Carlos (our demo coach) to test all features instantly.</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onJoinDemoCoach} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
          >
            {loading ? 'Joining...' : 'Join Coach Carlos (Demo)'}
          </Button>
          
          <p className="text-[10px] text-center text-gray-400">
            Note: Joining the demo coach will link your account to our sample dataset for testing purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
