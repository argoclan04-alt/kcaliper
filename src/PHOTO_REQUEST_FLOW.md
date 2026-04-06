# 📸 Sistema de Photo Request - Flujo Completo

## 🎯 Resumen

El sistema de Photo Request permite a los coaches solicitar fotos de progreso físico a sus clientes para trackear visualmente su transformación. El flujo está diseñado para ser no-invasivo pero efectivo, con recordatorios automáticos y validación de calidad de fotos.

---

## 🔄 FLUJO COMPLETO - Paso a Paso

### **PASO 1: Coach Solicita Foto** 🎓

**Ubicación:** Coach Dashboard → Cliente → Botón "Request Photo"

**Interfaz:**
```
┌──────────────────────────────────────────┐
│  Request Physique Photo - John Smith     │
├──────────────────────────────────────────┤
│                                          │
│  Photo View Type:                        │
│  ☑️ Front View  ⬜ Side View  ⬜ Back View│
│                                          │
│  Target Date:                            │
│  📅 [Selector de fecha]                  │
│                                          │
│  [View Photo Tutorial]  [Send Request]   │
└──────────────────────────────────────────┘
```

**Opciones del Coach:**
1. **Seleccionar tipo de vista:**
   - 🧍 **Front View** (Vista frontal)
   - ➡️ **Side View** (Vista lateral)
   - 🔄 **Back View** (Vista de espalda)

2. **Seleccionar fecha objetivo:**
   - Por defecto: mañana
   - Puede elegir cualquier fecha futura
   - La fecha pasará a "overdue" si no se cumple

3. **Ver tutorial** (Opcional):
   - Video YouTube Shorts sobre cómo tomar fotos correctas
   - Guidelines escritas con mejores prácticas

**Código:**
```typescript
requestPhoto(
  clientId: string,
  targetDate: string,
  viewType: 'front' | 'side' | 'back'
)
```

---

### **PASO 2: Sistema Crea la Solicitud** ⚙️

**Qué sucede internamente:**

1. **Se crea un PhotoRequest:**
```typescript
{
  id: 'photo_req_1234567890',
  requestedDate: '2025-01-20',  // Hoy
  targetDate: '2025-01-21',      // Fecha elegida por coach
  status: 'pending',
  viewType: 'front'
}
```

2. **Se crea una foto de ejemplo automáticamente:**
```typescript
{
  id: 'photo_example_1234567890',
  date: '2025-01-20',
  photoUrl: 'https://images.unsplash.com/...',  // Foto de ejemplo
  uploadedAt: '2025-01-20T10:30:00Z',
  notes: 'This is an example photo showing proper form and lighting',
  viewType: 'front',
  isExample: true  // ← Importante: marca que es ejemplo
}
```

3. **Se crea una notificación para el cliente:**
```typescript
{
  id: 'notif_1234567890',
  type: 'photo_requested',
  message: 'Your coach has requested a front view photo for Jan 21, 2025',
  date: '2025-01-20',
  isRead: false,
  data: {
    viewType: 'front',
    targetDate: '2025-01-21'
  }
}
```

**Resultado visual para el coach:**
```
✅ Photo request sent to John Smith
   Front view photo requested for Jan 21, 2025
```

---

### **PASO 3: Cliente Ve la Notificación** 📱

**Opción A - En el Panel de Notificaciones:**

Cuando el cliente inicia sesión, ve:

```
┌──────────────────────────────────────────┐
│  🔔 Notifications                (1 new) │
├──────────────────────────────────────────┤
│  📸 Your coach has requested a front     │
│     view photo for January 21, 2025      │
│                                          │
│     [Mark as Read]                       │
└──────────────────────────────────────────┘
```

**Opción B - PhotoRequestWarning (Modal Urgente):**

Si la solicitud está pendiente y el cliente registra peso, ve un modal:

