import React, { useState } from 'react';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

// Credential registry — each entry maps to a different mock data profile
const ACCOUNTS: Record<string, { password: string; accountId: string; displayName: string }> = {
  'argo@kcaliper.ai': {
    password: 'kcaliperadmin',
    accountId: 'argo',
    displayName: 'Admin (Argo)'
  },
  'esteban@kcaliper.ai': {
    password: 'esteban2026',
    accountId: 'esteban',
    displayName: 'Coach Esteban Alban'
  }
};

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Humanistic delay for "authenticating"
    await new Promise(resolve => setTimeout(resolve, 1200));

    const account = ACCOUNTS[email.toLowerCase().trim()];

    if (account && password === account.password) {
      // Store auth token and account identifier
      localStorage.setItem('kcaliper_auth', 'true');
      localStorage.setItem('kcaliper_account', account.accountId);
      
      toast.success(`Bienvenido, ${account.displayName}. Conectando...`);
      
      // We use window.location.href instead of onNavigate to force a full page reload.
      // This ensures the useWeightTracker hook re-initializes and reads the new accountId from storage.
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } else {
      toast.error('Credenciales incorrectas o cuenta no autorizada.');
      setLoading(false);
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen fp-dark-bg flex items-center justify-center p-5 relative overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Particles BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full blur-[160px] bg-[#00D2FF]/10 animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full blur-[160px] bg-[#6C5CE7]/10 animate-pulse-slow delay-1000" />
      </div>

      <button onClick={goHome} className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-fp-gradient rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#6C5CE7]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kcaliper<span className="text-fp-gradient">.ai</span></h1>
          <p className="text-white/50 mt-2 text-sm">Acceso restringido a miembros de la plataforma.</p>
        </div>

        <form onSubmit={handleLogin} className="fp-dark-card rounded-3xl p-8 border-white/10 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50 transition-all"
                  placeholder="coach@kcaliper.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full mt-4 h-12 bg-fp-gradient tracking-wide text-white rounded-xl hover:opacity-90 transition-all font-bold text-[15px] shadow-lg shadow-[#6C5CE7]/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
