import { Loader2, ShieldCheck } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />

      {/* Main Content */}
      <div className="relative flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 relative">
          <ShieldCheck className="w-10 h-10 text-white" />
          <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl animate-ping" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
            ARGO
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-widest text-xs uppercase">
            Precision Performance
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
            Sincronizando con el servidor...
          </span>
        </div>
      </div>

      {/* Version Tag */}
      <div className="absolute bottom-8 text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-widest">
        BUILD v2.0.4-SaaS
      </div>
    </div>
  );
}
