import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X, Camera, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScannerOverlayProps {
  onScan: (weight: number) => void;
  onClose: () => void;
}

export function ScannerOverlay({ onScan, onClose }: ScannerOverlayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        toast.error("Could not access camera");
        onClose();
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsProcessing(true);
    
    // Simulate high-fidelity OCR scanning for the video impact
    // In production, here we use tesseract.js worker
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      // Generate a realistic random weight based on typical ranges for demo
      const detectedWeight = 78.5; 
      
      setTimeout(() => {
        onScan(detectedWeight);
        onClose();
      }, 1000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* AR Overlay - Scanning Frame */}
      <div className="relative w-72 h-72 border-2 border-white/20 rounded-3xl overflow-hidden flex items-center justify-center">
        {/* Scanning Line Animation */}
        {!success && !isProcessing && (
          <div className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-y top-0" />
        )}

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 z-10">
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-blue-400 font-bold tracking-widest text-sm uppercase">Analizando...</p>
          </div>
        )}

        {/* Success Icon */}
        {success && (
          <div className="flex flex-col items-center gap-4 z-10 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
            <p className="text-green-400 font-bold text-2xl">78.5 kg</p>
          </div>
        )}

        {/* Framing Corners */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />
      </div>

      <p className="mt-8 text-white/70 text-center px-8 text-sm italic">
        Apunta a los números de la báscula y asegúrate que haya buena luz.
      </p>

      {/* Controls */}
      <div className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/10 border-white/20 text-white h-12 w-12"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <Button 
          className={`h-20 w-20 rounded-full border-4 border-white transition-all transform active:scale-90 ${isProcessing || success ? 'bg-blue-600 scale-110' : 'bg-transparent shadow-lg shadow-white/20'}`}
          onClick={handleCapture}
          disabled={isProcessing || success}
        >
          {!isProcessing && !success && <Zap className="w-8 h-8 text-white fill-white" />}
        </Button>

        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Decorative Text for Video */}
      <div className="absolute top-12 left-0 right-0 text-center">
        <Badge className="bg-blue-600/80 text-white border-0 py-1 px-4 text-xs font-bold tracking-widest uppercase">
          Argo Vision Engine v1.0
        </Badge>
      </div>
      
      <style>{`
        @keyframes scan-y {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan-y {
          animation: scan-y 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
}

// Minimal Badge if not imported
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
