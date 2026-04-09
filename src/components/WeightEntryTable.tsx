import { WeightEntry, Client, NutritionData, Alert, PhysiquePhoto } from '../types/weight-tracker';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { ArrowLeftRight, Info, Apple, MessageSquare, Camera, X, Check, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AddNotesDialog } from './AddNotesDialog';
import { calculateDoubleExponentialMovingAverage, calculateWeeklyRate } from '../utils/weight-calculations';

interface WeightEntryTableProps {
  entries: WeightEntry[];
  unit: 'kg' | 'lbs';
  canEdit: boolean;
  onUpdateEntry?: (entryId: string, updates: Partial<WeightEntry>) => void;
  onMarkLowest?: (entryId: string) => void;
  onMarkHighest?: (entryId: string) => void;
  showCoachControls?: boolean;
  showMovingAverage?: boolean;
  nutritionData?: NutritionData[];
  targetWeeklyRate?: number;
  unreadAlerts?: Alert[];
  physiquePhotos?: PhysiquePhoto[];
}

export function WeightEntryTable({ 
  entries, 
  unit, 
  canEdit,
  onUpdateEntry,
  showCoachControls = false,
  showMovingAverage = true,
  nutritionData = [],
  targetWeeklyRate,
  unreadAlerts = [],
  physiquePhotos = []
}: WeightEntryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [viewNotesId, setViewNotesId] = useState<string | null>(null);
  const [displayUnit, setDisplayUnit] = useState<'kg' | 'lbs'>(unit);
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const [entryToExclude, setEntryToExclude] = useState<string | null>(null);
  const [addNotesDialogOpen, setAddNotesDialogOpen] = useState(false);
  const [selectedEntryForNotes, setSelectedEntryForNotes] = useState<WeightEntry | null>(null);

  // Helper function to check if an entry has unread alerts that should show pulsing effect
  // Only certain alert types should pulse (rate_deviation, lowest, highest, milestone_achieved)
  const hasUnreadAlert = (entryId: string): boolean => {
    return unreadAlerts.some(alert => 
      alert.entryId === entryId && 
      ['rate_deviation', 'lowest', 'highest', 'milestone_achieved'].includes(alert.type)
    );
  };

  // Get the alert for a specific entry
  const getEntryAlert = (entryId: string): Alert | undefined => {
    return unreadAlerts.find(alert => 
      alert.entryId === entryId &&
      ['rate_deviation', 'lowest', 'highest', 'milestone_achieved'].includes(alert.type)
    );
  };

  // Check if there's a photo for this date
  const hasPhotoForDate = (date: string): PhysiquePhoto | undefined => {
    return physiquePhotos.find(photo => photo.date === date && !photo.isExample);
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Recalculate metrics locally for the sorted entries to ensure they are always displayed correctly
  const entriesWithCalculations = sortedEntries.map((entry, index) => {
    // If already has values and not in demo mode, we could skip (but for now, consistency is key)
    const movingAverage = calculateDoubleExponentialMovingAverage(sortedEntries, index);
    const weeklyRate = calculateWeeklyRate(sortedEntries, index);
    
    return {
      ...entry,
      movingAverage: movingAverage || entry.movingAverage,
      weeklyRate: weeklyRate !== 0 ? weeklyRate : (entry.weeklyRate || 0)
    };
  });

  // Group entries by month
  const groupedByMonth: { [key: string]: typeof entriesWithCalculations } = {};
  entriesWithCalculations.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(entry);
  });

  const handleEditStart = (entry: WeightEntry) => {
    setEditingId(entry.id);
    setEditingNotes(entry.notes);
  };

  const handleEditSave = (entryId: string) => {
    if (onUpdateEntry) {
      onUpdateEntry(entryId, { notes: editingNotes });
    }
    setEditingId(null);
    setEditingNotes('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingNotes('');
  };

  const toggleUnit = () => {
    setDisplayUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };

  const convertWeight = (weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs') => {
    if (fromUnit === toUnit) return weight;
    if (toUnit === 'lbs') {
      return weight * 2.20462;
    }
    return weight / 2.20462;
  };

  const getDisplayWeight = (weight: number) => {
    const converted = convertWeight(weight, unit, displayUnit);
    return converted.toFixed(1);
  };

  const getWeeklyRateColor = (rate: number) => {
    if (rate > 0) return 'bg-red-100 text-red-700 border-red-200';
    if (rate < 0) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTargetRateColor = () => {
    if (!targetWeeklyRate) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (targetWeeklyRate > 0) return 'bg-orange-100 text-orange-700 border-orange-300';
    if (targetWeeklyRate < 0) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-purple-100 text-purple-700 border-purple-300';
  };

  const calculateWeightChangePercentage = (currentWeight: number, currentEntry: WeightEntry): string => {
    // Filter out excluded entries
    const includedEntries = sortedEntries.filter(entry => !entry.excludeFromCalculations);
    
    if (includedEntries.length === 0) return '0.0%';
    
    // If current entry is excluded, don't show % change
    if (currentEntry.excludeFromCalculations) return '-';
    
    // Use weekly rate to calculate percentage change relative to DEMA trend
    // This makes % change more stable and aligned with the DEMA-based weekly rate
    if (!currentEntry.weeklyRate || currentEntry.weeklyRate === 0 || !currentEntry.movingAverage || currentEntry.movingAverage === 0) {
      return '0.0%';
    }
    
    // Calculate % change as: (weeklyRate / movingAverage) * 100
    // This shows the rate of change as a percentage of current DEMA
    const percentChange = (currentEntry.weeklyRate / currentEntry.movingAverage) * 100;
    
    return `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00'); // Add time to avoid timezone issues
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    
    return { day, weekday };
  };

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  const getNutritionForEntry = (entry: WeightEntry): NutritionData | undefined => {
    if (!entry.nutritionId) return undefined;
    return nutritionData.find(n => n.id === entry.nutritionId);
  };

  const hasNutritionChange = (entry: WeightEntry, nextEntry?: WeightEntry): boolean => {
    if (!entry.nutritionId) return false;
    if (!nextEntry) return false;
    return entry.nutritionId !== nextEntry.nutritionId;
  };

  const viewedEntry = sortedEntries.find(e => e.id === viewNotesId);

  return (
    <div className="space-y-3">
      {/* Header - Only controls */}
      <div className="flex items-center md:justify-end justify-start gap-2 mb-4 md:mx-0 px-4 md:px-0">
        <Badge variant="outline" className="px-3 py-1">
          {displayUnit.toUpperCase()}
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={toggleUnit}
          className="gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          {displayUnit === 'kg' ? 'View in LBS' : 'View in KG'}
        </Button>
      </div>

      <div className="hidden md:block">
        {/* Desktop Table */}
        {Object.entries(groupedByMonth).map(([monthKey, monthEntries]) => (
          <div key={monthKey} className="mb-8">
            {/* Month Header */}
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 mb-2 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatMonthYear(monthKey)}</h4>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                <div className={`grid ${showMovingAverage ? 'grid-cols-[1fr_2fr_2fr_2fr_1.5fr]' : 'grid-cols-[1fr_2fr_2fr_1.5fr]'} gap-4 text-sm text-gray-700 dark:text-gray-300 items-center`}>
                  <div>Date</div>
                  <div>Recorded</div>
                  {showMovingAverage && <div>Moving Average</div>}
                  <div>Weekly Rate</div>
                  <div>% Change</div>
                </div>
              </div>
              <div className="divide-y">
                {monthEntries.map((entry, index) => {
                  const dateInfo = formatDate(entry.date);
                  const nextEntry = monthEntries[index + 1];
                  const nutrition = getNutritionForEntry(entry);
                  const nutritionChanged = hasNutritionChange(entry, nextEntry);
                  const hasAlert = hasUnreadAlert(entry.id);
                  const entryAlert = getEntryAlert(entry.id);
                  const photo = hasPhotoForDate(entry.date);
                  
                  return (
                    <div 
                      key={entry.id} 
                      className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 relative group transition-colors ${
                        entry.notes ? 'border-l-4 border-l-blue-400 dark:border-l-blue-500' : ''
                      } ${hasAlert ? 'animate-pulse bg-orange-50 dark:bg-orange-950/30' : ''}`}
                      onClick={() => {
                        if (entry.notes) {
                          setViewNotesId(entry.id);
                          setEditingNotes(entry.notes);
                        }
                      }}
                    >
                      {/* Alert indicator - shown when there's an unread alert for this entry */}
                      {hasAlert && entryAlert && (
                        <div 
                          className={`absolute top-1 left-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                            entryAlert.type === 'lowest' ? 'bg-green-500' :
                            entryAlert.type === 'highest' ? 'bg-red-500' :
                            entryAlert.type === 'rate_deviation' ? 'bg-orange-500' :
                            entryAlert.type === 'milestone_achieved' ? 'bg-yellow-500' :
                            entryAlert.type === 'target_streak' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}
                          title={entryAlert.message}
                        />
                      )}
                      
                      <div className={`grid ${showMovingAverage ? 'grid-cols-[1fr_2fr_2fr_2fr_1.5fr]' : 'grid-cols-[1fr_2fr_2fr_1.5fr]'} gap-4 items-center`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-900 dark:text-gray-100">{dateInfo.day}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{dateInfo.weekday}</span>
                            </div>
                            {/* Photo indicator icon */}
                            {photo && (
                              <span
                                className="inline-flex p-1 rounded-full cursor-default"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                          {/* Exclusion toggle button */}
                          {canEdit && onUpdateEntry && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEntryToExclude(entry.id);
                                setExcludeDialogOpen(true);
                              }}
                            >
                              {entry.excludeFromCalculations ? (
                                <X className="w-3.5 h-3.5 text-red-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              )}
                            </Button>
                          )}
                          <span className={entry.excludeFromCalculations ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}>
                            {getDisplayWeight(entry.weight)}
                          </span>
                          {/* Nutrition change indicator */}
                          {nutrition && nutritionChanged && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Apple className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">Nutrition Change</h4>
                                  <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                    <p><strong className="text-gray-900 dark:text-gray-100">Calories:</strong> {nutrition.calories} kcal</p>
                                    <p><strong className="text-gray-900 dark:text-gray-100">Protein:</strong> {nutrition.protein}g</p>
                                    <p><strong className="text-gray-900 dark:text-gray-100">Carbs:</strong> {nutrition.carbs}g</p>
                                    <p><strong className="text-gray-900 dark:text-gray-100">Fats:</strong> {nutrition.fats}g</p>
                                    {nutrition.notes && (
                                      <p className="text-gray-600 dark:text-gray-400 mt-2">{nutrition.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        {showMovingAverage && (
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {entry.movingAverage ? getDisplayWeight(entry.movingAverage) : '-'}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {entry.weeklyRate !== undefined && entry.weeklyRate !== 0 ? (
                            <span className={`text-sm ${
                              entry.weeklyRate > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {entry.weeklyRate > 0 ? '+' : ''}{convertWeight(entry.weeklyRate || 0, unit, displayUnit).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const percentChange = calculateWeightChangePercentage(entry.weight, entry as any);
                            if (percentChange === '-') {
                              return <span className="text-gray-400 dark:text-gray-500">-</span>;
                            }
                            const value = parseFloat(percentChange.replace('%', ''));
                            return (
                              <span className={`${
                                value > 0 ? 'text-red-600 dark:text-red-400' : value < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {percentChange}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Table Style */}
      <div className="md:hidden space-y-6 -mx-4 px-4">
        {Object.entries(groupedByMonth).map(([monthKey, monthEntries]) => (
          <div key={monthKey} className="space-y-3">
            {/* Month Header - Sticky */}
            <div className="sticky top-0 z-10 text-center px-4 py-3 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">{formatMonthYear(monthKey)}</h4>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr] gap-3 px-4 pb-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
              <div>Date</div>
              <div className="text-center">Weight</div>
              <div className="text-center">Weekly</div>
              <div className="text-center">Change</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0 bg-white dark:bg-gray-900">
            {monthEntries.map((entry, index) => {
              const dateInfo = formatDate(entry.date);
              const hasAlert = hasUnreadAlert(entry.id);
              const entryAlert = getEntryAlert(entry.id);

              return (
                <div 
                  key={entry.id} 
                  className={`grid grid-cols-[0.8fr_1fr_1fr_1fr] gap-3 px-4 py-3 items-center border-b border-gray-100 dark:border-gray-800 ${
                    entry.notes ? 'border-l-4 border-l-blue-400 dark:border-l-blue-500' : ''
                  } ${hasAlert ? 'bg-orange-50 dark:bg-orange-950/30' : 'bg-white dark:bg-gray-900'}`}
                  onClick={() => {
                    if (entry.notes) {
                      setSelectedEntryForNotes(entry);
                      setEditingNotes(entry.notes);
                      setAddNotesDialogOpen(true);
                    }
                  }}
                >
                  {/* Date Column */}
                  <div className="text-xs leading-tight">
                    <div className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{dateInfo.day}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wide mt-0.5">{dateInfo.weekday}</div>
                  </div>

                  {/* Recorded Weight */}
                  <div className="text-center flex items-center justify-center gap-1">
                    {canEdit && onUpdateEntry && false && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEntryToExclude(entry.id);
                          setExcludeDialogOpen(true);
                        }}
                      >
                        {entry.excludeFromCalculations ? (
                          <X className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        )}
                      </Button>
                    )}
                    <span className={`text-[14px] ${entry.excludeFromCalculations ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {getDisplayWeight(entry.weight)}
                    </span>
                  </div>

                  {/* Weekly Rate */}
                  <div className="text-center text-[14px]">
                    {entry.weeklyRate !== undefined && entry.weeklyRate !== 0 ? (
                      <span className={`${
                        entry.weeklyRate > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {entry.weeklyRate > 0 ? '+' : ''}{convertWeight(entry.weeklyRate || 0, unit, displayUnit).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </div>

                  {/* % Change */}
                  <div className="text-center text-[14px]">
                    {(() => {
                      const percentChange = calculateWeightChangePercentage(entry.weight, entry as any);
                      if (percentChange === '-') {
                        return <span className="text-gray-400 dark:text-gray-500">0.0%</span>;
                      }
                      const value = parseFloat(percentChange.replace('%', ''));
                      return (
                        <span className={`${
                          value > 0 ? 'text-red-600 dark:text-red-400' : value < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {value > 0 ? '+' : ''}{percentChange}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/View Notes Dialog */}
      <Dialog open={editingId !== null || viewNotesId !== null} onOpenChange={(open) => {
        if (!open) {
          setEditingId(null);
          setViewNotesId(null);
          setEditingNotes('');
        }
      }}>
        <DialogContent className={`${canEdit ? 'bg-white dark:bg-gray-900' : 'max-w-md p-4 bg-white dark:bg-gray-900'}`}>
          {canEdit && (
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Edit Notes</DialogTitle>
            </DialogHeader>
          )}
          <div className={canEdit ? 'space-y-4' : ''}>
            <Textarea
              value={editingNotes}
              onChange={(e) => canEdit && setEditingNotes(e.target.value)}
              placeholder={canEdit ? "Add notes about this entry..." : ""}
              rows={canEdit ? 4 : 3}
              disabled={!canEdit}
              className={!canEdit ? 'bg-gray-50 dark:bg-gray-800 cursor-default text-sm resize-none border-0 p-2 text-gray-900 dark:text-gray-100' : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'}
            />
            {canEdit && (
              <div className="flex gap-2">
                <Button onClick={() => handleEditSave(editingId || viewNotesId || '')} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exclude from Calculations Confirmation Dialog */}
      <AlertDialog open={excludeDialogOpen} onOpenChange={setExcludeDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              {entries.find(e => e.id === entryToExclude)?.excludeFromCalculations 
                ? 'Include in Calculations?' 
                : 'Exclude from Calculations?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {entries.find(e => e.id === entryToExclude)?.excludeFromCalculations
                ? 'This weight entry will be included in moving average and weekly rate calculations.'
                : 'This weight entry will be excluded from moving average and weekly rate calculations. The recorded weight will be shown in red.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEntryToExclude(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entryToExclude && onUpdateEntry) {
                  const entry = entries.find(e => e.id === entryToExclude);
                  onUpdateEntry(entryToExclude, { excludeFromCalculations: !entry?.excludeFromCalculations });
                }
                setEntryToExclude(null);
                setExcludeDialogOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Notes Dialog - Full Screen for Mobile */}
      <AddNotesDialog
        isOpen={addNotesDialogOpen}
        onClose={() => {
          setAddNotesDialogOpen(false);
          setSelectedEntryForNotes(null);
          setEditingNotes('');
        }}
        onSave={(notes) => {
          if (selectedEntryForNotes && onUpdateEntry) {
            onUpdateEntry(selectedEntryForNotes.id, { notes });
          }
        }}
        initialNotes={editingNotes}
        weight={selectedEntryForNotes?.weight || 0}
        date={selectedEntryForNotes?.date || ''}
        unit={displayUnit}
      />
    </div>
  );
}