```
┌──────────────────────────────────────────┐
│            🟠 (Animated)                 │
│                                          │
│   Photo Request from Your Coach          │
│                                          │
│   Your coach is requesting a front view  │
│   physique photo.                        │
│                                          │
│   Target date: Monday, January 21, 2025  │
├──────────────────────────────────────────┤
│  ⚠️  This is an urgent request. Please   │
│      upload your photo as soon as        │
│      possible to help your coach track   │
│      your progress.                      │
├──────────────────────────────────────────┤
│  [Upload Photo Now] (Feature disabled)   │
│  [I'll Do It Later]                      │
└──────────────────────────────────────────┘
```

**Nota:** Actualmente el botón "Upload Photo Now" está deshabilitado. El cliente debe ir manualmente a su logbook para subir la foto.

---

### **PASO 4: Cliente Sube la Foto** 📤

**Ubicación:** Client Logbook → Sección de fotos → Botón "Upload Photo"

**Interfaz del diálogo de subida:**

```
┌──────────────────────────────────────────┐
│  📸 Upload Progress Photo - Front View   │
├──────────────────────────────────────────┤
│  Take or upload your front view photo    │
│  for January 21, 2025                    │
├──────────────────────────────────────────┤
│  ℹ️ [Watch Tutorial] ▼                   │
├──────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐     │
│  │   📷 Camera  │  │  ⬆️ Upload   │     │
│  │              │  │              │     │
│  └──────────────┘  └──────────────┘     │
├──────────────────────────────────────────┤
│  [Cancel]                                │
└──────────────────────────────────────────┘
```

**Proceso:**

1. **Cliente puede elegir:**
   - 📷 **Abrir cámara** (en móvil)
   - 📁 **Seleccionar archivo** (desde galería/disco)

2. **Vista previa:**
```
┌──────────────────────────────────────────┐
│  Preview:                                │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  │        [FOTO PREVIEW]        ❌  │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Notes (Optional):                       │
│  ┌──────────────────────────────────┐   │
│  │ Feeling good today, proper       │   │
│  │ lighting used                    │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Cancel]              [Upload Photo]    │
└──────────────────────────────────────────┘
```

3. **Cliente agrega notas opcionales:**
   - Ej: "Morning photo, after breakfast"
   - Ej: "Used artificial light"
   - Ej: "Feeling bloated today"

4. **Cliente hace clic en "Upload Photo"**

---

### **PASO 5: Sistema Procesa la Foto** ⚙️

**Qué sucede internamente:**

1. **Se crea el PhysiquePhoto:**
```typescript
{
  id: 'photo_1234567891',
  date: '2025-01-21',
  photoUrl: 'data:image/jpeg;base64,...',  // Base64 de la imagen
  uploadedAt: '2025-01-21T08:15:00Z',
  notes: 'Morning photo, proper lighting used',
  viewType: 'front',
  isExample: false,  // ← Foto real del cliente
  fileName: '21-01-2025_front.jpg'  // Formato para exportar
}
```

2. **Se actualiza el PhotoRequest a "completed":**
```typescript
{
  id: 'photo_req_1234567890',
  requestedDate: '2025-01-20',
  targetDate: '2025-01-21',
  status: 'completed',  // ← Cambiado de 'pending'
  completedAt: '2025-01-21T08:15:00Z',
  photoId: 'photo_1234567891',  // ← Link a la foto
  viewType: 'front'
}
```

3. **Se crea una alerta para el coach:**
```typescript
{
  id: 'alert-1234567891',
  clientId: 'client_123',
  type: 'weight_modified',  // (usando tipo existente)
  message: 'John Smith uploaded a front photo for Jan 21',
  date: '2025-01-21',
  isRead: false
}
```

**Nombre del archivo generado:**
- Formato: `dd-mm-yyyy_viewType.jpg`
- Ejemplo: `21-01-2025_front.jpg`
- Este archivo se puede exportar a la carpeta "fotos extra" del cliente

---

### **PASO 6: Coach Ve la Foto** 👀

**El coach recibe notificación:**

```
┌──────────────────────────────────────────┐
│  🔔 New Alert                            │
├──────────────────────────────────────────┤
│  📸 John Smith uploaded a front photo    │
│     for Jan 21                           │
│                                          │
│     [View]  [Mark as Read]               │
└──────────────────────────────────────────┘
```

