import { useState, useEffect } from 'react';
import { Client, Coach, WeightEntry, Alert, User } from '../types/weight-tracker';
import { mockCoach, mockAlerts, mockUsers } from '../utils/mock-data';
import { recalculateAllWeeklyRates, findLowestAndHighestWeights, checkRateDeviation } from '../utils/weight-calculations';

const STORAGE_KEYS = {
  COACH_DATA: 'weight_tracker_coach',
  ALERTS: 'weight_tracker_alerts',
  CURRENT_USER: 'weight_tracker_current_user'
};

export function useWeightTracker() {
  const [coach, setCoach] = useState<Coach>(() => {
    // Initialize coach with recalculated entries
    const initialCoach = {
      ...mockCoach,
      clients: mockCoach.clients.map(client => ({
        ...client,
        weightEntries: recalculateAllWeeklyRates(client.weightEntries)
      }))
    };
    return initialCoach;
  });
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to coach
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCoach = localStorage.getItem(STORAGE_KEYS.COACH_DATA);
    const savedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (savedCoach) {
      setCoach(JSON.parse(savedCoach));
    }
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COACH_DATA, JSON.stringify(coach));
  }, [coach]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const addWeightEntry = (clientId: string, entry: Omit<WeightEntry, 'id'>) => {
    setLoading(true);
    
    const newEntry: WeightEntry = {
      ...entry,
      id: Date.now().toString()
    };

    setCoach(prevCoach => {
      const updatedClients = prevCoach.clients.map(client => {
        if (client.id === clientId) {
          const updatedEntries = [...client.weightEntries, newEntry];
          
          // Sort entries by date for correct calculations
          const sortedEntries = updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          // Calculate moving averages and weekly rates
          const recalculatedEntries = recalculateAllWeeklyRates(sortedEntries);
          
          // Check for new lowest/highest weights
          const { lowest, highest } = findLowestAndHighestWeights(recalculatedEntries);
          const currentEntry = recalculatedEntries[recalculatedEntries.length - 1];
          
          // Generate alerts based on notification settings
          const newAlerts: Alert[] = [];
          
          if ((client.notifyLowest !== false) && lowest && lowest.id === currentEntry.id) {
            newAlerts.push({
              id: `alert_${Date.now()}_lowest`,
              clientId,
              type: 'lowest',
              message: `${client.name} has reached a new lowest weight: ${currentEntry.weight.toFixed(1)} ${client.unit}`,
              date: currentEntry.date,
              isRead: false
            });
          }
          
          if ((client.notifyHighest !== false) && highest && highest.id === currentEntry.id) {
            newAlerts.push({
              id: `alert_${Date.now()}_highest`,
              clientId,
              type: 'highest',
              message: `${client.name} has reached a new highest weight: ${currentEntry.weight.toFixed(1)} ${client.unit}`,
              date: currentEntry.date,
              isRead: false
            });
          }
          
          // Check for rate deviation
          if ((client.notifyRateDeviation !== false) && currentEntry.weeklyRate && checkRateDeviation(currentEntry.weeklyRate, client.targetWeeklyRate, 0.2)) {
            newAlerts.push({
              id: `alert_${Date.now()}_rate`,
              clientId,
              type: 'rate_deviation',
              message: `${client.name}'s weekly rate (${currentEntry.weeklyRate > 0 ? '+' : ''}${currentEntry.weeklyRate.toFixed(2)} ${client.unit}) deviates from target (${client.targetWeeklyRate > 0 ? '+' : ''}${client.targetWeeklyRate.toFixed(1)} ${client.unit})`,
              date: currentEntry.date,
              isRead: false,
              entryId: currentEntry.id
            });
          }
          
          // Check for milestone achievement
          if (client.milestone && !client.milestoneAchieved) {
            const milestoneReached = client.targetWeeklyRate < 0 
              ? currentEntry.weight <= client.milestone
              : currentEntry.weight >= client.milestone;
              
            if (milestoneReached) {
              newAlerts.push({
                id: `alert_${Date.now()}_milestone`,
                clientId,
                type: 'milestone_achieved',
                message: `${client.name} has achieved their milestone: ${client.milestone.toFixed(1)} ${client.unit}`,
                date: currentEntry.date,
                isRead: false,
                entryId: currentEntry.id
              });
              
              // Update client milestone achieved status
              client.milestoneAchieved = true;
            }
          }
          
          // Check for 7-day target rate streak
          if (recalculatedEntries.length >= 7) {
            const last7Entries = recalculatedEntries.slice(0, 7);
            const tolerance = 0.2; // 20% tolerance
            const allWithinTarget = last7Entries.every(entry => {
              if (!entry.weeklyRate) return false;
              return !checkRateDeviation(entry.weeklyRate, client.targetWeeklyRate, tolerance);
            });
            
            if (allWithinTarget) {
              newAlerts.push({
                id: `alert_${Date.now()}_streak`,
                clientId,
                type: 'target_streak',
                message: `${client.name} has maintained target rate for 7 consecutive days!`,
                date: currentEntry.date,
                isRead: false,
                entryId: currentEntry.id
              });
            }
          }
          
          // Add new alerts
          if (newAlerts.length > 0) {
            setAlerts(prevAlerts => [...prevAlerts, ...newAlerts]);
          }
          
          return {
            ...client,
            weightEntries: recalculatedEntries
          };
        }
        return client;
      });

      return {
        ...prevCoach,
        clients: updatedClients
      };
    });
    
    setLoading(false);
  };

  const updateWeightEntry = (clientId: string, entryId: string, updates: Partial<WeightEntry>, modifiedBy: 'coach' | 'client' = 'client') => {
    setCoach(prevCoach => {
      const updatedClients = prevCoach.clients.map(client => {
        if (client.id === clientId) {
          const originalEntry = client.weightEntries.find(e => e.id === entryId);
          const updatedEntries = client.weightEntries.map(entry => 
            entry.id === entryId ? { ...entry, ...updates } : entry
          );
          
          // Sort entries by date for correct calculations
          const sortedEntries = updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          // Calculate moving averages and weekly rates
          const recalculatedEntries = recalculateAllWeeklyRates(sortedEntries);
          
          // Generate alert ONLY if coach modified weight (not just notes) and notifications enabled
          const weightWasModified = updates.weight !== undefined && originalEntry && updates.weight !== originalEntry.weight;
          if ((client.notifyWeightModified !== false) && modifiedBy === 'client' && weightWasModified && originalEntry) {
            const alert: Alert = {
              id: `alert_${Date.now()}_modified`,
              clientId,
              type: 'weight_modified',
              message: `${client.name} modified a weight entry from ${originalEntry.weight.toFixed(1)} to ${updates.weight!.toFixed(1)} ${client.unit}`,
              date: new Date().toISOString().split('T')[0],
              isRead: false
            };
            
            setAlerts(prevAlerts => [...prevAlerts, alert]);
          }

          // If coach modified weight, notify the client
          if (modifiedBy === 'coach' && weightWasModified && originalEntry) {
            const clientNotification = {
              id: `notif_${Date.now()}`,
              type: 'weight_modified' as const,
              message: `Your coach modified your weight entry from ${originalEntry.weight.toFixed(1)} to ${updates.weight!.toFixed(1)} ${client.unit}`,
              date: new Date().toISOString().split('T')[0],
              isRead: false,
              data: { originalWeight: originalEntry.weight, newWeight: updates.weight, date: originalEntry.date }
            };

            return {
              ...client,
              weightEntries: recalculatedEntries,
              notifications: [...(client.notifications || []), clientNotification]
            };
          }
          
          return {
            ...client,
            weightEntries: recalculatedEntries
          };
        }
        return client;
      });

      return {
        ...prevCoach,
        clients: updatedClients
      };
    });
  };

  const updateTargetWeeklyRate = (clientId: string, targetRate: number) => {
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(client => {
        if (client.id === clientId) {
          const notification = {
            id: `notif_${Date.now()}`,
            type: 'target_rate_changed' as const,
            message: `Your coach updated your target rate to ${targetRate > 0 ? '+' : ''}${targetRate.toFixed(1)} ${client.unit}/week`,
            date: new Date().toISOString().split('T')[0],
            isRead: false,
            data: { oldTarget: client.targetWeeklyRate, newTarget: targetRate }
          };

          return {
            ...client,
            targetWeeklyRate: targetRate,
            notifications: [...(client.notifications || []), notification]
          };
        }
        return client;
      })
    }));
  };

  const updateNotificationSettings = (clientId: string, settings: { notifyLowest?: boolean; notifyHighest?: boolean; notifyRateDeviation?: boolean; notifyWeightModified?: boolean; milestone?: number; reminderEnabled?: boolean; reminderTime?: string; showMovingAverage?: boolean; photoRequests?: any[] }) => {
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(client =>
        client.id === clientId ? { ...client, ...settings } : client
      )
    }));
  };

  const requestPhoto = (clientId: string, targetDate: string, viewType: 'front' | 'side' | 'back') => {
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(client => {
        if (client.id === clientId) {
          const newRequest = {
            id: `photo_req_${Date.now()}`,
            requestedDate: new Date().toISOString().split('T')[0],
            targetDate,
            status: 'pending' as const,
            viewType
          };
          
          // Create example photo automatically
          const examplePhoto = {
            id: `photo_example_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            photoUrl: 'https://images.unsplash.com/photo-1732535835521-8e8c30e47330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwcHJvZ3Jlc3MlMjBtaXJyb3IlMjBwaG90b3xlbnwxfHx8fDE3NjAxMDIwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
            uploadedAt: new Date().toISOString(),
            notes: 'This is an example photo showing proper form and lighting',
            viewType,
            isExample: true
          };
          
          // Create notification for client
          const notification = {
            id: `notif_${Date.now()}`,
            type: 'photo_requested' as const,
            message: `Your coach has requested a ${viewType} view photo for ${new Date(targetDate).toLocaleDateString()}`,
            date: new Date().toISOString().split('T')[0],
            isRead: false,
            data: { viewType, targetDate }
          };
          
          return {
            ...client,
            photoRequests: [...(client.photoRequests || []), newRequest],
            physiquePhotos: [...(client.physiquePhotos || []), examplePhoto],
            notifications: [...(client.notifications || []), notification]
          };
        }
        return client;
      })
    }));
  };

  const uploadPhoto = (clientId: string, photoUrl: string, notes: string, viewType?: 'front' | 'side' | 'back') => {
    // Get client info before state update
    const client = coach.clients.find(c => c.id === clientId);
    if (!client) {
      console.error('Client not found');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);
    const day = String(todayDate.getDate()).padStart(2, '0');
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const year = todayDate.getFullYear();
    const dateFormatted = `${day}-${month}-${year}`;
    
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(c => {
        if (c.id === clientId) {
          const newPhoto = {
            id: `photo_${Date.now()}`,
            date: today,
            photoUrl,
            uploadedAt: new Date().toISOString(),
            notes,
            viewType,
            isExample: false,
            fileName: `${dateFormatted}_${viewType || 'photo'}.jpg`
          };
          
          // Mark the corresponding photo request as completed (including declined ones)
          const updatedRequests = (c.photoRequests || []).map(req => {
            if ((req.status === 'pending' || req.status === 'declined') && req.viewType === viewType) {
              return {
                ...req,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                photoId: newPhoto.id
              };
            }
            return req;
          });
          
          return {
            ...c,
            physiquePhotos: [...(c.physiquePhotos || []), newPhoto],
            photoRequests: updatedRequests
          };
        }
        return c;
      })
    }));

    // Create alert for coach
    const newAlert: Alert = {
      id: `alert_${Date.now()}`,
      clientId,
      type: 'photo_uploaded',
      message: `${client.name} uploaded a ${viewType || 'physique'} photo`,
      date: today,
      isRead: false,
      photoUrl
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  const markLowestWeight = (clientId: string, entryId: string) => {
    updateWeightEntry(clientId, entryId, { isLowest: true });
  };

  const markHighestWeight = (clientId: string, entryId: string) => {
    updateWeightEntry(clientId, entryId, { isHighest: true });
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const getClientById = (clientId: string): Client | undefined => {
    return coach.clients.find(client => client.id === clientId);
  };

  const getCurrentClient = (): Client | undefined => {
    if (currentUser.role === 'client') {
      return getClientById(currentUser.id);
    }
    return undefined;
  };

  const addNutritionData = (clientId: string, nutritionData: Omit<import('../types/weight-tracker').NutritionData, 'id'>) => {
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(client => {
        if (client.id === clientId) {
          const newNutrition = {
            ...nutritionData,
            id: `nutrition_${Date.now()}`
          };

          // Update all weight entries from this date onwards with the new nutrition ID
          const updatedEntries = client.weightEntries.map(entry => {
            if (new Date(entry.date) >= new Date(nutritionData.startDate)) {
              return { ...entry, nutritionId: newNutrition.id };
            }
            return entry;
          });

          return {
            ...client,
            nutritionData: [...(client.nutritionData || []), newNutrition],
            weightEntries: updatedEntries
          };
        }
        return client;
      })
    }));
  };

  const markClientNotificationAsRead = (clientId: string, notificationId: string) => {
    setCoach(prevCoach => ({
      ...prevCoach,
      clients: prevCoach.clients.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            notifications: (client.notifications || []).map(notif =>
              notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
          };
        }
        return client;
      })
    }));
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return {
    coach,
    alerts,
    unreadAlerts,
    currentUser,
    loading,
    addWeightEntry,
    updateWeightEntry,
    updateTargetWeeklyRate,
    markLowestWeight,
    markHighestWeight,
    markAlertAsRead,
    updateNotificationSettings,
    requestPhoto,
    uploadPhoto,
    addNutritionData,
    markClientNotificationAsRead,
    switchUser,
    getClientById,
    getCurrentClient
  };
}