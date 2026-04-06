import { AlertCircle, Camera, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PhotoRequestWarningProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  viewType: 'front' | 'side' | 'back';
  targetDate: string;
  onUploadPhoto?: () => void;
}

export function PhotoRequestWarning({
  open,
  onAccept,
  onDecline,
  viewType,
  targetDate,
  onUploadPhoto
}: PhotoRequestWarningProps) {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getViewTypeLabel = () => {
    return viewType.charAt(0).toUpperCase() + viewType.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Animated urgent icon with pulsating effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse opacity-50"></div>
              <div className="relative bg-orange-500 rounded-full p-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <DialogTitle className="text-xl text-center text-gray-900 dark:text-white">
              Photo Request from Your Coach
            </DialogTitle>
            
            <DialogDescription className="text-center">
              <div className="space-y-2">
                <div className="text-base text-gray-700 dark:text-gray-300">
                  Your coach is requesting a <strong>{getViewTypeLabel()}</strong> view physique photo.
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Target date: {formatDate(targetDate)}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-800 dark:text-orange-300">
            This is an urgent request. Please upload your photo as soon as possible to help your coach track your progress.
          </p>
        </div>

        {/* Watch Tutorial Collapsible */}
        <Collapsible open={tutorialOpen} onOpenChange={setTutorialOpen} className="mt-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-gray-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Tutorial
              </span>
              {tutorialOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {/* YouTube Shorts Embed */}
            <div className="relative w-full max-w-[280px] mx-auto" style={{ aspectRatio: '9/16' }}>
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/S1Gb3-CMblM"
                title="Physique Photo Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3">
              <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                <li>• <strong>Lighting:</strong> Consistent artificial light</li>
                <li>• <strong>Location:</strong> Clean mirror, same spot</li>
                <li>• <strong>No flexing:</strong> Stay relaxed and natural</li>
                <li>• <strong>Minimal clothing:</strong> Shorts/underwear only</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={() => {
              if (onUploadPhoto) {
                onUploadPhoto();
              } else {
                onAccept();
              }
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            Upload Photo Now
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            className="w-full"
          >
            I'll Do It Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
