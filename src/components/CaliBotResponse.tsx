import React from 'react';
import { CaliBotAnalysis } from '../lib/calibot/types';
import { 
  Brain, 
  ChevronRight, 
  Info, 
  X, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './ui/dialog';

interface CaliBotResponseProps {
  analysis: CaliBotAnalysis | null;
  onClose: () => void;
}

export const CaliBotResponse: React.FC<CaliBotResponseProps> = ({ analysis, onClose }: CaliBotResponseProps) => {
  if (!analysis) return null;

  const getIcon = () => {
    switch (analysis.eventType) {
      case 'lowest': return <Target className="w-6 h-6 text-emerald-400" />;
      case 'highest': return <AlertCircle className="w-6 h-6 text-orange-400" />;
      case 'anomaly_up': return <TrendingUp className="w-6 h-6 text-orange-400" />;
      case 'anomaly_down': return <TrendingDown className="w-6 h-6 text-emerald-400" />;
      case 'milestone': return <Target className="w-6 h-6 text-blue-400" />;
      default: return <Brain className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <Dialog open={!!analysis} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden p-0 gap-0">
        <div className="p-6 bg-gradient-to-b from-blue-500/10 to-transparent">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                {getIcon()}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  {analysis.title}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs">
                  CaliBot AI Analyst • {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              {analysis.message}
            </div>

            {analysis.educationModule && (
              <div className="mt-8 pt-6 border-t border-zinc-900">
                <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Módulo Educativo</span>
                </div>
                <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
                  <h4 className="text-sm font-bold mb-2 text-white">
                    {analysis.educationModule.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {analysis.educationModule.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-center">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Entendido
            <ChevronRight className="w-4 h-4" />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
