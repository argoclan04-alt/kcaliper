import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { CaliBotResponse } from './components/CaliBotResponse';

import { LandingPage as LegacyLandingPage } from './components/LandingPage';
import { EarlyAccessPage } from './components/EarlyAccessPage';
import AppV2, { LandingPage as V2LandingPage, CoachesLandingPage as V2CoachesPage, NosotrosPage as V2NosotrosPage } from './v2/App';
import { AuthPage } from './components/AuthPage';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsConditions } from './components/pages/TermsConditions';
import { AcceptableUse } from './components/pages/AcceptableUse';
import { AboutUs } from './components/pages/AboutUs';
import { AdminApp } from './components/admin/AdminApp';
import { BecomeInfluencerPage } from './components/BecomeInfluencerPage';
import { OnboardingWizard } from './components/pages/OnboardingWizard';
import { ResetPasswordPage } from './components/ResetPasswordPage';


export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleNavigate = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0 });
  };

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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      // BRIDGE: If Supabase logs in via Magic Link, we must grant them access 
      // to the frontend dashboard which currently uses localStorage.
      if (session?.user && (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION' || _event === 'PASSWORD_RECOVERY')) {
        const email = session.user.email;
        // Fetch their assigned role/plan from the real Supabase backend
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        
        const role = profile?.role || 'athlete';
        const plan = profile?.plan || 'pro';
        
        // Inject auth into LocalStorage so the useWeightTracker engine lets them in
        localStorage.setItem('kcaliper_auth', JSON.stringify({
           email: email,
           role: role,
           plan: plan,
           timestamp: new Date().toISOString()
        }));
        
        // Enforce proper navigation logic, checking REAL data instead of just localStorage
        let hasOnboarded = localStorage.getItem('kcaliper_onboarding_done') === 'true';
        
        // Double check Supabase to ensure robust cross-device support for Athletes
        if (!hasOnboarded && role === 'client') {
            const { data: entries } = await supabase.from('weight_entries').select('id').eq('client_id', session.user.id).limit(1);
            if (entries && entries.length > 0) {
               hasOnboarded = true;
               localStorage.setItem('kcaliper_onboarding_done', 'true');
            }
        }
        // Coaches don't strictly need onboarding yet, bypass it
        if (role === 'coach') hasOnboarded = true;
        
        const path = window.location.pathname;
        
        // HANDLE PASSWORD RECOVERY: Redirect to reset page and STOP other redirects
        if (_event === 'PASSWORD_RECOVERY') {
            navigate('/reset-password');
            return;
        }

        // Only redirect if they are stuck on login, or entering the wrong mode
        if (!hasOnboarded && path !== '/onboarding' && path !== '/reset-password') {
            navigate('/onboarding');
        } else if (hasOnboarded && (path === '/login' || path === '/onboarding' || path === '/')) {
            navigate('/dashboard');
        }
      }
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
    getCurrentClient,
    latestAnalysis,
    setLatestAnalysis
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



  // ===== ROUTING =====

  // Admin Panel (must be BEFORE all other routes)
  if (path.startsWith('/admin')) {
    return <AdminApp path={path} />;
  }
  
  // Legal pages
  const goBack = () => { navigate('/'); };
  if (path === '/privacidad') return <PrivacyPolicy onBack={goBack} />;
  if (path === '/terminos') return <TermsConditions onBack={goBack} />;
  if (path === '/uso-aceptable') return <AcceptableUse onBack={goBack} />;
  // if (path === '/nosotros') return <AboutUs onBack={goBack} />; // Handled by v2 now

  // Influencer join page
  if (path === '/become-influencer') {
    return <BecomeInfluencerPage onNavigate={handleNavigate} />;
  }


  // Early access (post-signup)
  if (path === '/early-access') {
    return <EarlyAccessPage onNavigate={handleNavigate} />;
  }

  // RESTORED OLD LOGIN UI
  if (path === '/login' || path === '/auth') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (path === '/signup') {
    return <AuthPage initialMode="signup" />;
  }

  if (path === '/reset-password') {
    return <AuthPage initialMode="reset" />;
  }

  // Onboarding VIP Flow
  if (path === '/onboarding') {
    return <OnboardingWizard onBack={() => handleNavigate('/')} onComplete={() => handleNavigate('/dashboard')} />;
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
          
          <CaliBotResponse 
            analysis={latestAnalysis} 
            onClose={() => setLatestAnalysis(null)} 
          />
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

  // v2 Branding Pages
  if (path === '/' || path === '') {
    return <AppV2><V2LandingPage /></AppV2>;
  }
  if (path === '/coaches') {
    return <AppV2><V2CoachesPage /></AppV2>;
  }
  if (path === '/nosotros') {
    return <AppV2><V2NosotrosPage /></AppV2>;
  }

  // Fallback to v2 Home if no other route matches
  return <AppV2><V2LandingPage /></AppV2>;
}