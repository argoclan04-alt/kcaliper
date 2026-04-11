import { useEffect } from 'react';
import { Client } from '../types/weight-tracker';
import { AddWeightForm } from './AddWeightForm';
import { WeightChart } from './WeightChart';
import { WeightEntryTable } from './WeightEntryTable';
import { ClientNotifications } from './ClientNotifications';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { calculateDoubleExponentialMovingAverage, calculateWeeklyRate } from '../utils/weight-calculations';
import { Scale, TrendingDown, TrendingUp, Target, Award, ArrowRight } from 'lucide-react';
import { showAchievementToast } from './AchievementToast';
import { Lock, Zap, CheckCircle2, CircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientDashboardProps {
  client: Client;
  onAddWeight: (weight: number, date: string, notes: string) => void;
  onUpdateEntry: (entryId: string, updates: any) => void;
  loading: boolean;
  unreadAlerts?: any[];
  onDeclinePhotoRequest?: (requestId: string) => void;
}

export function ClientDashboard({ client, onAddWeight, onUpdateEntry, loading, unreadAlerts = [], onDeclinePhotoRequest }: ClientDashboardProps) {
  const sortedEntries = [...client.weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const movingAverage = calculateDoubleExponentialMovingAverage(sortedEntries, 0);
  const weeklyRate = calculateWeeklyRate(sortedEntries, 0);
  const latestEntry = sortedEntries[0];
  
  const lowestWeight = client.weightEntries.reduce((min, entry) => 
    entry.weight < min ? entry.weight : min, Infinity
  );
  
  const highestWeight = client.weightEntries.reduce((max, entry) => 
    entry.weight > max ? entry.weight : max, -Infinity
  );

  const entriesCount = client.weightEntries.length;
  const hasEnoughDataForDEMA = entriesCount >= 3;
  const hasPhoto = client.physiquePhotos && client.physiquePhotos.length > 0;

  // Check for achievements when latest entry changes
  useEffect(() => {
    if (latestEntry) {
      // Check for new lowest
      if (latestEntry.isLowest) {
        showAchievementToast({ 
          type: 'lowest', 
          weight: latestEntry.weight, 
          unit: client.unit 
        });
      }
      
      // Check for new highest
      if (latestEntry.isHighest) {
        showAchievementToast({ 
          type: 'highest', 
          weight: latestEntry.weight, 
          unit: client.unit 
        });
      }
      
      // Check for milestone achievement
      if (client.milestone && !client.milestoneAchieved) {
        const milestoneReached = client.targetWeeklyRate < 0 
          ? latestEntry.weight <= client.milestone
          : latestEntry.weight >= client.milestone;
          
        if (milestoneReached) {
          showAchievementToast({ 
            type: 'milestone', 
            weight: client.milestone, 
            unit: client.unit 
          });
        }
      }
    }
  }, [latestEntry?.id]);

  const getTargetRateDisplay = (rate: number) => {
    if (rate > 0) return `+${rate} ${client.unit}/week (Gaining)`;
    if (rate < 0) return `${rate} ${client.unit}/week (Losing)`;
    return `${rate} ${client.unit}/week (Maintaining)`;
  };

  const getWeeklyRateColor = (rate: number) => {
    if (rate > 0) return 'text-red-600 bg-red-50';
    if (rate < 0) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">Panel del Atleta</h1>
        <p className="text-gray-400">Observa cómo la inteligencia artificial te ayuda a transformar tu cuerpo.</p>
      </div>

      {/* Gamified Actionable Checklist */}
      {(entriesCount < 7 || !hasPhoto) && (
        <Card className="bg-[#111111] border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
               <Zap className="w-24 h-24 text-[var(--fp-cyan)]" />
           </div>
           <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                 <h3 className="text-xl font-bold text-white mb-1">Misiones de Arranque</h3>
                 <p className="text-gray-400 text-sm mb-4">Completa estos pasos para que CaliBot conozca tu biología al 100%.</p>
                 
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <span className="text-gray-300 font-medium line-through">Onboarding Completado</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                       {hasPhoto ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <CircleDashed className="w-5 h-5 text-[var(--fp-cyan)] group-hover:scale-110 transition-transform" />}
                       <span className={`font-medium ${hasPhoto ? 'text-gray-300 line-through' : 'text-white'}`}>Subir primera Foto de Progreso</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                       {hasEnoughDataForDEMA ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <CircleDashed className="w-5 h-5 text-[var(--fp-violet)] animate-pulse" />}
                       <span className={`font-medium ${hasEnoughDataForDEMA ? 'text-gray-300 line-through' : 'text-white'}`}>Ingresar 3 registros de peso ({entriesCount}/3)</span>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-xl font-semibold">
                  {latestEntry ? `${latestEntry.weight} ${client.unit}` : 'No data'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          {!hasEnoughDataForDEMA && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/50 transition-colors">
               <Lock className="w-6 h-6 text-gray-400 mb-1" />
               <span className="text-xs text-gray-300 font-medium">Requiere 3 pesajes</span>
             </div>
          )}
          <CardContent className={`p-4 ${!hasEnoughDataForDEMA ? 'opacity-30 blur-sm' : ''}`}>
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Trend Average (DEMA)</p>
                <p className="text-xl font-semibold">
                  {client.weightEntries.length > 0 ? `${movingAverage.toFixed(1)} ${client.unit}` : 'No data'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Lowest Weight</p>
                <p className="text-xl font-semibold">
                  {client.weightEntries.length > 0 ? `${lowestWeight.toFixed(1)} ${client.unit}` : 'No data'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {client.milestone ? (
                <>
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Milestone</p>
                    <p className="text-xl font-semibold">
                      {client.milestone.toFixed(1)} {client.unit}
                      {client.milestoneAchieved && ' ✓'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <TrendingUp className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Highest Weight</p>
                    <p className="text-xl font-semibold">
                      {client.weightEntries.length > 0 ? `${highestWeight.toFixed(1)} ${client.unit}` : 'No data'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Progress - LOCKED IF NOT ENOUGH DATA */}
      <Card className="relative overflow-hidden group">
        {!hasEnoughDataForDEMA && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-2 text-center">
               <Lock className="w-8 h-8 text-gray-400 mb-2" />
               <span className="text-sm text-gray-300 font-bold max-w-xs">Velocidad Semanal Bloqueada</span>
               <span className="text-xs text-gray-400 mt-1 max-w-xs">Registra 2 pesos más para activar el sensor predictivo de quema calórica.</span>
             </div>
        )}
        <CardHeader className={`${!hasEnoughDataForDEMA ? 'opacity-30 blur-sm' : ''}`}>
          <CardTitle>Current Progress</CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 ${!hasEnoughDataForDEMA ? 'opacity-30 blur-sm' : ''}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Target Rate:</span>
              <Badge variant="outline">
                {getTargetRateDisplay(client.targetWeeklyRate)}
              </Badge>
            </div>
            {weeklyRate !== 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current Rate:</span>
                <Badge className={`${getWeeklyRateColor(weeklyRate)} border font-bold`}>
                  {weeklyRate > 0 ? '+' : ''}{weeklyRate.toFixed(2)} {client.unit}/week
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Weight Form */}
      <div className="max-w-md mx-auto">
        <AddWeightForm
          unit={client.unit}
          onSubmit={onAddWeight}
          loading={loading}
          existingDates={client.weightEntries.map(entry => entry.date)}
        />
      </div>

      {/* Notifications */}
      {client.notifications && client.notifications.length > 0 && (
        <ClientNotifications
          notifications={client.notifications}
          onMarkAsRead={(notifId) => {
            // This will be handled by the parent
          }}
        />
      )}

      {/* Weight Chart */}
      {client.weightEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart 
              entries={client.weightEntries} 
              unit={client.unit}
              showMovingAverage={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Weight History */}
      {client.weightEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
          </CardHeader>
          <CardContent className="md:px-6 px-0">
            <WeightEntryTable
              entries={client.weightEntries}
              unit={client.unit}
              canEdit={true}
              onUpdateEntry={onUpdateEntry}
              showCoachControls={false}
              showMovingAverage={client.showMovingAverage !== false}
              nutritionData={client.nutritionData || []}
              targetWeeklyRate={client.targetWeeklyRate}
              unreadAlerts={unreadAlerts}
              physiquePhotos={client.physiquePhotos}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}