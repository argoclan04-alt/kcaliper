import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Upload, FileText } from 'lucide-react';
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

interface NutritionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onSubmit: (data: {
    startDate: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    pdfUrl?: string;
    notes?: string;
  }) => void;
}

export function NutritionDialog({ open, onOpenChange, clientName, onSubmit }: NutritionDialogProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [notes, setNotes] = useState('');
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result as string);
        setPdfName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!calories || !protein || !carbs || !fats) {
      toast.error('Please fill in all macro fields');
      return;
    }

    onSubmit({
      startDate: formatDate(startDate, 'yyyy-MM-dd'),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      pdfUrl: pdfPreview || undefined,
      notes
    });

    // Reset form
    setStartDate(new Date());
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setNotes('');
    setPdfPreview(null);
    setPdfName('');
    onOpenChange(false);
    toast.success('Nutrition data added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Nutrition Data - {clientName}</DialogTitle>
          <DialogDescription>
            Set calorie and macro targets. This will be applied to all weight entries from the start date onwards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(startDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-600">
              All weight entries from this date will be linked to these macros
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 2000"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="e.g., 150"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="e.g., 200"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                placeholder="e.g., 60"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Diet Plan PDF (Optional)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {!pdfPreview ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-2 border rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm flex-1 truncate">{pdfName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPdfPreview(null);
                    setPdfName('');
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this nutrition plan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Nutrition Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
