import { useState } from 'react';
import { Coach, Client } from '../types/weight-tracker';
import { WeightChart } from './WeightChart';
import { WeightEntryTable } from './WeightEntryTable';
import { AlertsPanel } from './AlertsPanel';
import { MobileNotificationsButton } from './MobileNotificationsButton';
import { PhotoRequestDialog } from './PhotoRequestDialog';
import { NutritionDialog } from './NutritionDialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { calculateDoubleExponentialMovingAverage, calculateWeeklyRate } from '../utils/weight-calculations';
import { Users, Scale, Settings, ChevronDown, ChevronUp, BookOpen, PlayCircle, Info, Camera, MoreVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast, Toaster } from 'sonner';

interface CoachDashboardProps {
  coach: Coach;
  alerts: any[];
  unreadAlerts: any[];
  onUpdateEntry: (clientId: string, entryId: string, updates: any) => void;
  onMarkLowest: (clientId: string, entryId: string) => void;
  onMarkHighest: (clientId: string, entryId: string) => void;
  onUpdateTargetRate: (clientId: string, targetRate: number) => void;
  onMarkAlertAsRead: (alertId: string) => void;
  onUpdateNotificationSettings?: (clientId: string, settings: { notifyLowest?: boolean; notifyHighest?: boolean; milestone?: number }) => void;
  onRequestPhoto?: (clientId: string, targetDate: string, viewType: 'front' | 'side' | 'back') => void;
}

