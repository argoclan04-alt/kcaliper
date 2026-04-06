import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Scale, Calendar, FileText, X } from 'lucide-react';

interface AddEditWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (weight: number, date: string, notes: string) => void;
  unit: 'kg' | 'lbs';
  mode?: 'add' | 'edit';
  initialData?: {
    weight: number;
    date: string;
    notes: string;
  };
}

export function AddEditWeightDialog({
  open,
  onOpenChange,
  onSubmit,
  unit,
  mode = 'add',
  initialData
}: AddEditWeightDialogProps) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [inputUnit, setInputUnit] = useState<'kg' | 'lbs'>(unit);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setWeight(initialData.weight.toString());
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    } else {
      setWeight('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setInputUnit(unit);
  }, [initialData, mode, unit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    // Convert weight to the target unit if needed
    if (inputUnit !== unit) {
      if (unit === 'kg' && inputUnit === 'lbs') {
        weightValue = weightValue / 2.20462;
      } else if (unit === 'lbs' && inputUnit === 'kg') {
        weightValue = weightValue * 2.20462;
      }
    }
    
    onSubmit(weightValue, date, notes);
    
    // Reset form
    setWeight('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  const toggleInputUnit = () => {
    const currentWeight = parseFloat(weight);
    if (!isNaN(currentWeight) && currentWeight > 0) {
      // Convert the displayed weight
      if (inputUnit === 'kg') {
        setWeight((currentWeight * 2.20462).toFixed(1));
        setInputUnit('lbs');
      } else {
        setWeight((currentWeight / 2.20462).toFixed(1));
        setInputUnit('kg');
      }
    } else {
      setInputUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            {mode === 'add' ? 'Record Weight' : 'Edit Weight Entry'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new weight entry. You can select a past date if needed.'
              : 'Update the weight entry details.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`Enter weight in ${inputUnit}`}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={toggleInputUnit}
                className="w-20"
              >
                {inputUnit.toUpperCase()}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your scale shows {inputUnit}? No problem, we'll convert it to {unit}.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500">
              Defaults to today, but you can select a past date.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., felt bloated, training session before weighing, etc."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {mode === 'add' ? 'Record Weight' : 'Update Entry'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