**En el perfil del cliente, aparece:**

```
┌──────────────────────────────────────────┐
│  Physique Photos                    1    │
├──────────────────────────────────────────┤
│  📸 Front View - Jan 21, 2025            │
│     "Morning photo, proper lighting..."  │
│                                          │
│  [View Photo] [Download]                 │
└──────────────────────────────────────────┘
```

---

## 📊 Estados de PhotoRequest

### **1. PENDING** (Pendiente)
- Cliente aún no ha subido la foto
- Se muestra en notificaciones del cliente
- Aparece PhotoRequestWarning al registrar peso

### **2. COMPLETED** (Completado)
- Cliente subió la foto exitosamente
- Coach recibe alerta
- Ya no aparece el warning

### **3. OVERDUE** (Vencido)
- La targetDate ya pasó y no se subió foto
- Sistema podría generar recordatorio adicional
- Coach puede ver que está atrasado

### **4. DECLINED** (Rechazado)
- Cliente presionó "I'll Do It Later"
- Solicitud sigue activa pero marcada como pospuesta
- Puede volver a completarse después

---

## 🎨 Tutorial de Fotos (Embedded en el Sistema)

### **Video Tutorial:**
- **Fuente:** YouTube Shorts
- **URL:** `https://www.youtube.com/embed/S1Gb3-CMblM`
- **Duración:** Corto (formato Shorts - 9:16)
- **Contenido:** Cómo tomar fotos de progreso correctamente

### **Guidelines Escritas:**

```
📸 Key Guidelines:

• Lighting: Use consistent artificial light (avoid natural light that changes)
• Location: Front of a clean mirror, same spot every time
• Clothing: Minimal clothing (shorts/underwear), no shirt
• Posture: Stand relaxed, do NOT flex or tense muscles
• Timing: Take photos at the same time (ideally morning, after weighing)
• Distance: Same distance from mirror each session
```

### **Vistas Explicadas:**

| Vista | Icono | Instrucción |
|-------|-------|-------------|
| **Front View** | 🧍 | Face camera, arms at sides |
| **Side View** | ➡️ | 90° to camera, relaxed |
| **Back View** | 🔄 | Back to camera, natural |

---

## 💡 Ejemplos de Uso Real

### **Ejemplo 1: Cliente en Fat Loss**
```
Semana 1:
- Coach solicita: Front view para el 28 de enero
- Cliente sube foto el 28 de enero a las 7am
- Coach ve reducción visible de grasa abdominal
- Coach felicita y ajusta macros

Semana 4:
- Coach solicita: Side view para el 18 de febrero
- Cliente compara con foto anterior
- Motivación aumentada al ver progreso
```

### **Ejemplo 2: Cliente en Lean Bulk**
```
Mes 1:
- Coach solicita: Front + Side view
- Cliente sube ambas fotos
- Coach confirma que ganancia es principalmente músculo

Mes 2:
- Coach compara fotos del mes 1 vs mes 2
- Detecta que está ganando grasa muy rápido
- Ajusta calorías ligeramente hacia abajo
```

### **Ejemplo 3: Cliente Olvidadizo**
```
Lunes:
- Coach solicita foto para el martes
- Cliente ve notificación pero ignora

Martes:
- Cliente registra peso
- Aparece PhotoRequestWarning (modal urgente)
- Cliente presiona "I'll Do It Later"

Miércoles:
- Notificación sigue visible
- Cliente finalmente sube la foto
- Coach recibe alerta
```

---

## 🔧 Configuración Técnica

### **Tipos de datos:**

```typescript
// Solicitud de foto
interface PhotoRequest {
  id: string;
  requestedDate: string;      // Fecha en que coach solicitó
  targetDate: string;          // Fecha objetivo para subir
  status: 'pending' | 'completed' | 'overdue' | 'declined';
  completedAt?: string;        // Fecha en que se completó
  photoId?: string;            // ID de la foto subida
  viewType: 'front' | 'side' | 'back';
}

// Foto de físico
interface PhysiquePhoto {
  id: string;
  date: string;                // Fecha de la foto
  photoUrl: string;            // Base64 o URL
  uploadedAt: string;          // Timestamp de subida
  notes?: string;              // Notas del cliente
  viewType?: 'front' | 'side' | 'back';
  isExample?: boolean;         // true = foto de ejemplo, false = foto real
  fileName?: string;           // Formato: dd-mm-yyyy_viewType.jpg
}
```

