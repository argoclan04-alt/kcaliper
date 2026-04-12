import { Client, WeightEntry } from '../types/weight-tracker';
import { WeightChart } from './WeightChart';
import { WeightEntryTable } from './WeightEntryTable';
import { AddWeightForm } from './AddWeightForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Scale, TrendingUp, Calendar } from 'lucide-react';

interface CoachPersonalProfileProps {
  profile: Client;
  onAddEntry: (weight: number, date: string, notes: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<WeightEntry>) => void;
  loading?: boolean;
}

export function CoachPersonalProfile({ profile, onAddEntry, onUpdateEntry, loading }: CoachPersonalProfileProps) {
  const latestEntry = [...(profile.weightEntries || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00D2FF]" />
              Peso Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic text-white">
              {latestEntry?.weight || '--'} <span className="text-lg text-white/30 not-italic font-normal">{profile.unit}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00D2FF]" />
              Media Móvil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic text-white text-[#00D2FF]">
              {latestEntry?.movingAverage?.toFixed(1) || '--'} <span className="text-lg text-white/30 not-italic font-normal">{profile.unit}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00D2FF]" />
              Ritmo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-black italic ${latestEntry?.weeklyRate && latestEntry.weeklyRate < 0 ? 'text-green-400' : 'text-white'}`}>
              {latestEntry?.weeklyRate ? (latestEntry.weeklyRate > 0 ? '+' : '') : ''}
              {latestEntry?.weeklyRate?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[32px] sticky top-6">
            <CardContent className="pt-6">
              <AddWeightForm 
                unit={profile.unit} 
                onSubmit={onAddEntry} 
                loading={loading}
                existingDates={profile.weightEntries?.map(e => e.date)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Chart & Table */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white italic font-black uppercase tracking-tight flex items-center gap-2">
                Tendencia de Peso
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <WeightChart entries={profile.weightEntries || []} unit={profile.unit} />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white italic font-black uppercase tracking-tight flex items-center gap-2">
                Historial de Registros
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <WeightEntryTable 
                entries={profile.weightEntries || []} 
                unit={profile.unit} 
                canEdit={true}
                onUpdateEntry={onUpdateEntry}
                showMovingAverage={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
