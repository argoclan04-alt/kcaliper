import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

interface AddNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes: string;
  weight: number;
  date: string;
  unit: string;
}

export function AddNotesDialog({
  isOpen,
  onClose,
  onSave,
  initialNotes,
  weight,
  date,
  unit
}: AddNotesDialogProps) {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    onClose();
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Notes</h1>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCancel}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Weight Display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weight Recorded</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {weight.toFixed(1)} {unit}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(date)}
          </div>
        </div>

        {/* Notes Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this entry..."
            rows={8}
            className="w-full resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            autoFocus
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add any observations, feelings, or context about this weight entry
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          Confirm
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