### **Ubicación en el código:**

- **Hook principal:** `/hooks/useWeightTracker.ts`
  - `requestPhoto()` - línea 290
  - `uploadPhoto()` - línea 336

- **Componentes:**
  - `/components/PhotoRequestDialog.tsx` - Dialog del coach
  - `/components/PhotoUploadDialog.tsx` - Dialog del cliente
  - `/components/PhotoRequestWarning.tsx` - Warning urgente
  - `/components/ClientNotifications.tsx` - Panel de notificaciones

---

## ⚠️ Limitaciones Actuales

### **1. Photo Upload en Warning está deshabilitado**
```typescript
// En PhotoRequestWarning.tsx línea 69:
<Button
  disabled  // ← Deshabilitado
  className="opacity-50 cursor-not-allowed"
>
  Upload Photo Now (Coming Soon)
</Button>
```

**Razón:** El flujo completo de upload desde el warning no está implementado aún. El cliente debe ir manualmente al logbook.

### **2. No hay compresión de imágenes**
- Las fotos se guardan como base64 completo
- Puede ser pesado en memoria
- Recomendación: implementar compresión antes de guardar

### **3. Solo una solicitud pendiente a la vez**
```typescript
// En PhotoRequestDialog.tsx:
hasPendingRequest && (
  <div className="bg-amber-50">
    This client already has a pending photo request.
    They must upload that photo before you can send another request.
  </div>
)
```

**Razón:** Evita spam de solicitudes. El cliente debe completar la actual antes de recibir otra.

---

## 🚀 Mejoras Futuras Sugeridas

1. **Comparación lado a lado:**
   - Mostrar foto actual vs. foto anterior automáticamente
   - Slider para ver el antes/después

2. **Métricas visuales:**
   - Overlay de medidas corporales sobre las fotos
   - Tracking de circunferencias (brazo, cintura, etc.)

3. **Galería temporal:**
   - Timeline de todas las fotos del cliente
   - Animación de transformación (GIF)

4. **Upload directo desde warning:**
   - Habilitar el botón "Upload Photo Now"
   - Abrir PhotoUploadDialog directamente

5. **Recordatorios automáticos:**
   - Si targetDate se acerca y no hay foto
   - Notificación push o email

6. **Validación de calidad:**
   - Detectar si la foto tiene buena iluminación
   - Verificar que sea una foto de cuerpo completo
   - Sugerir rehacer si calidad es baja

---

## 📈 Flujo Visual Completo

```
COACH                           SISTEMA                         CLIENTE
  │                               │                               │
  ├─ Request Photo ──────────────>│                               │
  │  (Front view, Jan 21)         │                               │
  │                               ├─ Create PhotoRequest          │
  │                               ├─ Create Example Photo         │
  │                               ├─ Create Notification ───────>│
  │                               │                               │
  │                               │                        ┌──────┤
  │                               │                        │ Ve   │
  │                               │                        │ noti │
  │                               │                        └──────┤
  │                               │                               │
  │                               │                        ┌──────┤
  │                               │                        │ Sube │
  │                               │<───── Upload Photo ────┤ foto │
  │                               │  (with notes)          └──────┤
  │                               │                               │
  │                               ├─ Create PhysiquePhoto         │
  │                               ├─ Update Request (completed)   │
  │<───── Alert Notification ─────┤─ Create Alert for Coach       │
  │  "John uploaded photo"        │                               │
  │                               │                               │
  ├─ View Photo ─────────────────>│                               │
  │                               │                               │
  ├─ Download Photo ──────────────>│                               │
  │  21-01-2025_front.jpg         │                               │
  │                               │                               │
```

---

**Última actualización:** Enero 2025  
**Versión del sistema:** React + TypeScript con mock data
