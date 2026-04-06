import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CalendarIcon, Camera, User, Circle, ArrowRight, ChevronDown, X, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

function formatDate(date: Date, formatStr: string): string {
  if (formatStr === 'yyyy-MM-dd') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (formatStr === 'PPP') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  return date.toLocaleDateString();
}

interface PhotoRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onSubmit: (targetDate: string, viewType: 'front' | 'side' | 'back') => void;
  hasPendingRequest?: boolean;
}

export function PhotoRequestDialog({ open, onOpenChange, clientName, onSubmit, hasPendingRequest }: PhotoRequestDialogProps) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [viewType, setViewType] = useState<'front' | 'side' | 'back'>('front');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/S1Gb3-CMblM');
  const [editingVideo, setEditingVideo] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  const handleSubmit = () => {
    const targetDateStr = formatDate(selectedDate, 'yyyy-MM-dd');
    onSubmit(targetDateStr, viewType);
    onOpenChange(false);
    setShowTutorial(false);
    
    // Format date for notification
    const targetDate = new Date(targetDateStr);
    const todayCheck = new Date();
    const tomorrowCheck = new Date();
    tomorrowCheck.setDate(tomorrowCheck.getDate() + 1);
    
    let dateDisplay = '';
    if (targetDateStr === formatDate(todayCheck, 'yyyy-MM-dd')) {
      dateDisplay = 'today';
    } else if (targetDateStr === formatDate(tomorrowCheck, 'yyyy-MM-dd')) {
      dateDisplay = 'tomorrow';
    } else {
      dateDisplay = targetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    
    toast.success(`Photo request sent to ${clientName} for ${dateDisplay}`);
  };

  const handleVideoUrlUpdate = () => {
    if (customVideoUrl) {
      // Convert YouTube watch URL to embed URL if needed
      let embedUrl = customVideoUrl;
      if (customVideoUrl.includes('youtube.com/watch')) {
        const videoId = new URL(customVideoUrl).searchParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (customVideoUrl.includes('youtu.be/')) {
        const videoId = customVideoUrl.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      setVideoUrl(embedUrl);
      setEditingVideo(false);
      setCustomVideoUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Request Physique Photo
          </DialogTitle>
        </DialogHeader>

        {hasPendingRequest && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Pending Request:</strong> This client already has a pending photo request. They must upload that photo before you can send another request.
            </p>
          </div>
        )}

        {!showTutorial ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Photo View Type</Label>
              {/* Desktop: Border boxes */}
              <RadioGroup value={viewType} onValueChange={(value: any) => setViewType(value)} className="hidden md:block">
                <div className="grid grid-cols-3 gap-3">
                  <div className={`flex items-center space-x-2 border-2 rounded-lg p-3 cursor-pointer transition-colors ${viewType === 'front' ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <RadioGroupItem value="front" id="front" />
                    <Label htmlFor="front" className="cursor-pointer flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <User className="w-4 h-4" />
                      Front View
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border-2 rounded-lg p-3 cursor-pointer transition-colors ${viewType === 'side' ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <RadioGroupItem value="side" id="side" />
                    <Label htmlFor="side" className="cursor-pointer flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <ArrowRight className="w-4 h-4" />
                      Side View
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border-2 rounded-lg p-3 cursor-pointer transition-colors ${viewType === 'back' ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    <RadioGroupItem value="back" id="back" />
                    <Label htmlFor="back" className="cursor-pointer flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Circle className="w-4 h-4" />
                      Back View
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {/* Mobile: Text with bottom border */}
              <div className="flex md:hidden gap-0 border-b border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setViewType('front')}
                  className={`flex-1 py-3 text-sm transition-colors ${
                    viewType === 'front' 
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('side')}
                  className={`flex-1 py-3 text-sm transition-colors ${
                    viewType === 'side' 
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Side View
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('back')}
                  className={`flex-1 py-3 text-sm transition-colors ${
                    viewType === 'back' 
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Back View
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>Target Date</Label>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex">
                        <Info className="w-3 h-3 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="pointer-events-none">
                      <p className="text-xs max-w-xs">
                        The client will be prompted to take a photo after logging their weight on this date.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={formatDate(selectedDate, 'yyyy-MM-dd') === formatDate(today, 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  onClick={() => setSelectedDate(today)}
                  className="flex-1"
                >
                  Today
                </Button>
                <Button 
                  variant={formatDate(selectedDate, 'yyyy-MM-dd') === formatDate(tomorrow, 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  onClick={() => setSelectedDate(tomorrow)}
                  className="flex-1"
                >
                  Tomorrow
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(selectedDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => {
                      const dateStr = formatDate(date, 'yyyy-MM-dd');
                      const todayStr = formatDate(today, 'yyyy-MM-dd');
                      return dateStr < todayStr;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTutorial(true)}>
                View Photo Tutorial
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={hasPendingRequest}>
                Send Photo Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Section - Smaller */}
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] mx-auto" style={{ aspectRatio: '9/16' }}>
              <iframe
                className="w-full h-full rounded-lg"
                src={videoUrl}
                title="Physique Photo Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video URL Editor */}
            {editingVideo ? (
              <div className="space-y-2">
                <Label>YouTube Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL here"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                  />
                  <Button onClick={handleVideoUrlUpdate} size="sm">Set</Button>
                  <Button onClick={() => setEditingVideo(false)} variant="outline" size="sm">Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditingVideo(true)} className="w-full">
                Change Video
              </Button>
            )}

            {/* Key Guidelines - Collapsible, collapsed by default */}
            <Collapsible open={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Key Guidelines
                  <ChevronDown className={`w-4 h-4 transition-transform ${isGuidelinesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <li><strong className="text-gray-900 dark:text-gray-100">Iluminación:</strong> Usa luz artificial consistente (evita luz natural que cambia)</li>
                    <li><strong className="text-gray-900 dark:text-gray-100">Ubicación:</strong> Frente a un espejo limpio, mismo lugar cada vez</li>
                    <li><strong className="text-gray-900 dark:text-gray-100">Postura:</strong> No hagas fuerzas en los músculos, solo en el abdomen y botar mucho aire</li>
                    <li><strong className="text-gray-900 dark:text-gray-100">Momento:</strong> Procura haber hecho las necesidades básicas antes de tomarte la foto</li>
                    <li><strong className="text-gray-900 dark:text-gray-100">Distancia:</strong> Estandariza la distancia ya que afectará la luz y por ende, la foto, intenta recordar la posición</li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTutorial(false)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={hasPendingRequest}>
                Send Photo Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}