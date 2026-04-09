import { useState, useEffect } from 'react';
import { useWeightTracker } from './hooks/useWeightTracker';
import { CoachDashboard } from './components/CoachDashboard';
import { Logbook } from './components/Logbook';
import { UserSwitcher } from './components/UserSwitcher';
import { MobileNotificationsButton } from './components/MobileNotificationsButton';
import { FormulasDocumentation } from './components/FormulasDocumentation';
import { toast, Toaster } from 'sonner';
import { Button } from './components/ui/button';
import { Dialog, DialogContent } from './components/ui/dialog';
import { BookOpen, Loader2, ShieldCheck } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { AthleteEmptyState } from './components/AthleteEmptyState';

import { LandingPage } from './components/LandingPage';
import { CoachLandingPage } from './components/CoachLandingPage';
import { EarlyAccessPage } from './components/EarlyAccessPage';
import { LoginPage } from './components/LoginPage';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsConditions } from './components/pages/TermsConditions';
import { AcceptableUse } from './components/pages/AcceptableUse';
import { AboutUs } from './components/pages/AboutUs';


/* ============ URL ROUTER HOOK ============ */
function useRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0 });
  };

  return { path, navigate };
}


export default function App() {
  const { path, navigate } = useRouter();
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleViewClient = (clientId: string) => {};
  
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
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
    getAvailableUsers,
    joinCoach,
    getClientById,
    getCurrentClient
  } = useWeightTracker();

  const handleAddWeight = (weight: number, date: string, notes: string) => {
    const client = getCurrentClient();
    if (client) {
      addWeightEntry(client.id, { weight, date, notes, recordedBy: 'client' });
      toast.success('Weight recorded successfully!');
    }
  };

  const handleUpdateEntry = (clientId: string, entryId: string, updates: any) => {
    updateWeightEntry(clientId, entryId, updates);
    toast.success('Entry updated successfully!');
  };

  const handleClientUpdateEntry = (entryId: string, updates: any) => {
    const client = getCurrentClient();
    if (client) {
      updateWeightEntry(client.id, entryId, updates);
      toast.success('Notes updated successfully!');
    }
  };

  // Navigation handler for sub-pages
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  // ===== ROUTING =====
  
  // Legal pages
  const goBack = () => { navigate('/'); };
  if (path === '/privacidad') return <PrivacyPolicy onBack={goBack} />;
  if (path === '/terminos') return <TermsConditions onBack={goBack} />;
  if (path === '/uso-aceptable') return <AcceptableUse onBack={goBack} />;
  if (path === '/nosotros') return <AboutUs onBack={goBack} />;

  // Coach landing
  if (path === '/coach') {
    return <CoachLandingPage onNavigate={handleNavigate} />;
  }

  // Early access (post-signup)
  if (path === '/early-access') {
    return <EarlyAccessPage onNavigate={handleNavigate} />;
  }

  // Login Page
  if (path === '/login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Dashboard (authenticated app)
  if (path === '/dashboard') {
    if (typeof window !== 'undefined' && !localStorage.getItem('kcaliper_auth')) {
      // Small delay to allow react to render before replacing state
      setTimeout(() => {
        navigate('/login');
      }, 0);
      return <SplashScreen />;
    }

    if (!currentUser) {
      return <SplashScreen />;
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <UserSwitcher
          currentUser={currentUser}
          availableUsers={getAvailableUsers()}
          onSwitchUser={switchUser}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          notificationButton={
            currentUser.role === 'coach' ? (
              <div className="lg:hidden">
                <MobileNotificationsButton
                  alerts={alerts}
                  unreadAlerts={unreadAlerts}
                  onMarkAsRead={markAlertAsRead}
                  onViewClient={handleViewClient}
                />
              </div>
            ) : null
          }
        />
        
        <div className="container mx-auto px-4 py-6">
          {currentUser.role === 'coach' ? (
            <CoachDashboard
              coach={coach}
              alerts={alerts}
              unreadAlerts={unreadAlerts}
              onUpdateEntry={handleUpdateEntry}
              onMarkLowest={markLowestWeight}
              onMarkHighest={markHighestWeight}
              onUpdateTargetRate={updateTargetWeeklyRate}
              onMarkAlertAsRead={markAlertAsRead}
              onUpdateNotificationSettings={updateNotificationSettings}
              onRequestPhoto={requestPhoto}
            />
          ) : (
            <>
                {getCurrentClient() ? (
                  <Logbook
                    entries={getCurrentClient()!.weightEntries}
                    onAddEntry={handleAddWeight}
                    onUpdateEntry={handleClientUpdateEntry}
                    isCoachView={false}
                    clientName={getCurrentClient()!.name}
                    unit={getCurrentClient()!.unit}
                    client={getCurrentClient()!}
                    onUpdateClientSettings={(settings) => {
                      const client = getCurrentClient();
                      if (client) {
                        updateNotificationSettings(client.id, settings);
                      }
                    }}
                    onUploadPhoto={(photoUrl, notes, viewType) => {
                      const client = getCurrentClient();
                      if (client) {
                        uploadPhoto(client.id, photoUrl, notes, viewType);
                      }
                    }}
                    unreadAlerts={unreadAlerts.filter(alert => alert.clientId === getCurrentClient()!.id)}
                    onMarkAlertAsRead={markAlertAsRead}
                  />
                ) : currentUser.role === 'client' ? (
                  <AthleteEmptyState
                    athleteName={currentUser.name}
                    onJoinDemoCoach={() => joinCoach('00000000-0000-0000-0000-000000000001')}
                    loading={loading}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Client data not found</p>
                  </div>
                )}
            </>
          )}
        </div>
        
        <Toaster position="top-right" />

        <Dialog open={showDocumentation} onOpenChange={setShowDocumentation}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-950 border-gray-200 dark:border-white/10 p-6 md:p-8">
            <FormulasDocumentation />
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 rounded-full shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 z-50 transition-transform hover:scale-110"
          onClick={() => setShowDocumentation(true)}
        >
          <BookOpen className="w-5 h-5 text-blue-600" />
        </Button>
      </div>
    );
  }

  // Default: Main landing page (athletes)
  return <LandingPage onNavigate={handleNavigate} />;
}