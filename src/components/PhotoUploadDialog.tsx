import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Info, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
import { uploadPhotoToR2 } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  viewType?: 'front' | 'side' | 'back';
  clientName?: string;
  onSubmit: (photoUrl: string, notes: string, viewType?: 'front' | 'side' | 'back') => void;
}

interface PhotoPreview {
  id: string;
  url: string;
  file: File;
  selected: boolean;
}

export function PhotoUploadDialog({ open, onOpenChange, date, viewType = 'front', clientName = 'Client', onSubmit }: PhotoUploadDialogProps) {
  const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([]);
  const [notes, setNotes] = useState('');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setPhotoPreviews([]);
      setNotes('');
      setTutorialOpen(false);
      setIsCapturing(false);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: PhotoPreview[] = [];
      const fileArray = Array.from(files);
      
      fileArray.forEach((file, index) => {
        const url = URL.createObjectURL(file);
        newPreviews.push({
          id: `${Date.now()}_${index}`,
          url,
          file,
          selected: photoPreviews.length + newPreviews.length < 2
        });
      });
      
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
      setTutorialOpen(false);
      setIsCapturing(false);
    }
  };

  const togglePhotoSelection = (id: string) => {
    setPhotoPreviews(prev => {
      const selectedCount = prev.filter(p => p.selected).length;
      const photo = prev.find(p => p.id === id);
      
      // If trying to select more than 2, prevent it
      if (photo && !photo.selected && selectedCount >= 2) {
        toast.error('Maximum 2 photos allowed per view type');
        return prev;
      }
      
      return prev.map(p =>
        p.id === id ? { ...p, selected: !p.selected } : p
      );
    });
  };

  const removePhoto = (id: string) => {
    setPhotoPreviews(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async () => {
    const selectedPhotos = photoPreviews.filter(p => p.selected);
    
    if (selectedPhotos.length === 0) {
      toast.error('Por favor selecciona al menos una foto');
      return;
    }
    
    setIsUploading(true);
    try {
      // Create a copy of notes to send to onSubmit
      const currentNotes = notes;
      
      // Upload all selected photos in parallel
      const uploadPromises = selectedPhotos.map(async (photo) => {
        const r2Url = await uploadPhotoToR2(photo.file, {
          clientId: clientName.replace(/\s+/g, ''), // Temporary, ideal would be currentUser.id
          date,
          viewType
        });
        return r2Url;
      });

      const urls = await Promise.all(uploadPromises);

      // Call onSubmit for each photo (or modified useWeightTracker to handle multiple)
      urls.forEach((url) => {
        onSubmit(url, currentNotes, viewType);
      });

      setPhotoPreviews([]);
      setNotes('');
      setTutorialOpen(false);
      onOpenChange(false);
      toast.success(`${selectedPhotos.length} foto(s) subida(s) exitosamente`);
    } catch (error) {
      console.error('Error uploading to R2:', error);
      toast.error('Error al subir las fotos. Revisa tu conexión.');
    } finally {
      setIsUploading(false);
    }
  };

  const getViewTypeLabel = () => {
    switch (viewType) {
      case 'front': return 'Front View';
      case 'side': return 'Side View';
      case 'back': return 'Back View';
      default: return 'Front View';
    }
  };

  const handleCancel = () => {
    setPhotoPreviews([]);
    setNotes('');
    setTutorialOpen(false);
    setIsCapturing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Progress Photo - {getViewTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            This picture will only be seen by your coach
          </DialogDescription>
        </DialogHeader>

        {photoPreviews.length === 0 && (
          <Collapsible open={tutorialOpen} onOpenChange={setTutorialOpen} className="mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• <strong>Lighting:</strong> Consistent artificial light</li>
                  <li>• <strong>Location:</strong> Clean mirror, same spot</li>
                  <li>• <strong>No flexing:</strong> Stay relaxed and natural</li>
                  <li>• <strong>Minimal clothing:</strong> Shorts/underwear only</li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="space-y-4">
          {photoPreviews.length === 0 ? (
            <div className="grid gap-3">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-20 border-2 border-dashed"
                  onClick={() => {
                    setIsCapturing(true);
                    cameraInputRef.current?.click();
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-xs">Use Camera</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 border-2 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs">Select Files</span>
                  </div>
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                Maximum 2 photos per view type.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Select photos to upload (max 2)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {photoPreviews.map((photo) => (
                    <div key={photo.id} className="relative">
                      <div
                        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                          photo.selected ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => togglePhotoSelection(photo.id)}
                      >
                        <img
                          src={photo.url}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        {photo.selected && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(photo.id);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {photoPreviews.filter(p => p.selected).length} of 2 selected
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add More
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select More
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about these photos (e.g., lighting, time of day, how you're feeling...)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {photoPreviews.length > 0 && (
            <Button onClick={handleSubmit} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                `Subir ${photoPreviews.filter(p => p.selected).length} Foto(s)`
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}