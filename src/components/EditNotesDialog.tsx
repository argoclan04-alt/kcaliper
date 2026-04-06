import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';

interface EditNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNotes: string;
  date: string;
  onSave: (notes: string) => void;
}

export function EditNotesDialog({
  open,
  onOpenChange,
  currentNotes,
  date,
  onSave
}: EditNotesDialogProps) {
  const [notes, setNotes] = useState(currentNotes);

  const handleSave = () => {
    onSave(notes);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Editar Nota</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(date)}
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-white">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega notas sobre tu peso, estado de ánimo, etc."
              className="min-h-[120px]"
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSave}
            >
              Guardar
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
