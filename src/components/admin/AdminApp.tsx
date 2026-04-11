import { useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { OverviewDashboard } from './modules/OverviewDashboard';
import { AccountsManager } from './modules/AccountsManager';
import { TicketsManager } from './modules/TicketsManager';
import { MarketingDashboard } from './modules/MarketingDashboard';
import { InfluencerTracker } from './modules/InfluencerTracker';
import { RevenueDashboard } from './modules/RevenueDashboard';
import { AuditLog } from './modules/AuditLog';
import { SystemConfig } from './modules/SystemConfig';

const ADMIN_ROUTES: Record<string, string> = {
  '/admin': 'overview',
  '/admin/accounts': 'accounts',
  '/admin/tickets': 'tickets',
  '/admin/marketing': 'marketing',
  '/admin/influencers': 'influencers',
  '/admin/revenue': 'revenue',
  '/admin/audit': 'audit',
  '/admin/system': 'system',
};

export function AdminApp({ path }: { path: string }) {
  const { isAdmin, loading, profile, signIn, signOut, error } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onSignIn={signIn} error={error} loading={loading} />;
  }

  const activeModule = ADMIN_ROUTES[path] || 'overview';

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewDashboard />;
      case 'accounts': return <AccountsManager />;
      case 'tickets': return <TicketsManager />;
      case 'marketing': return <MarketingDashboard />;
      case 'influencers': return <InfluencerTracker />;
      case 'revenue': return <RevenueDashboard />;
      case 'audit': return <AuditLog />;
      case 'system': return <SystemConfig />;
      default: return <OverviewDashboard />;
    }
  };

  return (
    <AdminLayout
      activeModule={activeModule}
      profile={profile}
      onSignOut={signOut}
    >
      {renderModule()}
    </AdminLayout>
  );
}
