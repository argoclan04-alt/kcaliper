import { useState, useEffect, useRef } from 'react';
import { Client, Coach, WeightEntry, Alert, User, NutritionData, ClientNotification } from '../types/weight-tracker';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { mockUsers, mockCoach, mockAlerts } from '../utils/mock-data';
import { estebanCoach, estebanAlerts, estebanUsers } from '../utils/mock-data-esteban';

// Helper for UI-friendly IDs and formatting preserved from calculations
import { recalculateAllWeeklyRates, findLowestAndHighestWeights, checkRateDeviation } from '../utils/weight-calculations';
import { CaliBotEngine } from '../lib/calibot/engine';
import { CaliBotAnalysis } from '../lib/calibot/types';

export function useWeightTracker() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [latestAnalysis, setLatestAnalysis] = useState<CaliBotAnalysis | null>(null);
  const isMockMode = useRef<boolean>(false);

  // Load real data from Supabase on mount
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Check which account is logged in via our frontend auth
        const accountId = localStorage.getItem('kcaliper_account') || 'argo';
        console.log(`Entering Demo Mode (Account: ${accountId})`);
        await initializeMockMode(accountId);
        return;
      }

      await loadUserData(session.user.id);
    }

    async function loadUserData(userId: string) {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profile) {
        setLoading(false);
        return;
      }
      
      // CHECK IF ACCOUNT IS AN INFLUENCER OR DEMO (Seeds the mock data)
      const { data: influencer } = await supabase
        .from('influencers')
        .select('email')
        .eq('email', profile.email)
        .maybeSingle();

      const isInfluencer = !!influencer || profile.email.includes('esteban@');

      if (isInfluencer) {
        console.log("Influencer Account Detected! Seeding Mock Data...");
        await initializeMockMode(userId, true, profile.full_name, profile.email);
        return;
      }

      setCurrentUser(profile as User);

      // 2. Separate logic by Role
      if (profile.role === 'coach') {
        const coachId = profile.id;
        const { data: clientsSettings } = await supabase.from('client_settings').select('*').eq('coach_id', coachId);
        
        let formattedClients: any[] = [];
        
        if (clientsSettings && clientsSettings.length > 0) {
          const clientIds = clientsSettings.map(s => s.id);

          const [
            { data: clientProfiles },
            { data: allEntries },
            { data: allPhotos },
            { data: allRequests },
            { data: allPlans }
          ] = await Promise.all([
            supabase.from('profiles').select('*').in('id', clientIds),
            supabase.from('weight_entries').select('*').in('client_id', clientIds).order('date', { ascending: false }),
            supabase.from('physique_photos').select('*').in('client_id', clientIds),
            supabase.from('photo_requests').select('*').in('client_id', clientIds),
            supabase.from('nutrition_plans').select('*').in('client_id', clientIds)
          ]);

          formattedClients = clientsSettings.map((s: any) => {
            const cProf = clientProfiles?.find(p => p.id === s.id) || {};
            const entries = allEntries?.filter(e => e.client_id === s.id) || [];
            const photos = allPhotos?.filter(p => p.client_id === s.id) || [];
            const requests = allRequests?.filter(r => r.client_id === s.id) || [];
            const plans = allPlans?.filter(p => p.client_id === s.id) || [];

            return {
              id: s.id,
              name: cProf.full_name || 'Atleta',
              email: cProf.email,
              avatar: cProf.avatar_url,
              unit: s.unit || 'kg',
              targetWeeklyRate: s.target_weekly_rate,
              milestone: s.milestone,
              milestoneAchieved: s.milestone_achieved,
              weightEntries: entries.map((e: any) => ({
                id: e.id,
                date: e.date,
                weight: Number(e.weight),
                notes: e.notes,
                recordedBy: e.recorded_by,
                movingAverage: Number(e.moving_average),
                weeklyRate: Number(e.weekly_rate),
                excludeFromCalculations: e.exclude_from_calculations,
                isLowest: e.is_lowest,
                isHighest: e.is_highest,
                nutritionId: e.active_nutrition_id
              })),
              photoRequests: requests,
              physiquePhotos: photos,
              nutritionData: plans
            };
          });
        }
        
        setCoach({ id: coachId, name: profile.full_name || 'Coach', clients: formattedClients });
        
        const { data: alertsData } = await supabase.from('alerts').select('*').eq('coach_id', coachId).order('date', { ascending: false });
        if (alertsData) setAlerts(alertsData as Alert[]);

      } else {
        // Athlete Flow
        const { data: settings } = await supabase.from('client_settings').select('*').eq('id', userId).single();
        
        const [
          { data: allEntries },
          { data: allPhotos },
          { data: allRequests },
          { data: allPlans }
        ] = await Promise.all([
          supabase.from('weight_entries').select('*').eq('client_id', userId).order('date', { ascending: false }),
          supabase.from('physique_photos').select('*').eq('client_id', userId),
          supabase.from('photo_requests').select('*').eq('client_id', userId),
          supabase.from('nutrition_plans').select('*').eq('client_id', userId)
        ]);

        const myClientData = {
          id: userId,
          name: profile.full_name || 'Atleta',
          email: profile.email,
          avatar: profile.avatar_url,
          unit: settings?.unit || 'kg',
          targetWeeklyRate: settings?.target_weekly_rate || -0.5,
          milestone: settings?.milestone,
          milestoneAchieved: settings?.milestone_achieved,
          weightEntries: (allEntries || []).map((e: any) => ({
            id: e.id,
            date: e.date,
            weight: Number(e.weight),
            notes: e.notes,
            recordedBy: e.recorded_by,
            movingAverage: Number(e.moving_average),
            weeklyRate: Number(e.weekly_rate),
            excludeFromCalculations: e.exclude_from_calculations,
            isLowest: e.is_lowest,
            isHighest: e.is_highest,
            nutritionId: e.active_nutrition_id
          })),
          photoRequests: allRequests || [],
          physiquePhotos: allPhotos || [],
          nutritionData: allPlans || []
        };
        
        setCoach({ id: settings?.coach_id || 'unassigned', name: 'Mi Coach', clients: [myClientData] });
      }

      setLoading(false);
    }

    loadInitialData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!currentUser || isMockMode.current) return;

    const coachId = currentUser.role === 'coach' ? currentUser.id : null;
    let effectiveCoachId = coachId;

    const setupSubscriptions = async () => {
      let coachId = currentUser.role === 'coach' ? currentUser.id : null;
      let clientId = currentUser.role === 'client' ? currentUser.id : null;

      const channels = [];

      if (coachId) {
        // Listen for coach's alerts
        const alertsChannel = supabase
          .channel('public:alerts')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'alerts',
            filter: `coach_id=eq.${coachId}`
          }, (payload: { eventType: string; new: Alert }) => {
            if (payload.eventType === 'INSERT') {
              setAlerts(prev => [payload.new, ...prev]);
              toast.info('Nueva alerta recibida', {
                description: payload.new.message
              });
            } else if (payload.eventType === 'UPDATE') {
              setAlerts(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
            }
          })
          .subscribe();
        channels.push(alertsChannel);

        // Listen for all weight entries (coach will filter internally or refresh data)
        const weightChannel = supabase
          .channel('public:weight_entries')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'weight_entries'
          }, (payload: { eventType: string; new: { client_id: string } }) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              refreshClientData(payload.new.client_id);
            }
          })
          .subscribe();
        channels.push(weightChannel);
      } else if (clientId) {
        // Athlete listens ONLY to their own weight entries
        const weightChannel = supabase
          .channel('public:weight_entries')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'weight_entries',
            filter: `client_id=eq.${clientId}`
          }, (payload: { eventType: string; new: { client_id: string } }) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              refreshClientData(clientId);
            }
          })
          .subscribe();
        channels.push(weightChannel);
      }

      return () => {
        channels.forEach(ch => supabase.removeChannel(ch));
      };
    };

    setupSubscriptions();
  }, [currentUser]);

  const addWeightEntry = async (clientId: string, entry: Omit<WeightEntry, 'id'>) => {
    setLoading(true);

    if (isMockMode.current) {
      // Local-only: add entry to in-memory state
      const newEntry: WeightEntry = {
        ...entry,
        id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? { ...c, weightEntries: [newEntry, ...c.weightEntries] }
              : c
          ),
        };
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('weight_entries')
      .insert({
        client_id: clientId,
        date: entry.date,
        weight: entry.weight,
        notes: entry.notes,
        recorded_by: entry.recordedBy
      });

    if (error) {
      console.error('Error adding weight entry:', error);
    } else {
      const { data: updatedClients } = await supabase.from('client_settings').select('*').eq('id', clientId).single(); // Just for context
      await refreshClientData(clientId);
      
      // Post-refresh Analysis
      const updatedClient = coach?.clients.find(c => c.id === clientId);
      if (updatedClient) {
        const analysis = CaliBotEngine.analyzeProgress(updatedClient, { ...entry, id: 'temp' } as any);
        setLatestAnalysis(analysis);
      }
    }
    setLoading(false);
  };

  const updateWeightEntry = async (clientId: string, entryId: string, updates: Partial<WeightEntry>) => {
    if (isMockMode.current) {
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? {
                  ...c,
                  weightEntries: c.weightEntries.map((e: WeightEntry) =>
                    e.id === entryId ? { ...e, ...updates } : e
                  ),
                }
              : c
          ),
        };
      });
      return;
    }

    const { error } = await supabase
      .from('weight_entries')
      .update({
        weight: updates.weight,
        notes: updates.notes,
        exclude_from_calculations: updates.excludeFromCalculations
      })
      .eq('id', entryId);

    if (!error) await refreshClientData(clientId);
  };

  const refreshClientData = async (clientId: string) => {
    const { data: updatedEntries } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (updatedEntries) {
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) => 
            c.id === clientId ? { 
              ...c, 
              weightEntries: updatedEntries.map((e: any) => ({
                id: e.id,
                date: e.date,
                weight: Number(e.weight),
                notes: e.notes,
                recordedBy: e.recorded_by,
                movingAverage: Number(e.moving_average),
                weeklyRate: Number(e.weekly_rate),
                excludeFromCalculations: e.exclude_from_calculations,
                isLowest: e.is_lowest,
                isHighest: e.is_highest,
                nutritionId: e.active_nutrition_id
              }))
            } : c
          )
        };
      });
    }
  };

  const updateTargetWeeklyRate = async (clientId: string, targetRate: number) => {
    if (!isMockMode.current) {
      const { error } = await supabase
        .from('client_settings')
        .update({ target_weekly_rate: targetRate })
        .eq('id', clientId);
      if (error) return;
    }

    setCoach((prev: Coach | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        clients: prev.clients.map((c: Client) => 
          c.id === clientId ? { ...c, targetWeeklyRate: targetRate } : c
        )
      };
    });
  };

  const updateNotificationSettings = async (clientId: string, settings: any) => {
    if (!isMockMode.current) {
      const { error } = await supabase
        .from('client_settings')
        .update({
          notify_lowest: settings.notifyLowest,
          notify_highest: settings.notifyHighest,
          notify_rate_deviation: settings.notifyRateDeviation,
          notify_weight_modified: settings.notifyWeightModified,
          milestone: settings.milestone,
          reminder_enabled: settings.reminderEnabled,
          reminder_time: settings.reminderTime,
          show_moving_average: settings.show_moving_average
        })
        .eq('id', clientId);
      if (error) return;
    }

    setCoach((prev: Coach | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        clients: prev.clients.map((c: Client) => 
          c.id === clientId ? { ...c, ...settings } : c
        )
      };
    });
  };

  const requestPhoto = async (clientId: string, targetDate: string, viewType: 'front' | 'side' | 'back') => {
    if (isMockMode.current) {
      // Mock photo request
      const newRequest: any = {
        id: `req-${Date.now()}`,
        targetDate,
        viewType,
        status: 'pending',
        requestedDate: new Date().toISOString().split('T')[0]
      };
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? { ...c, photoRequests: [...(c.photoRequests || []), newRequest] }
              : c
          ),
        };
      });
      return;
    }

    const { error } = await supabase
      .from('photo_requests')
      .insert({
        coach_id: coach?.id,
        client_id: clientId,
        target_date: targetDate,
        view_type: viewType,
        status: 'pending'
      });

    if (!error) await refreshClientPhotos(clientId);
  };

  const refreshClientPhotos = async (clientId: string) => {
    const { data: photos } = await supabase.from('physique_photos').select('*').eq('client_id', clientId);
    const { data: requests } = await supabase.from('photo_requests').select('*').eq('client_id', clientId);
    
    setCoach((prev: Coach | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        clients: prev.clients.map((c: Client) => 
          c.id === clientId ? { ...c, physiquePhotos: photos || [], photoRequests: requests || [] } : c
        )
      };
    });
  };

  const uploadPhoto = async (clientId: string, photoUrl: string, notes: string, viewType?: 'front' | 'side' | 'back') => {
    if (isMockMode.current) {
      const newPhoto: any = {
        id: `photo-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        photoUrl,
        viewType: viewType || 'front',
        notes,
        uploadedAt: new Date().toISOString()
      };
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? { ...c, physiquePhotos: [...(c.physiquePhotos || []), newPhoto] }
              : c
          ),
        };
      });
      return;
    }

    const { error } = await supabase
      .from('physique_photos')
      .insert({
        client_id: clientId,
        date: new Date().toISOString().split('T')[0],
        photo_url: photoUrl,
        view_type: viewType || 'front',
        notes
      });

    if (!error) await refreshClientPhotos(clientId);
  };

  const markAlertAsRead = async (alertId: string) => {
    if (!isMockMode.current) {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);
      if (error) return;
    }

    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
  };

  const initializeMockMode = async (accountIdOrUserId: string, isInfluencerOverride?: boolean, customFullName?: string, customEmail?: string) => {
    isMockMode.current = true;

    // Determine which data set to load
    const accountId = localStorage.getItem('kcaliper_account') || 'argo';

    if (accountId === 'esteban' || isInfluencerOverride) {
      // Load Esteban's data
      const clientsWithRates = estebanCoach.clients.map(client => ({
        ...client,
        weightEntries: recalculateAllWeeklyRates(client.weightEntries)
      }));

      // Override the core coach profile with the real user's details if provided by an influencer signup
      const finalCoachProfile = {
         ...estebanCoach,
         id: customEmail ? accountIdOrUserId : estebanCoach.id,
         name: customFullName || estebanCoach.name,
         email: customEmail || estebanCoach.email,
         clients: clientsWithRates
      };

      setCoach(finalCoachProfile as any);
      setAlerts(estebanAlerts);

      // Find user or construct dynamic one
      let user = estebanUsers.find(u => u.id === accountIdOrUserId);
      if (!user && isInfluencerOverride) {
        user = {
          id: accountIdOrUserId,
          name: customFullName || estebanCoach.name,
          email: customEmail || estebanCoach.email,
          role: 'coach'
        } as User;
      } else if (!user) {
        user = estebanUsers[0];
      }
      setCurrentUser(user as any);
    } else {
      // Default: load Carlos / Carlos Rodriguez / Argo data
      const accountId = localStorage.getItem('kcaliper_account') || 'argo';
      const selectedMockUser = mockUsers.find(u => u.id === accountId) || mockUsers[0];

      const clientsWithRatesFinal = mockCoach.clients.map(client => ({
        ...client,
        weightEntries: recalculateAllWeeklyRates(client.weightEntries)
      }));

      setCoach({ ...mockCoach, clients: clientsWithRatesFinal } as any);
      setAlerts(mockAlerts);
      setCurrentUser(selectedMockUser as any);
    }

    setLoading(false);
  };

  // Get the full users list for the current account (for UserSwitcher)
  const getAvailableUsers = (): User[] => {
    const accountId = localStorage.getItem('kcaliper_account') || 'argo';
    return accountId === 'esteban' ? estebanUsers : mockUsers;
  };

  const switchUser = async (userId: string) => {
    setLoading(true);
    if (isMockMode.current) {
      // Check both user lists
      const allUsers = [...mockUsers, ...estebanUsers];
      const mockUser = allUsers.find(u => u.id === userId);
      if (mockUser) {
        setCurrentUser(mockUser as any);
        setLoading(false);
        return;
      }
    }
    
    // Fallback to Supabase for production
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profile) {
      setCurrentUser(profile as User);
    }
    setLoading(false);
  };

  const addNutritionData = async (clientId: string, nutritionData: Omit<NutritionData, 'id'>) => {
    if (isMockMode.current) {
      const newNutrition = { ...nutritionData, id: `nutr-${Date.now()}` };
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? { ...c, nutritionData: [...(c.nutritionData || []), newNutrition] }
              : c
          ),
        };
      });
      return;
    }

    const { error } = await supabase
      .from('nutrition_plans')
      .insert({
        client_id: clientId,
        start_date: nutritionData.startDate,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fats: nutritionData.fats,
        notes: nutritionData.notes
      });

    if (!error) await refreshClientData(clientId);
  };

  const markClientNotificationAsRead = async (clientId: string, notificationId: string) => {
    if (isMockMode.current) {
      setCoach((prev: Coach | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map((c: Client) =>
            c.id === clientId
              ? {
                  ...c,
                  notifications: (c.notifications || []).map((n: ClientNotification) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                  ),
                }
              : c
          ),
        };
      });
      return;
    }

    await supabase
      .from('client_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  };

  const getClientById = (clientId: string): Client | undefined => {
    return coach?.clients.find(client => client.id === clientId);
  };

  const getCurrentClient = (): Client | undefined => {
    if (currentUser?.role === 'client') {
      return getClientById(currentUser.id);
    }
    return undefined;
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
    markLowestWeight: (clientId: string, entryId: string) => updateWeightEntry(clientId, entryId, { isLowest: true } as any),
    markHighestWeight: (clientId: string, entryId: string) => updateWeightEntry(clientId, entryId, { isHighest: true } as any),
    markAlertAsRead,
    updateNotificationSettings,
    requestPhoto,
    uploadPhoto,
    addNutritionData,
    markClientNotificationAsRead,
    switchUser,
    getAvailableUsers,
    latestAnalysis,
    setLatestAnalysis,
    joinCoach: async (coachId: string) => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Create client settings
        const { error: settingsError } = await supabase
          .from('client_settings')
          .insert({
            id: currentUser.id,
            coach_id: coachId,
            unit: 'kg',
            target_weekly_rate: -0.5
          });
          
        if (settingsError) throw settingsError;
        
        // Refresh to trigger loadUserData logic for the newly linked client
        window.location.reload(); 
      } catch (e: any) {
        toast.error('Error linking to coach');
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    getClientById,
    getCurrentClient
  };
}