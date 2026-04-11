import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminTable } from '../ui/AdminTable';
import { Handshake, Plus, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Influencer {
  id: string;
  name: string;
  ig_handle: string;
  tiktok_handle?: string;
  email: string;
  tier: string;
  followers: number;
  engagement_rate: number;
  country: string;
  ref_code: string;
  cpm_agreed: number;
  status: string;
  notes?: string;
  created_at: string;
}

const TIER_COLORS: Record<string, string> = {
  nano: 'text-emerald-400 bg-emerald-500/15',
  micro: 'text-cyan-400 bg-cyan-500/15',
  mid: 'text-violet-400 bg-violet-500/15',
  macro: 'text-orange-400 bg-orange-500/15',
};

const STATUS_LABELS: Record<string, { cls: string; label: string }> = {
  prospect: { cls: 'text-white/30 bg-white/5', label: '⚪ Propuesta' },
  active: { cls: 'text-yellow-400 bg-yellow-500/15', label: '🟡 Activo' },
  completed: { cls: 'text-emerald-400 bg-emerald-500/15', label: '🟢 Completado' },
  rejected: { cls: 'text-red-400 bg-red-500/15', label: '🔴 No renovar' },
};

export function InfluencerTracker() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', ig_handle: '', tiktok_handle: '', email: '', tier: 'nano', followers: 0, engagement_rate: 0, country: '', ref_code: '', cpm_agreed: 0, status: 'prospect', notes: '' });

  useEffect(() => { loadInfluencers(); }, []);

  async function loadInfluencers() {
    setLoading(true);
    const { data } = await supabase.from('influencers').select('*').order('created_at', { ascending: false });
    setInfluencers(data || []);
    setLoading(false);
  }

  async function createInfluencer(e: React.FormEvent) {
    e.preventDefault();
    console.log('[Admin] Creating influencer with form data:', form);
    
    const ref_code = form.ref_code || `ref_${form.ig_handle.replace('@', '').toLowerCase()}_${Date.now().toString(36)}`;
    
    // Build clean payload, removing empty optional fields
    const payload: any = {
      name: form.name,
      ig_handle: form.ig_handle,
      email: form.email,
      tier: form.tier,
      followers: Number(form.followers) || 0,
      engagement_rate: Number(form.engagement_rate) || 0,
      country: form.country,
      ref_code,
      cpm_agreed: Number(form.cpm_agreed) || 0,
      status: form.status,
    };
    if (form.tiktok_handle) payload.tiktok_handle = form.tiktok_handle;
    if (form.notes) payload.notes = form.notes;

    console.log('[Admin] Supabase INSERT payload:', payload);
    const { data, error } = await supabase.from('influencers').insert(payload).select();
    console.log('[Admin] Supabase response:', { data, error });

    if (error) { toast.error(`Error: ${error.message}`); return; }
    toast.success('✅ Influencer agregado correctamente.');
    setShowForm(false);
    setForm({ name: '', ig_handle: '', tiktok_handle: '', email: '', tier: 'nano', followers: 0, engagement_rate: 0, country: '', ref_code: '', cpm_agreed: 0, status: 'prospect', notes: '' });
    loadInfluencers();
  }

  const columns = [
    { key: 'name', label: 'Nombre', sortable: true, render: (r: Influencer) => <span className="font-semibold text-white">{r.name}</span> },
    { key: 'ig_handle', label: 'Instagram', render: (r: Influencer) => (
      <a href={`https://instagram.com/${r.ig_handle?.replace('@', '')}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs transition-colors">
        {r.ig_handle} <ExternalLink className="w-3 h-3" />
      </a>
    )},
    { key: 'tier', label: 'Tier', render: (r: Influencer) => <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${TIER_COLORS[r.tier] || ''}`}>{r.tier}</span> },
    { key: 'followers', label: 'Seguidores', sortable: true, render: (r: Influencer) => <span className="text-white/60">{(r.followers || 0).toLocaleString()}</span> },
    { key: 'engagement_rate', label: 'ER%', render: (r: Influencer) => <span className="text-white/40">{r.engagement_rate}%</span> },
    { key: 'ref_code', label: 'Ref Code', render: (r: Influencer) => <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded">{r.ref_code}</span> },
    { key: 'cpm_agreed', label: 'CPM', render: (r: Influencer) => <span className="text-white/50">${r.cpm_agreed}</span> },
    { key: 'status', label: 'Estado', render: (r: Influencer) => { const s = STATUS_LABELS[r.status] || STATUS_LABELS.prospect; return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>{s.label}</span>; }},
    { key: 'country', label: 'País', render: (r: Influencer) => <span className="text-white/30 text-xs">{r.country}</span> },
  ];

  const filters = [
    { key: 'tier', label: 'Tier', options: ['nano', 'micro', 'mid', 'macro'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })) },
    { key: 'status', label: 'Estado', options: Object.entries(STATUS_LABELS).map(([v, o]) => ({ value: v, label: o.label })) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Handshake className="w-6 h-6 text-violet-400" />
          Tracker de Influencers
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors">
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Agregar Influencer</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={createInfluencer} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Nuevo Influencer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'name', label: 'Nombre *', type: 'text', required: true },
              { key: 'ig_handle', label: 'Instagram *', type: 'text', required: true, placeholder: '@handle' },
              { key: 'email', label: 'Email *', type: 'email', required: true },
              { key: 'tiktok_handle', label: 'TikTok', type: 'text', placeholder: '@handle' },
              { key: 'country', label: 'País *', type: 'text', required: true },
              { key: 'ref_code', label: 'Ref Code', type: 'text', placeholder: 'Auto-generado si vacío' },
              { key: 'followers', label: 'Seguidores', type: 'number', required: false },
              { key: 'engagement_rate', label: 'ER%', type: 'number', required: false },
              { key: 'cpm_agreed', label: 'CPM Acordado ($)', type: 'number', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-white/30 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={f.type === 'number' ? ((form as any)[f.key] ?? '') : ((form as any)[f.key] || '')}
                  onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/30 mb-1">Tier *</label>
              <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white/60 focus:outline-none">
                {['nano', 'micro', 'mid', 'macro'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/30 mb-1">Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white/60 focus:outline-none">
                {Object.entries(STATUS_LABELS).map(([v, o]) => <option key={v} value={v}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1">Notas internas</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none resize-none" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm rounded-xl transition-colors">Guardar Influencer</button>
        </form>
      )}

      <AdminTable columns={columns} data={influencers} filters={filters} pageSize={25} searchPlaceholder="Buscar influencer..." emptyMessage={loading ? 'Cargando...' : 'No hay influencers registrados.'} emptyIcon={<Handshake className="w-12 h-12 text-white/10" />} />
    </div>
  );
}