export function CoachDashboard({
  coach,
  alerts,
  unreadAlerts,
  onUpdateEntry,
  onUpdateTargetRate,
  onMarkAlertAsRead,
  onUpdateNotificationSettings,
  onRequestPhoto
}: CoachDashboardProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [targetRateInput, setTargetRateInput] = useState('');
  const [targetRateSign, setTargetRateSign] = useState<'+' | '-'>('-');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [photoRequestDialogOpen, setPhotoRequestDialogOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleUpdateTargetRate = (clientId: string, clientName: string) => {
    const value = parseFloat(targetRateInput);
    
    if (isNaN(value) || value === 0) {
      toast.error('Invalid input', {
        description: 'Please enter a valid number'
      });
      return;
    }

    // Validation: value must be < 10 and have max 1 decimal
    if (value >= 10) {
      toast.error('Invalid input', {
        description: 'Target rate must be less than 10'
      });
      return;
    }

    // Check max 1 decimal place
    const decimalPart = targetRateInput.split('.')[1];
    if (decimalPart && decimalPart.length > 1) {
      toast.error('Invalid input', {
        description: 'Maximum 1 decimal place allowed'
      });
      return;
    }

    // Apply sign
    const rate = targetRateSign === '+' ? Math.abs(value) : -Math.abs(value);
    
    onUpdateTargetRate(clientId, rate);
    setTargetRateInput('');
    setTargetRateSign('-');
    setSettingsDialogOpen(false);
    
    toast.success('Configuración actualizada', {
      description: `Tasa objetivo para ${clientName} actualizada a ${rate > 0 ? '+' : ''}${rate.toFixed(1)}`
    });
  };

  const handleNotificationToggle = (clientId: string, field: 'notifyLowest' | 'notifyHighest' | 'notifyRateDeviation' | 'notifyWeightModified', value: boolean) => {
    if (onUpdateNotificationSettings) {
      onUpdateNotificationSettings(clientId, { [field]: value });
    }
  };

  const isRateOutOfRange = (weeklyRate: number, targetRate: number): boolean => {
    // Tolerance of ±0.3 from target
    const tolerance = 0.3;
    const lowerBound = targetRate - tolerance;
    const upperBound = targetRate + tolerance;
    
    return weeklyRate < lowerBound || weeklyRate > upperBound;
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time portions for accurate day comparison
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays === 2) return '2 days ago';
    if (diffDays === 3) return '3 days ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return `${weeks} weeks ago`;
    
    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
  };

  const getClientStats = (client: Client) => {
    if (!client.weightEntries || client.weightEntries.length === 0) {
      return {
        currentWeight: 0,
        movingAverage: 0,
        weeklyRate: 0,
        lastWeighed: null,
        entriesCount: 0
      };
    }
    
    const sortedEntries = [...client.weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const movingAverage = calculateDoubleExponentialMovingAverage(sortedEntries, 0);
    const weeklyRate = calculateWeeklyRate(sortedEntries, 0);
    const latestEntry = sortedEntries[0];

    return {
      currentWeight: latestEntry?.weight || 0,
      movingAverage,
      weeklyRate: weeklyRate !== 0 ? weeklyRate : (latestEntry?.weeklyRate || 0),
      lastWeighed: latestEntry?.date || null,
      entriesCount: client.weightEntries.length
    };
  };

  const getWeeklyRateColor = (rate: number) => {
    if (rate > 0) return 'text-red-600 bg-red-50';
    if (rate < 0) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleViewClient = (clientId: string) => {
    const client = coach.clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowChart(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-6">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden sm:flex justify-end items-center">
        <Button variant="outline" size="sm" className="gap-2">
          <PlayCircle className="w-4 h-4" />
          Módulos de Entrenamiento
        </Button>
      </div>

      {/* Main Layout: Clients Overview (Left) + Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-6">
        {/* Clients Overview - Full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <CardHeader className="hidden sm:block pb-3">
              <CardTitle className="dark:text-white">Resumen de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="grid gap-0 sm:gap-2">
                {coach.clients.map((client) => {
                  const stats = getClientStats(client);
                  
                  // Check if there are unread alerts for this client
                  const hasUnreadAlerts = unreadAlerts.some(alert => alert.clientId === client.id);
                  const clientAlerts = unreadAlerts.filter(alert => alert.clientId === client.id);
                  
                  return (
                    <div
                      key={client.id}
                      className="p-4 mb-3 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md dark:border-gray-700 transition-all cursor-pointer relative overflow-hidden group"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowChart(true);
                      }}
                    >
                      {/* Decorative gradient corner for 'Lowest' players */}
                      {client.weightEntries.some(e => e.isLowest) && (
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-green-500 rotate-45 opacity-20" />
                      )}

                      
                      {/* Mobile Layout: Vertical */}
                      <div className="sm:hidden">
                        {/* Name row with notification indicator */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1">
                            <h3 className="truncate">{client.name}</h3>
                            {hasUnreadAlerts && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                              setSettingsDialogOpen(true);
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Badges row */}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <Badge variant="outline" className="gap-1 h-6 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900 border-0 rounded-full">
                            <Scale className="w-3 h-3 text-blue-500" />
                            <span className="font-bold text-gray-900 dark:text-gray-100">{stats.currentWeight.toFixed(1)} {client.unit}</span>
                          </Badge>
                          
                          <Badge variant="outline" className={`gap-1 h-6 border-0 rounded-full ${stats.weeklyRate < 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            <span className="font-bold">{stats.weeklyRate > 0 ? '+' : ''}{stats.weeklyRate.toFixed(2)} {client.unit}</span>
                          </Badge>
                          
                          {client.weightEntries.some(e => e.isLowest) && (
                            <Badge className="h-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-0 font-bold rounded-full animate-pulse">
                              LOWEST ✨
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout: Responsive with stacking */}
                      <div className="hidden sm:block">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          {/* Client Name with notification */}
                          <div className="min-w-0 flex-shrink-0 flex items-center gap-1">
                            <h3 className="text-sm truncate">{client.name}</h3>
                            {hasUnreadAlerts && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 flex-shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClient(client);
                                setSettingsDialogOpen(true);
                              }}
                            >
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Stats - All inline with badges, wrapping enabled */}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <Badge variant="outline" className="gap-1 h-6 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Weight</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.currentWeight.toFixed(1)} {client.unit}</span>
                          </Badge>
                          
                          <Badge variant="outline" className="gap-1 h-6 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Rate</span>
                            {stats.weeklyRate !== 0 ? (
                              <span className={
                                isRateOutOfRange(stats.weeklyRate, client.targetWeeklyRate)
                                  ? 'text-red-600 dark:text-red-400 font-semibold'
                                  : stats.weeklyRate > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400 font-semibold'
                              }>
                                {stats.weeklyRate > 0 ? '+' : ''}{stats.weeklyRate.toFixed(2)}
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-900 dark:text-gray-100">-</span>
                            )}
                          </Badge>
                          
                          <Badge variant="outline" className="gap-1 h-6 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
                            <span className="text-amber-600 dark:text-amber-400 font-medium">Target</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{client.targetWeeklyRate > 0 ? '+' : ''}{client.targetWeeklyRate.toFixed(1)}</span>
                          </Badge>
                          
                          <Badge variant="outline" className="gap-1 h-6 bg-slate-50 border-slate-200 dark:bg-slate-950/30 dark:border-slate-900">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Last</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{getRelativeTime(stats.lastWeighed)}</span>
                          </Badge>
                          
                          {client.milestone && (
                            <Badge variant="outline" className="gap-1 h-6 bg-purple-50 border-purple-300 dark:bg-purple-950/30 dark:border-purple-900">
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Milestone</span>
                              <span className={client.milestoneAchieved ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-purple-700 dark:text-purple-300 font-semibold'}>
                                {client.milestone.toFixed(1)} {client.unit}
                                {client.milestoneAchieved && ' ✓'}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel - 1/3 width, hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1">
          <AlertsPanel
            alerts={alerts}
            unreadAlerts={unreadAlerts}
            onMarkAsRead={onMarkAlertAsRead}
            onViewClient={handleViewClient}
          />
        </div>
      </div>

      {/* Settings Dialog - Shared between mobile and desktop */}
      {selectedClient && settingsDialogOpen && (
        <Dialog open={settingsDialogOpen} onOpenChange={(open) => {
          setSettingsDialogOpen(open);
          if (!open) {
            setSelectedClient(null);
          }
        }}>
          <DialogContent className="p-0 gap-0 max-w-[95vw] sm:p-6 sm:gap-6 sm:max-w-lg bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <DialogHeader className="hidden sm:block">
              <DialogTitle className="text-gray-900 dark:text-white">Configuración - {selectedClient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4 sm:p-0">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <Label htmlFor="targetRate" className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                    Tasa Semanal Objetivo ({selectedClient.unit}/semana)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="inline-flex">
                            <Info className="w-3 h-3 text-gray-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>Selecciona + para ganancia o - para pérdida de peso. Ingresa un valor menor a 10 con máximo 1 decimal.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:hidden">
                  Selecciona + para ganancia o - para pérdida de peso. Ingresa un valor menor a 10 con máximo 1 decimal.
                </p>
                <div className="flex gap-2">
                  <Select
                    value={targetRateSign}
                    onValueChange={(value: '+' | '-') => setTargetRateSign(value)}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="+">+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="targetRate"
                    type="text"
                    placeholder="0.0"
                    value={targetRateInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers and one decimal point
                      // Max one digit before decimal, max 2 after decimal
                      // Number must be less than 10
                      if (/^[0-9]?\.?[0-9]{0,2}$/.test(value) || value === '') {
                        const num = parseFloat(value);
                        if (value === '' || (num >= 0 && num < 10)) {
                          setTargetRateInput(value);
                        }
                      }
                    }}
                    maxLength={4}
                    className="flex-1"
                  />
                  <Button onClick={() => handleUpdateTargetRate(selectedClient.id, selectedClient.name)}>
                    Actualizar
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between mb-1">
                  <Label htmlFor="milestone" className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                    Meta de Peso ({selectedClient.unit})
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="inline-flex">
                            <Info className="w-3 h-3 text-gray-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>Establece una meta de peso para este cliente. Será notificado cuando la alcance.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:hidden">
                  Establece una meta de peso para este cliente. Será notificado cuando la alcance.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="milestone"
                    type="text"
                    placeholder={selectedClient.milestone?.toString() || 'Establecer meta'}
                    value={milestoneInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,3}\.?\d{0,1}$/.test(value) || value === '') {
                        setMilestoneInput(value);
                      }
                    }}
                    maxLength={6}
                  />
                  <Button onClick={() => {
                    const milestone = parseFloat(milestoneInput);
                    if (!isNaN(milestone) && milestone > 0) {
                      // Check if milestone already achieved - don't allow multiple milestones
                      if (selectedClient.milestoneAchieved && selectedClient.milestone !== milestone) {
                        toast.error('No se puede establecer nueva meta', {
                          description: 'Meta anterior ya alcanzada. Elimínala primero antes de establecer una nueva.'
                        });
                        return;
                      }
                      
                      if (onUpdateNotificationSettings) {
                        onUpdateNotificationSettings(selectedClient.id, { milestone });
                      }
                      setMilestoneInput('');
                      toast.success('Meta actualizada', {
                        description: `Meta establecida en ${milestone.toFixed(1)} ${selectedClient.unit}`
                      });
                    }
                  }}>
                    Actualizar
                  </Button>
                </div>
                {selectedClient.milestone && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Meta actual: {selectedClient.milestone.toFixed(1)} {selectedClient.unit}
                    {selectedClient.milestoneAchieved && ' ✓ Alcanzada'}
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm text-gray-900 dark:text-white">Configuración de Notificaciones</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-gray-100">Peso Lowest</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recibir alerta cuando el cliente alcance un nuevo peso mínimo
                    </p>
                  </div>
                  <Switch
                    checked={selectedClient.notifyLowest !== false}
                    onCheckedChange={(checked) => handleNotificationToggle(selectedClient.id, 'notifyLowest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-gray-100">Peso Highest</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recibir alerta cuando el cliente alcance un nuevo peso máximo
                    </p>
                  </div>
                  <Switch
                    checked={selectedClient.notifyHighest !== false}
                    onCheckedChange={(checked) => handleNotificationToggle(selectedClient.id, 'notifyHighest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-gray-100">Desviación de Tasa</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recibir alerta cuando la tasa se desvíe significativamente del objetivo
                    </p>
                  </div>
                  <Switch
                    checked={selectedClient.notifyRateDeviation !== false}
                    onCheckedChange={(checked) => handleNotificationToggle(selectedClient.id, 'notifyRateDeviation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-900 dark:text-gray-100">Peso Modificado</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recibir alerta cuando el cliente modifique una entrada de peso existente
                    </p>
                  </div>
                  <Switch
                    checked={selectedClient.notifyWeightModified !== false}
                    onCheckedChange={(checked) => handleNotificationToggle(selectedClient.id, 'notifyWeightModified', checked)}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Client Detail Modal */}
      {selectedClient && !settingsDialogOpen && (
        <Dialog open={!!selectedClient && !settingsDialogOpen} onOpenChange={() => {
          setSelectedClient(null);
          setShowChart(false);
        }}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            {/* Desktop Header */}
            <DialogHeader className="hidden sm:block">
              <DialogTitle className="text-gray-900 dark:text-white">
                {selectedClient.name} - Weight Analysis
              </DialogTitle>
            </DialogHeader>
            
            {/* Mobile Header - Just name and button */}
            <div className="sm:hidden">
              <DialogTitle className="mb-3 text-gray-900 dark:text-white">{selectedClient.name}</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full"
                onClick={() => setPhotoRequestDialogOpen(true)}
              >
                <Camera className="w-4 h-4" />
                Request Photo
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Action Buttons - Desktop only */}
              <div className="hidden sm:flex justify-start items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setPhotoRequestDialogOpen(true)}
                >
                  <Camera className="w-4 h-4" />
                  Request Photo
                </Button>
                {selectedClient.physiquePhotos && selectedClient.physiquePhotos.length > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Camera className="w-3 h-3" />
                    {selectedClient.physiquePhotos.length} photos
                  </Badge>
                )}
              </div>

              {showChart && selectedClient.weightEntries.length > 0 && (
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 sm:px-6">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-widest">Tendencia de Peso</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-6">
                    <div className="h-[250px] w-full">
                      <WeightChart 
                        entries={selectedClient.weightEntries} 
                        unit={selectedClient.unit}
                        showMovingAverage={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weight Entries Table */}
              {selectedClient.weightEntries.length > 0 && (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="pt-6 md:px-6 px-0">
                    <WeightEntryTable
                      entries={selectedClient.weightEntries}
                      unit={selectedClient.unit}
                      canEdit={true}
                      onUpdateEntry={(entryId, updates) => onUpdateEntry(selectedClient.id, entryId, updates)}
                      showCoachControls={true}
                      showMovingAverage={selectedClient.showMovingAverage !== false}
                      nutritionData={selectedClient.nutritionData || []}
                      targetWeeklyRate={selectedClient.targetWeeklyRate}
                      unreadAlerts={unreadAlerts.filter(alert => alert.clientId === selectedClient.id)}
                      physiquePhotos={selectedClient.physiquePhotos}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Photo Request Dialog */}
      {selectedClient && onRequestPhoto && (
        <PhotoRequestDialog
          open={photoRequestDialogOpen}
          onOpenChange={setPhotoRequestDialogOpen}
          clientName={selectedClient.name}
          onSubmit={(targetDate, viewType) => {
            onRequestPhoto(selectedClient.id, targetDate, viewType);
            toast.success('Photo request sent', {
              description: `${selectedClient.name} will be prompted to upload a photo (${viewType}) on ${new Date(targetDate).toLocaleDateString()}`
            });
          }}
        />
      )}
    </div>
  );
}