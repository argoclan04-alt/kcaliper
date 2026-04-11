import React, { useState } from 'react';
import { Plus, Settings, HelpCircle, MessageSquare, Bell, Image as ImageIcon, CheckCircle2, CircleDashed, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { WeightEntry, Client } from '../types/weight-tracker';
import { calculateDoubleExponentialMovingAverage, calculateWeeklyRate } from '../utils/weight-calculations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { MobileNotificationsButton } from './MobileNotificationsButton';
import { PhotoRequestWarning } from './PhotoRequestWarning';
import { PhotoUploadDialog } from './PhotoUploadDialog';
import { EditNotesDialog } from './EditNotesDialog';
import { ScannerOverlay } from './ScannerOverlay';
import { Camera as CameraIcon } from 'lucide-react';

interface LogbookProps {
  entries: WeightEntry[];
  onAddEntry: (weight: number, date: string, notes: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<WeightEntry>) => void;
  isCoachView?: boolean;
  clientName?: string;
  unit?: 'kg' | 'lbs';
  client?: Client;
  onUpdateClientSettings?: (settings: Partial<Client>) => void;
  onUploadPhoto?: (photoUrl: string, notes: string, viewType?: 'front' | 'side' | 'back') => void;
  unreadAlerts?: any[];
  onMarkAlertAsRead?: (alertId: string) => void;
}

export function Logbook({ 
  entries, 
  onAddEntry, 
  onUpdateEntry, 
  isCoachView = false, 
  clientName, 
  unit = 'kg',
  client,
  onUpdateClientSettings,
  onUploadPhoto,
  unreadAlerts = [],
  onMarkAlertAsRead
}: LogbookProps) {
  const [addWeightDialogOpen, setAddWeightDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [viewNotesId, setViewNotesId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editNotesText, setEditNotesText] = useState('');
  const [photoRequestWarningOpen, setPhotoRequestWarningOpen] = useState(false);
  const [photoUploadDialogOpen, setPhotoUploadDialogOpen] = useState(false);
  const [photoRequestViewType, setPhotoRequestViewType] = useState<'front' | 'side' | 'back'>('front');
  const [showPhotoNotifications, setShowPhotoNotifications] = useState(false);
  const [editNotesDialogOpen, setEditNotesDialogOpen] = useState(false);
  const [editNotesDate, setEditNotesDate] = useState('');
  const [showPhotosMode, setShowPhotosMode] = useState(false);
  const [selectedPhotoEntry, setSelectedPhotoEntry] = useState<WeightEntry | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const hasPhoto = client?.physiquePhotos && client.physiquePhotos.length > 0;
  const entriesCount = entries.length;
  const hasEnoughDataForDEMA = entriesCount >= 3;

  // Sort entries by date (most recent first)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate moving averages and weekly rates, and add photos
  const entriesWithCalculations = sortedEntries.map((entry, index) => {
    const movingAverage = calculateDoubleExponentialMovingAverage(sortedEntries, index);
    const weeklyRate = calculateWeeklyRate(sortedEntries, index);
    
    // Find photos for this date
    const photosForDate = client?.physiquePhotos?.filter(photo => photo.date === entry.date) || [];
    
    return {
      ...entry,
      movingAverage,
      weeklyRate,
      photos: photosForDate.length > 0 ? photosForDate : undefined
    };
  });

  // Group entries by month
  const groupEntriesByMonth = () => {
    const groups: { [key: string]: typeof entriesWithCalculations } = {};
    entriesWithCalculations.forEach(entry => {
      const date = new Date(entry.date + 'T00:00:00');
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(entry);
    });
    return groups;
  };

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error('Por favor ingresa un peso válido');
      return;
    }
    
    onAddEntry(weight, newDate, newNotes);
    setNewWeight('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewNotes('');
    setAddWeightDialogOpen(false);
    toast.success('Peso registrado exitosamente');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDate();
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    return { day, dayOfWeek };
  };

  const getWeeklyRateColor = (rate: number) => {
    if (rate > 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (rate < 0) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  const handleEditNotes = (entryId: string, currentNotes: string) => {
    setEditingNotesId(entryId);
    setEditNotesText(currentNotes || '');
    setViewNotesId(null);
  };

  const handleSaveNotes = (entryId: string) => {
    onUpdateEntry(entryId, { notes: editNotesText });
    setEditingNotesId(null);
    setEditNotesText('');
    toast.success('Notas actualizadas');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-4 py-4 flex items-center justify-between border-b dark:border-gray-800 sticky top-0 z-20">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Logbook</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 text-xs"
            onClick={() => window.open('https://help.argotracker.com', '_blank')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help Desk</span>
          </Button>
          
          {/* Notifications Button */}
          <MobileNotificationsButton
            unreadAlerts={unreadAlerts}
            onMarkAsRead={onMarkAlertAsRead || (() => {})}
          />
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">

      {/* Gamified Actionable Checklist */}
      {(entriesCount < 7 || !hasPhoto) && (
        <Card className="bg-[#111111] border-white/10 relative overflow-hidden mb-8">
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
        {entries.length === 0 ? (
          /* Empty State */
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Comienza a registrar tu peso
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Registra tu peso diariamente para ver tu progreso y tendencias
              </p>
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setAddWeightDialogOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Peso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Weight Entries by Month */}
            {Object.entries(groupEntriesByMonth()).map(([monthKey, monthEntries]) => (
              <div key={monthKey} className="mb-6">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex-1 text-center">
                    {monthKey}
                  </h2>
                  {monthEntries.some(e => e.photos && e.photos.length > 0) && (
                    <Button
                      variant={showPhotosMode ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${showPhotosMode ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                      onClick={() => setShowPhotosMode(!showPhotosMode)}
                    >
                      <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                      {showPhotosMode ? 'Hide Photos' : 'Show Photos'}
                    </Button>
                  )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  {/* Table Header */}
                  <div className={`grid ${client?.showMovingAverage !== false ? 'grid-cols-[60px_1fr_1fr_1fr_60px]' : 'grid-cols-[60px_1fr_1fr_60px]'} gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
                    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center">Date</div>
                    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center">Recorded</div>
                    {client?.showMovingAverage !== false && (
                      <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center">Moving Average</div>
                    )}
                    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center">Weekly Rate</div>
                    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center">Notes</div>
                  </div>

                  {/* Table Rows */}
                  {monthEntries.map((entry) => {
                    const { day, dayOfWeek } = formatDate(entry.date);
                    const isViewingNotes = viewNotesId === entry.id;
                    const isEditingNotes = editingNotesId === entry.id;
                    const hasNotes = entry.notes && entry.notes.trim().length > 0;

                    return (
                      <div key={entry.id}>
                        {/* Main Row */}
                        <div 
                          className={`grid ${client?.showMovingAverage !== false ? 'grid-cols-[60px_1fr_1fr_1fr_60px]' : 'grid-cols-[60px_1fr_1fr_60px]'} gap-2 px-3 py-3 border-b border-gray-100 dark:border-gray-800 items-center ${
                            showPhotosMode && entry.photos && entry.photos.length > 0 
                              ? 'ring-2 ring-blue-400 dark:ring-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20' 
                              : ''
                          }`}
                          onClick={() => {
                            if (showPhotosMode && entry.photos && entry.photos.length > 0) {
                              setSelectedPhotoEntry(entry);
                            }
                          }}
                        >
                          {/* Date */}
                          <div className="text-center">
                            <div className="text-base font-bold text-gray-900 dark:text-white leading-none">{day}</div>
                            <div className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
                              {dayOfWeek}
                            </div>
                          </div>

                          {/* Recorded Weight */}
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {entry.weight.toFixed(1)}
                            </div>
                          </div>

                          {/* Moving Average */}
                          {client?.showMovingAverage !== false && (
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {entry.movingAverage > 0 ? entry.movingAverage.toFixed(1) : '-'}
                              </div>
                            </div>
                          )}

                          {/* Weekly Rate */}
                          <div className="text-center">
                            {entry.weeklyRate !== 0 ? (
                              <Badge 
                                variant="outline" 
                                className={`${getWeeklyRateColor(entry.weeklyRate)} text-xs px-1.5 py-0.5 font-medium border-0`}
                              >
                                {entry.weeklyRate > 0 ? '+' : ''}{entry.weeklyRate.toFixed(2)}
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-600">-</span>
                            )}
                          </div>

                          {/* Notes Indicator */}
                          <div className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering photo view
                                if (hasNotes) {
                                  setViewNotesId(entry.id);
                                } else {
                                  setEditNotesDialogOpen(true);
                                  setEditingNotesId(entry.id);
                                  setEditNotesDate(entry.date);
                                  setEditNotesText('');
                                }
                              }}
                            >
                              {hasNotes ? (
                                <MessageSquare className="h-4 w-4 text-blue-500 fill-blue-500" />
                              ) : (
                                <span className="text-xs text-gray-400">Add not...</span>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Notes View/Edit Section */}
                        {(isViewingNotes || isEditingNotes) && (
                          <div className="px-3 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            {isEditingNotes ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editNotesText}
                                  onChange={(e) => setEditNotesText(e.target.value)}
                                  placeholder="Agrega notas sobre este registro..."
                                  className="min-h-[80px] text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveNotes(entry.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    Guardar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingNotesId(null);
                                      setEditNotesText('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {entry.notes}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditNotesDialogOpen(true);
                                    setEditingNotesId(entry.id);
                                    setEditNotesDate(entry.date);
                                    setEditNotesText(entry.notes || '');
                                    setViewNotesId(null);
                                  }}
                                >
                                  Editar
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating Add Button */}
      {!isCoachView && (
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setAddWeightDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Add Weight Dialog */}
      <Dialog open={addWeightDialogOpen} onOpenChange={setAddWeightDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Agregar Peso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Fecha</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Peso ({unit})</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="70.0"
                  className="flex-1"
                  autoFocus
                />
                <Button 
                  variant="outline" 
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  onClick={() => setShowScanner(true)}
                >
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Scanner
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Notas (opcional)</Label>
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ej: Me sentí bien, buen entrenamiento"
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleAddWeight}
              >
                Agregar
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAddWeightDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Logbook Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Daily Weight Reminder */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    Daily Weight Reminder
                  </Label>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Get a daily reminder to log your weight
                </p>
              </div>
              <Switch
                checked={client?.reminderEnabled || false}
                onCheckedChange={(checked) => {
                  if (onUpdateClientSettings) {
                    onUpdateClientSettings({ reminderEnabled: checked });
                  }
                }}
              />
            </div>

            {/* Reminder Time */}
            {client?.reminderEnabled && (
              <div className="space-y-2 pl-6">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Reminder Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={client?.reminderTime || '08:00'}
                    onChange={(e) => {
                      if (onUpdateClientSettings) {
                        onUpdateClientSettings({ reminderTime: e.target.value });
                      }
                    }}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs px-3"
                    onClick={() => {
                      toast.success('Hora de recordatorio guardada');
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Photo Request Section */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Set Photo Request (Day) - Button */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      Set Photo Request (Day)
                    </Label>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Trigger a photo notification for testing
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    setPhotoRequestViewType('front');
                    setPhotoRequestWarningOpen(true);
                  }}
                >
                  Test
                </Button>
              </div>

              {/* Show Photo Request Notification */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    Show Photo Request Notification
                  </Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Display photo requests from your coach
                  </p>
                </div>
                <Switch
                  checked={showPhotoNotifications}
                  onCheckedChange={(checked) => {
                    setShowPhotoNotifications(checked);
                  }}
                />
              </div>
            </div>

            {/* Show Moving Average */}
            <div className="flex items-start justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    Show Moving Average
                  </Label>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Display moving average in weight history
                </p>
              </div>
              <Switch
                checked={client?.showMovingAverage !== false}
                onCheckedChange={(checked) => {
                  if (onUpdateClientSettings) {
                    onUpdateClientSettings({ showMovingAverage: checked });
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Request Warning Dialog */}
      <PhotoRequestWarning
        open={photoRequestWarningOpen}
        onAccept={() => {
          setPhotoRequestWarningOpen(false);
          setPhotoUploadDialogOpen(true);
        }}
        onDecline={() => {
          setPhotoRequestWarningOpen(false);
          toast.info('Photo request declined. Your coach will be notified.', {
            description: 'You can upload the photo later from your logbook.'
          });
        }}
        onUploadPhoto={() => {
          setPhotoRequestWarningOpen(false);
          setPhotoUploadDialogOpen(true);
        }}
        viewType={photoRequestViewType}
        targetDate={new Date().toISOString().split('T')[0]}
      />

      {/* Photo Upload Dialog */}
      <PhotoUploadDialog
        open={photoUploadDialogOpen}
        onOpenChange={setPhotoUploadDialogOpen}
        date={new Date().toISOString().split('T')[0]}
        viewType={photoRequestViewType}
        clientName={clientName || 'Client'}
        onSubmit={(photoUrl, notes, viewType) => {
          if (onUploadPhoto) {
            onUploadPhoto(photoUrl, notes, viewType);
          }
          setPhotoUploadDialogOpen(false);
          toast.success('Foto subida exitosamente', {
            description: 'Tu coach ha sido notificado'
          });
        }}
      />

      {/* Edit Notes Dialog */}
      <EditNotesDialog
        open={editNotesDialogOpen}
        onOpenChange={setEditNotesDialogOpen}
        currentNotes={editNotesText}
        date={editNotesDate}
        onSave={(notes) => {
          if (editingNotesId && onUpdateEntry) {
            const entry = entries.find(e => e.id === editingNotesId);
            if (entry) {
              onUpdateEntry({ ...entry, notes });
              toast.success('Nota actualizada');
            }
          }
          setEditingNotesId(null);
          setEditNotesText('');
        }}
      />

      {/* Photo View Dialog */}
      {selectedPhotoEntry && selectedPhotoEntry.photos && selectedPhotoEntry.photos.length > 0 && (
        <Dialog open={!!selectedPhotoEntry} onOpenChange={() => setSelectedPhotoEntry(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Foto - {new Date(selectedPhotoEntry.date + 'T12:00:00').toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {selectedPhotoEntry.photos.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <img 
                      src={photo.url} 
                      alt={`Photo ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                    {photo.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {photo.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Vista: {photo.viewType}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showScanner && (
        <ScannerOverlay 
          onScan={(weight) => {
            setNewWeight(weight.toString());
            toast.success(`Peso detectado: ${weight} ${unit}`);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
