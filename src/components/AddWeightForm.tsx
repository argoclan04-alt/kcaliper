import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Scale, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddWeightFormProps {
  unit: 'kg' | 'lbs';
  onSubmit: (weight: number, date: string, notes: string) => void;
  loading?: boolean;
  existingDates?: string[]; // Array of existing dates to check for duplicates
}

export function AddWeightForm({ unit, onSubmit, loading = false, existingDates = [] }: AddWeightFormProps) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    // Check for duplicate date
    if (existingDates.includes(date)) {
      toast.error('A weight entry already exists for this date. Please choose a different date or edit the existing entry.');
      return;
    }
    
    onSubmit(weightValue, date, notes);
    
    // Reset form
    setWeight('');
    setNotes('');
    // Keep date as today for next entry
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scale className="w-5 h-5" />
          Record Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Weight ({unit})
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={`Enter weight in ${unit}`}
              required
              className="text-lg"
            />
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
            />
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
              placeholder="Add any relevant notes (e.g., meal timing, training, etc.)"
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !weight}
          >
            {loading ? 'Recording...' : 'Record Weight'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}