import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Wrench, Save, ToggleLeft, ToggleRight, Eye, AlertTriangle } from 'lucide-react';
import { ConfirmActionModal } from '../ui/ConfirmActionModal';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { toast } from 'sonner';

interface ConfigItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const CONFIG_ITEMS: Omit<ConfigItem, 'enabled'>[] = [
  { key: 'maintenance_mode', label: 'Modo Mantenimiento', description: 'Muestra página de mantenimiento a todos los usuarios.', icon: '🚧' },
  { key: 'registration_open', label: 'Registro Abierto', description: 'Si está cerrado, solo con código de invitación.', icon: '📝' },
  { key: 'early_access_active', label: 'Early Access Activo', description: 'Muestra precios de fundador en la landing.', icon: '🎫' },
  { key: 'calibot_active', label: 'CaliBot Activo', description: 'Habilita/deshabilita el módulo de IA.', icon: '🤖' },
  { key: 'whatsapp_notifications', label: 'WhatsApp Notifications', description: 'Habilita/deshabilita notificaciones WA.', icon: '💬' },
];

interface BannerConfig {
  text: string;
  bg_color: string;
  cta_text: string;
  cta_url: string;
  visible: boolean;
}

export function SystemConfig() {
  const { profile } = useAdminAuth();
  const [configs, setConfigs] = useState<Record<string, boolean>>({});
  const [banner, setBanner] = useState<BannerConfig>({ text: '', bg_color: '#6C5CE7', cta_text: '', cta_url: '', visible: false });
  const [loading, setLoading] = useState(true);
  const [confirmToggle, setConfirmToggle] = useState<ConfigItem | null>(null);

  useEffect(() => { loadConfigs(); }, []);

  async function loadConfigs() {
    setLoading(true);
    const { data } = await supabase.from('system_config').select('*');
    if (data) {
      const configMap: Record<string, boolean> = {};
      data.forEach((row: any) => {
        if (row.key === 'banner_config') {
          setBanner(row.value);
        } else {
          configMap[row.key] = row.value?.enabled ?? false;
        }
      });
      setConfigs(configMap);
    }
    setLoading(false);
  }

  async function toggleConfig(key: string, newValue: boolean) {
    await supabase.from('system_config').update({ value: { enabled: newValue }, updated_at: new Date().toISOString(), updated_by: profile?.id }).eq('key', key);
    await supabase.from('admin_audit_log').insert({ admin_id: profile?.id, action: 'config_change', reason: `${key} → ${newValue ? 'ON' : 'OFF'}`, metadata: { key, value: newValue } });
    setConfigs({ ...configs, [key]: newValue });
    setConfirmToggle(null);
    toast.success(`${key} → ${newValue ? 'Activado' : 'Desactivado'}`);
  }

  async function saveBanner() {
    await supabase.from('system_config').update({ value: banner, updated_at: new Date().toISOString(), updated_by: profile?.id }).eq('key', 'banner_config');
    await supabase.from('admin_audit_log').insert({ admin_id: profile?.id, action: 'config_change', reason: 'Banner config updated', metadata: banner });
    toast.success('Configuración del banner guardada.');
  }

  const plans = [
    { name: 'Atleta Pro', price: '$3.99/mes', stripe: 'price_xxx_atleta_pro' },
    { name: 'Atleta Legend', price: '$12.90/año ($1.07/mes)', stripe: 'price_xxx_atleta_legend' },
    { name: 'Coach Professional', price: '$12.99/mes', stripe: 'price_xxx_coach_pro' },
    { name: 'Coach Global Elite', price: '$99.90/año ($8.33/mes)', stripe: 'price_xxx_coach_global' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <Wrench className="w-6 h-6 text-violet-400" />
        Configuración del Sistema
      </h1>

      {/* Platform Toggles */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-1">
        <h3 className="text-sm font-bold text-white mb-4">Configuración Global</h3>
        {CONFIG_ITEMS.map(item => {
          const enabled = configs[item.key] ?? false;
          return (
            <div key={item.key} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/30">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmToggle({ ...item, enabled })}
                className="transition-transform hover:scale-110"
              >
                {enabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-white/20" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Banner Editor */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white mb-2">Gestión del Banner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/30 mb-1">Texto del Banner</label>
            <input type="text" value={banner.text} onChange={e => setBanner({ ...banner, text: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:ring-1 focus:ring-violet-500/30" />
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1">Color de Fondo</label>
            <div className="flex items-center gap-2">
              <input type="color" value={banner.bg_color} onChange={e => setBanner({ ...banner, bg_color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-none" />
              <input type="text" value={banner.bg_color} onChange={e => setBanner({ ...banner, bg_color: e.target.value })} className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-violet-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1">Texto del CTA</label>
            <input type="text" value={banner.cta_text} onChange={e => setBanner({ ...banner, cta_text: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30" />
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1">URL del CTA</label>
            <input type="text" value={banner.cta_url} onChange={e => setBanner({ ...banner, cta_url: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
            <input type="checkbox" checked={banner.visible} onChange={e => setBanner({ ...banner, visible: e.target.checked })} className="rounded accent-violet-600" />
            Mostrar banner
          </label>
          <button onClick={saveBanner} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors">
            <Save className="w-4 h-4" /> Guardar Banner
          </button>
        </div>

        {/* Preview */}
        {banner.visible && banner.text && (
          <div className="mt-4">
            <p className="text-xs text-white/30 mb-2 flex items-center gap-1"><Eye className="w-3 h-3" /> Vista Previa</p>
            <div className="rounded-lg p-3 text-center text-sm font-bold text-white" style={{ background: banner.bg_color }}>
              {banner.text}
              {banner.cta_text && <button className="ml-3 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">{banner.cta_text}</button>}
            </div>
          </div>
        )}
      </div>

      {/* Plans (Read-only) */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Precios y Planes</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Solo lectura
          </span>
        </div>
        <p className="text-xs text-white/30 mb-4">Los cambios de precio requieren modificación directa en Stripe + nuevo deploy.</p>
        <div className="space-y-2">
          {plans.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl">
              <span className="text-sm font-medium text-white">{p.name}</span>
              <span className="text-sm text-emerald-400 font-bold">{p.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Toggle Modal */}
      <ConfirmActionModal
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => confirmToggle && toggleConfig(confirmToggle.key, !confirmToggle.enabled)}
        title={`${confirmToggle?.enabled ? 'Desactivar' : 'Activar'} ${confirmToggle?.label || ''}`}
        description={`Estás a punto de ${confirmToggle?.enabled ? 'desactivar' : 'activar'} "${confirmToggle?.label}". Este cambio afectará toda la plataforma y quedará registrado en el log de auditoría.`}
        confirmText="CONFIRMAR"
        dangerLevel="warning"
      />
    </div>
  );
}
