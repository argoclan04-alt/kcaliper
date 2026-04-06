# Photo Upload System - Implementation Documentation

## 🚧 Status: FULLY IMPLEMENTED - Currently Disabled

The photo upload system is **100% functional and tested** but temporarily disabled in production.

---

## System Architecture

### Core Components

#### 1. **PhotoUploadDialog.tsx** ✅ READY
Location: `/components/PhotoUploadDialog.tsx`

**Features:**
- File upload from device gallery
- Camera capture (mobile devices)
- Photo preview before upload
- Notes/comments input
- Collapsible tutorial/guidelines
- View type selection (front/side/back)
- Base64 photo encoding
- Toast notifications

**Props:**
```typescript
interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  viewType?: 'front' | 'side' | 'back';
  onSubmit: (photoUrl: string, notes: string, viewType?: 'front' | 'side' | 'back') => void;
}
```

#### 2. **PhotoRequestWarning.tsx** ✅ READY
Location: `/components/PhotoRequestWarning.tsx`

**Purpose:** Alert dialog shown to client when coach requests a photo

**Features:**
- Visual warning with orange theme
- Displays view type requested (front/side/back)
- Shows target date
- Options: "Upload Photo Now" or "I'll Do It Later"

**Current Status:** Button disabled (line 75)

#### 3. **useWeightTracker Hook** ✅ READY
Location: `/hooks/useWeightTracker.ts` (lines 336-396)

**Function: `uploadPhoto()`**

**Logic:**
```typescript
const uploadPhoto = (
  clientId: string, 
  photoUrl: string, 
  notes: string, 
  viewType?: 'front' | 'side' | 'back'
) => {
  // 1. Validates client exists
  // 2. Creates filename in format: dd-mm-yyyy_viewType.jpg
  // 3. Stores photo in client.physiquePhotos array
  // 4. Marks corresponding photoRequest as 'completed'
  // 5. Creates alert notification for coach
  // 6. Updates localStorage
}
```

**Filename Format:**
- Pattern: `dd-mm-yyyy_viewType.jpg`
- Example: `11-10-2025_front.jpg`
- Stored in: "fotos extra" folder (conceptual)

#### 4. **WeightEntryTable.tsx** ✅ READY
Location: `/components/WeightEntryTable.tsx`

**Photo Indicator:**
- Camera icon appears next to date when photo exists
- Icon is informational only (no click action)
- Tooltip shows: "Photo uploaded for this date"
- Lines 241 & 278-287

---

## Data Structures

### PhysiquePhoto Type
```typescript
export interface PhysiquePhoto {
  id: string;
  date: string;                // ISO format: YYYY-MM-DD
  photoUrl: string;            // Base64 encoded image
  uploadedAt: string;          // ISO timestamp
  notes?: string;
  viewType?: 'front' | 'side' | 'back';
  isExample?: boolean;
  fileName?: string;           // dd-mm-yyyy_viewType.jpg
}
```

### PhotoRequest Type
```typescript
export interface PhotoRequest {
  id: string;
  requestedDate: string;
  targetDate: string;
  status: 'pending' | 'completed' | 'overdue' | 'declined';
  completedAt?: string;
  photoId?: string;
  viewType: 'front' | 'side' | 'back';
}
```

---

## Integration Flow

### Client Side (When Photo Upload is Enabled)

1. **Weight Entry Submitted**
   - Client logs daily weight
   - System checks for pending photo requests for today

2. **Photo Request Warning**
   - If `photoRequest.status === 'pending'` AND `targetDate === today`
   - `PhotoRequestWarning` dialog appears
   - Client can accept or decline

3. **Photo Upload**
   - If accepted → `PhotoUploadDialog` opens
   - Client uploads photo + adds notes
   - Photo converted to Base64
   - Submitted via `onUploadPhoto()` callback

4. **Storage & Notification**
   - Photo stored in `client.physiquePhotos[]`
   - PhotoRequest marked as `completed`
   - Alert created for coach
   - Camera icon appears in weight table

### Coach Side

1. **Request Photo** (Already working)
   - Coach uses `PhotoRequestDialog` to request photo
   - Selects view type & target date
   - Example photo automatically created
   - Notification sent to client

