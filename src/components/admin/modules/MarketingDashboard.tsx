import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminTable } from '../ui/AdminTable';
import { KPICard } from '../ui/KPICard';
import { Megaphone, Users, TrendingUp, Download, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaitlistEntry {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  source?: string;
  role: string;
  created_at: string;
}

export function MarketingDashboard() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWaitlist(); }, []);

  async function loadWaitlist() {
    setLoading(true);
    const { data } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
    setWaitlist(data || []);
    setLoading(false);
  }

  // Group by source
  const sourceGroups = waitlist.reduce((acc, w) => {
    const src = w.source || 'direct';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceData = Object.entries(sourceGroups).map(([source, count]) => ({ source, registros: count })).sort((a, b) => b.registros - a.registros);

  const exportCSV = () => {
    const headers = ['Email', 'Nombre', 'Apellido', 'País', 'Fuente', 'Rol', 'Fecha'];
    const rows = waitlist.map(w => [w.email, w.first_name || '', w.last_name || '', w.country || '', w.source || '', w.role, new Date(w.created_at).toLocaleDateString('es-ES')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'email', label: 'Email', sortable: true, render: (r: WaitlistEntry) => <span className="font-medium text-white">{r.email}</span> },
    { key: 'first_name', label: 'Nombre', render: (r: WaitlistEntry) => <span className="text-white/60">{r.first_name ? `${r.first_name} ${r.last_name || ''}` : '—'}</span> },
    { key: 'country', label: 'País', render: (r: WaitlistEntry) => <span className="text-white/40">{r.country || '—'}</span> },
    { key: 'source', label: 'Fuente', render: (r: WaitlistEntry) => <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-400">{r.source || 'direct'}</span> },
    { key: 'role', label: 'Tipo', render: (r: WaitlistEntry) => <span className="text-white/30 text-xs uppercase">{r.role}</span> },
    { key: 'created_at', label: 'Fecha', sortable: true, render: (r: WaitlistEntry) => <span className="text-white/30 text-xs">{new Date(r.created_at).toLocaleDateString('es-ES')}</span> },
  ];

  const chartTooltip = { contentStyle: { background: '#12122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' } };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-violet-400" />
          Marketing & Waitlist
        </h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/20 border border-violet-500/20 rounded-xl text-sm font-bold text-violet-400 hover:bg-violet-600/30 transition-colors">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Waitlist" value={waitlist.length} color="cyan" icon={<Users className="w-4 h-4" />} />
        <KPICard title="Conversión Waitlist→Pago" value="--%" color="violet" tooltip="% de emails que tienen cuenta activa." icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="CAC Promedio" value="--" color="coral" tooltip="Inversión en influencers / nuevos usuarios." icon={<DollarSign className="w-4 h-4" />} />
        <KPICard title="Fuentes Únicas" value={Object.keys(sourceGroups).length} color="green" icon={<Megaphone className="w-4 h-4" />} />
      </div>

      {/* Source Chart */}
      {sourceData.length > 0 && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Registros por Fuente</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sourceData.slice(0, 10)} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="source" type="category" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="registros" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Waitlist Table */}
      <AdminTable columns={columns} data={waitlist} pageSize={50} searchPlaceholder="Buscar email..." emptyMessage={loading ? 'Cargando waitlist...' : 'No hay registros en waitlist.'} />
    </div>
  );
}
