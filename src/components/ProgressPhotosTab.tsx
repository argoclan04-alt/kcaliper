import { useState } from 'react';
import { PhysiquePhoto } from '../types/weight-tracker';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Camera, Upload, ChevronLeft, ChevronRight, ZoomIn, Calendar, Image as ImageIcon } from 'lucide-react';

interface CheckIn {
  id: string;
  date: string;
  weight?: number;
  revisionNumber: number;
  photos: {
    frontal?: string;
    leftProfile?: string;
    back?: string;
    rightProfile?: string;
  };
  comments?: string;
}

interface ProgressPhotosTabProps {
  clientId: string;
  clientName: string;
  physiquePhotos: PhysiquePhoto[];
  weightEntries?: { date: string; weight: number }[];
  isCoachView: boolean;
  onUploadPhoto?: (file: File, viewType: string) => void;
}

export function ProgressPhotosTab({
  clientId,
  clientName,
  physiquePhotos,
  weightEntries = [],
  isCoachView,
  onUploadPhoto
}: ProgressPhotosTabProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<{ before?: string; after?: string }>({});

  // Group photos by date for check-in style view
  const photosByDate = physiquePhotos.reduce((acc, photo) => {
    const dateKey = photo.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(photo);
    return acc;
  }, {} as Record<string, PhysiquePhoto[]>);

  const sortedDates = Object.keys(photosByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Get weight for a specific date
  const getWeightForDate = (date: string) => {
    const entry = weightEntries.find(e => e.date === date);
    return entry?.weight;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, viewType: string) => {
    const file = e.target.files?.[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(file, viewType);
    }
  };

  const viewTypeLabels: Record<string, string> = {
    front: 'Frontal',
    side: 'Lateral',
    back: 'Posterior'
  };

  if (physiquePhotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Camera className="w-10 h-10 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Sin fotos de progreso
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {isCoachView 
            ? `${clientName} no ha subido fotos de progreso todavía. Puedes solicitar fotos usando el botón "Request Photo".`
            : 'Sube tus fotos de progreso para visualizar tu transformación. Tu coach podrá ver tus fotos y darte feedback.'}
        </p>
        {!isCoachView && (
          <div className="flex gap-3">
            {['front', 'side', 'back'].map(viewType => (
              <label key={viewType} className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, viewType)}
                />
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    {viewTypeLabels[viewType]}
                  </span>
                </Button>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Fotos de Progreso
          </h3>
          <Badge variant="secondary" className="text-xs">
            {physiquePhotos.length} fotos
          </Badge>
        </div>
        <div className="flex gap-2">
          {!isCoachView && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'front')}
              />
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Subir Foto
                </span>
              </Button>
            </label>
          )}
          {sortedDates.length >= 2 && (
            <Button
              variant={comparisonMode ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => {
                setComparisonMode(!comparisonMode);
                setComparePhotos({});
              }}
            >
              <ZoomIn className="w-4 h-4" />
              {comparisonMode ? 'Cancelar' : 'Comparar'}
            </Button>
          )}
        </div>
      </div>

      {/* Photo Grid by Date */}
      <div className="space-y-4">
        {sortedDates.map((date, dateIndex) => {
          const photos = photosByDate[date];
          const weight = getWeightForDate(date);
          const formattedDate = new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <Card key={date} className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                {/* Date Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                    {weight && (
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30">
                        {weight.toFixed(1)} kg
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    #{sortedDates.length - dateIndex}
                  </Badge>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-800 ${
                        comparisonMode ? 'ring-2 ring-transparent hover:ring-indigo-500' : ''
                      }`}
                      onClick={() => {
                        if (comparisonMode) {
                          if (!comparePhotos.before) {
                            setComparePhotos({ before: photo.photoUrl });
                          } else if (!comparePhotos.after) {
                            setComparePhotos({ ...comparePhotos, after: photo.photoUrl });
                          }
                        } else {
                          setSelectedPhoto(photo.photoUrl);
                        }
                      }}
                    >
                      <img
                        src={photo.photoUrl}
                        alt={`Progress ${photo.viewType || 'photo'}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {photo.viewType && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-xs text-white font-medium">
                            {viewTypeLabels[photo.viewType] || photo.viewType}
                          </span>
                        </div>
                      )}
                      {photo.notes && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-white text-[10px]">💬</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Photo comments if any */}
                {photos.some(p => p.notes) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    {photos.filter(p => p.notes).map(p => (
                      <p key={p.id} className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{viewTypeLabels[p.viewType || ''] || 'Nota'}:</span>{' '}
                        {p.notes}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Mode Banner */}
      {comparisonMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50">
          <span className="text-sm">
            {!comparePhotos.before
              ? 'Selecciona la foto ANTES'
              : !comparePhotos.after
              ? 'Selecciona la foto DESPUÉS'
              : 'Comparación lista'}
          </span>
          {comparePhotos.before && comparePhotos.after && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedPhoto('comparison')}
            >
              Ver Comparación
            </Button>
          )}
        </div>
      )}

      {/* Single Photo Lightbox */}
      {selectedPhoto && selectedPhoto !== 'comparison' && (
        <Dialog open={true} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Foto de Progreso
              </DialogTitle>
            </DialogHeader>
            <img
              src={selectedPhoto}
              alt="Progress photo"
              className="w-full rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Comparison Lightbox */}
      {selectedPhoto === 'comparison' && comparePhotos.before && comparePhotos.after && (
        <Dialog open={true} onOpenChange={() => {
          setSelectedPhoto(null);
          setComparisonMode(false);
          setComparePhotos({});
        }}>
          <DialogContent className="max-w-4xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Comparación de Progreso
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2 text-center">Antes</p>
                <img src={comparePhotos.before} alt="Before" className="w-full rounded-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2 text-center">Después</p>
                <img src={comparePhotos.after} alt="After" className="w-full rounded-lg" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