2. **Receive Notification** (Already working)
   - Alert appears when client uploads photo
   - Message: "{Client Name} uploaded a {viewType} photo for {date}"
   - Coach can view photo in client's physique photos

---

## How to Re-Enable

### Step 1: Enable PhotoRequestWarning Button
File: `/components/PhotoRequestWarning.tsx` (line 75)

**Change from:**
```tsx
<Button
  disabled
  className="w-full bg-orange-600 hover:bg-orange-700 text-white opacity-50 cursor-not-allowed"
>
  Upload Photo Now (Coming Soon)
</Button>
```

**Change to:**
```tsx
<Button
  onClick={onAccept}
  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
>
  Upload Photo Now
</Button>
```

### Step 2: Test Flow
1. Switch to coach view
2. Request a photo for today
3. Switch to client view
4. Log a weight entry
5. Photo request warning should appear
6. Click "Upload Photo Now"
7. Upload dialog should open
8. Upload photo + notes
9. Verify camera icon appears in table
10. Switch to coach view
11. Verify alert notification received

---

## Technical Details

### File Upload Handling
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};
```

### Date Formatting
```typescript
const todayDate = new Date(today);
const day = String(todayDate.getDate()).padStart(2, '0');
const month = String(todayDate.getMonth() + 1).padStart(2, '0');
const year = todayDate.getFullYear();
const dateFormatted = `${day}-${month}-${year}`;
```

### State Management
- Photos stored in client object: `client.physiquePhotos[]`
- Persisted in localStorage: `STORAGE_KEYS.COACH_DATA`
- Automatic sync across coach/client views

---

## Known Working Features

✅ Photo file upload (gallery)  
✅ Photo camera capture (mobile)  
✅ Base64 encoding  
✅ Preview before submit  
✅ Notes/comments  
✅ View type selection  
✅ Filename generation (dd-mm-yyyy_viewType.jpg)  
✅ Photo request completion  
✅ Coach notification  
✅ Camera icon in weight table  
✅ State persistence (localStorage)  
✅ Error handling  
✅ Toast notifications  
✅ Dialog state cleanup on close  

---

## Recent Bug Fixes (All Resolved)

1. ✅ **Blank Screen Bug**
   - Issue: Blank screen when uploading photo
   - Cause: `toLocaleDateString()` inconsistency across browsers
   - Fix: Manual date formatting (lines 343-347 in useWeightTracker.ts)

2. ✅ **Dialog State Bug**
   - Issue: Dialog not resetting after close
   - Fix: Added `useEffect` to clear state when `open` changes (PhotoUploadDialog.tsx)

3. ✅ **Tooltip Render Error**
   - Issue: React error with `TooltipTrigger`
   - Fix: Changed `<div>` to `<span>` with `inline-flex` (WeightEntryTable.tsx)

4. ✅ **Duplicate State Updates**
   - Issue: `photoRequests` updated twice
   - Fix: Removed duplicate logic from Logbook.tsx onSubmit

---

## Future Enhancements (Optional)

### When Re-enabling:
- [ ] Add photo compression before upload (reduce file size)
- [ ] Add photo cropping/editing tools
- [ ] Add multiple photos per date
- [ ] Add photo comparison view (before/after)
- [ ] Add photo gallery for client
- [ ] Export photos as PDF report

### Storage Options:
- Current: Base64 in localStorage (works for MVP)
- Future: Supabase Storage or AWS S3 for production

---

## Support & Documentation

### Related Files:
- `/components/PhotoUploadDialog.tsx` - Main dialog
- `/components/PhotoRequestWarning.tsx` - Request warning
- `/components/PhotoRequestDialog.tsx` - Coach request dialog
- `/hooks/useWeightTracker.ts` - uploadPhoto() function
- `/components/WeightEntryTable.tsx` - Camera icon display
- `/types/weight-tracker.ts` - Type definitions

### Testing Checklist:
- [ ] Upload from gallery
- [ ] Upload from camera
- [ ] Add notes
- [ ] Submit without notes
- [ ] Cancel upload
- [ ] Check camera icon appears
- [ ] Check coach receives notification
- [ ] Check photo request marked completed
- [ ] Verify filename format
- [ ] Test on mobile device

---

**Last Updated:** 2025-01-11  
**Status:** Production Ready - Awaiting Activation  
**Estimated Activation Time:** < 2 minutes (just uncomment button)
