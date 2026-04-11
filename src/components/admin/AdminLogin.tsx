import { useState } from 'react';
import { Activity, Lock, Shield } from 'lucide-react';

interface AdminLoginProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export function AdminLogin({ onSignIn, error, loading }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    await onSignIn(email, password);
    setLocalLoading(false);
  };

  const isLoading = loading || localLoading;

  return (
    <div className="min-h-screen bg-[#0A0A1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Activity className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              kCaliper<span className="text-violet-500">.admin</span>
            </h1>
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase">Panel de Control</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Acceso Super Admin</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kcaliper.com"
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Acceder al Panel
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-white/20">
          Solo usuarios con rol <span className="text-violet-400/60 font-medium">super_admin</span> pueden acceder.
        </p>
      </div>
    </div>
  );
}
