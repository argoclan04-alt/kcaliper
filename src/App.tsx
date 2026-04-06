import { useState, useEffect } from 'react';
import { useWeightTracker } from './hooks/useWeightTracker';
import { CoachDashboard } from './components/CoachDashboard';
import { Logbook } from './components/Logbook';
import { UserSwitcher } from './components/UserSwitcher';
import { MobileNotificationsButton } from './components/MobileNotificationsButton';
import { FormulasDocumentation } from './components/FormulasDocumentation';
import { mockUsers } from './utils/mock-data';
import { toast, Toaster } from "sonner@2.0.3";
import { Button } from './components/ui/button';
import { Dialog, DialogContent } from './components/ui/dialog';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleViewClient = (clientId: string) => {
    // This will be handled by the notification button
  };
  
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
    getCurrentClient
  } = useWeightTracker();

  const handleAddWeight = (weight: number, date: string, notes: string) => {
    const client = getCurrentClient();
    if (client) {
      addWeightEntry(client.id, {
        weight,
        date,
        notes,
        recordedBy: 'client'
      });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <UserSwitcher
        currentUser={currentUser}
        availableUsers={mockUsers}
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
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Client data not found</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Toaster position="top-right" />

      {/* Documentation Dialog */}
      <Dialog open={showDocumentation} onOpenChange={setShowDocumentation}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <FormulasDocumentation />
        </DialogContent>
      </Dialog>
    </div>
  );
}