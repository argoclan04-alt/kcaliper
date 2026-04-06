# Weight Tracker - FastAPI Endpoints Documentation

**Documentación completa de endpoints necesarios para la integración**

---

## 📡 CONFIGURACIÓN BASE

### URL Base
```
http://localhost:8000/api
```

### Headers Comunes
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Autenticación (Opcional)
Si implementas auth, agregar:
```json
{
  "Authorization": "Bearer {token}"
}
```

---

## 👨‍⚕️ COACH ENDPOINTS

### 1. Get Coach Dashboard
Obtiene todos los datos del coach incluyendo clientes y alertas.

```http
GET /api/coach/dashboard
```

**Response 200:**
```json
{
  "coach": {
    "id": "coach1",
    "name": "Dr. Carlos Rodriguez",
    "email": "carlos@argotrainer.com",
    "clients": [...]
  },
  "alerts": [...],
  "unreadCount": 4
}
```

**Código Python (FastAPI):**
```python
@app.get("/api/coach/dashboard")
async def get_coach_dashboard():
    coach = get_coach_from_db()  # Tu lógica
    alerts = get_alerts_from_db()  # Tu lógica
    
    return {
        "coach": coach,
        "alerts": alerts,
        "unreadCount": len([a for a in alerts if not a.get("isRead")])
    }
```

---

### 2. Get Clients List
Lista de todos los clientes del coach.

```http
GET /api/coach/clients
```

**Response 200:**
```json
[
  {
    "id": "client1",
    "name": "María González",
    "email": "maria@example.com",
    "unit": "kg",
    "targetWeeklyRate": -0.3,
    "lastEntry": {
      "date": "2025-10-08",
      "weight": 81.2
    },
    "totalEntries": 14,
    "unreadAlerts": 2
  },
  ...
]
```

---

### 3. Get Client Details
Detalles completos de un cliente específico.

```http
GET /api/coach/clients/{client_id}
```

**Response 200:**
```json
{
  "id": "client1",
  "name": "María González",
  "email": "maria@example.com",
  "unit": "kg",
  "country": "Spain",
  "targetWeeklyRate": -0.3,
  "weightEntries": [
    {
      "id": "1",
      "date": "2025-10-08",
      "weight": 81.2,
      "notes": "",
      "recordedBy": "client",
      "movingAverage": 81.0,
      "weeklyRate": -0.2
    },
    ...
  ],
  "milestone": 78.0,
  "milestoneAchieved": false,
  "showMovingAverage": true,
  "physiquePhotos": [],
  "photoRequests": []
}
```

---

### 4. Get Alerts
Todas las alertas del coach.

```http
GET /api/coach/alerts
```

**Query Parameters:**
- `unread_only` (boolean) - Solo no leídas
- `client_id` (string) - Filtrar por cliente
- `type` (string) - Filtrar por tipo

**Response 200:**
```json
[
  {
    "id": "alert1",
    "clientId": "client1",
    "type": "lowest",
    "message": "María González has reached a new lowest weight: 80.6 kg",
    "date": "2025-09-28",
    "isRead": false,
    "entryId": "11"
  },
  ...
]
```

---

### 5. Mark Alert as Read
Marcar una alerta como leída.

```http
POST /api/coach/alerts/{alert_id}/read
```

**Response 200:**
```json
{
  "success": true,
  "message": "Alert marked as read"
}
```

**Código Python:**
```python
@app.post("/api/coach/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    update_alert_status(alert_id, is_read=True)  # Tu lógica
    return {"success": True, "message": "Alert marked as read"}
```

---

### 6. Update Target Rate
Actualizar el target weekly rate de un cliente.

```http
PUT /api/coach/clients/{client_id}/target-rate
```

**Request Body:**
```json
{
  "targetWeeklyRate": -0.5
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Target rate updated",
  "data": {
    "clientId": "client1",
    "targetWeeklyRate": -0.5
  }
}
```

---

### 7. Update Client Settings
Actualizar configuración de notificaciones y otros settings.

```http
PUT /api/coach/clients/{client_id}/settings
```

**Request Body:**
```json
{
  "notifyLowest": true,
  "notifyHighest": false,
  "notifyRateDeviation": true,
  "milestone": 75.0,
  "showMovingAverage": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Settings updated",
  "data": {...}
}
```

---

### 8. Request Photo
Coach solicita una foto al cliente.

```http
POST /api/coach/photo-request
```

**Request Body:**
```json
{
  "clientId": "client1",
  "targetDate": "2025-10-15",
  "viewType": "front"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Photo request sent",
  "data": {
    "id": "photo_req_123",
    "clientId": "client1",
    "targetDate": "2025-10-15",
    "viewType": "front",
    "status": "pending"
  }
}
```

---

## 👤 CLIENT ENDPOINTS

### 9. Get Client Dashboard
Datos del cliente actual incluyendo entradas y notificaciones.

```http
GET /api/client/dashboard
```

**Response 200:**
```json
{
  "client": {
    "id": "client1",
    "name": "María González",
    "unit": "kg",
    "targetWeeklyRate": -0.3,
    "weightEntries": [...],
    "notifications": [...]
  },
  "stats": {
    "currentWeight": 81.2,
    "lowestWeight": 80.6,
    "highestWeight": 81.5,
    "totalEntries": 14,
    "streak": 14
  }
}
```

---

### 10. Get Weight Entries
Lista de entradas de peso del cliente.

```http
GET /api/client/weights
```

**Query Parameters:**
- `start_date` (string) - YYYY-MM-DD
- `end_date` (string) - YYYY-MM-DD
- `limit` (int) - Número de resultados

**Response 200:**
```json
[
  {
    "id": "1",
    "date": "2025-10-08",
    "weight": 81.2,
    "notes": "",
    "recordedBy": "client",
    "movingAverage": 81.0,
    "weeklyRate": -0.2
  },
  ...
]
```

---

### 11. Add Weight Entry
Cliente agrega nueva entrada de peso.

```http
POST /api/client/weights
```

**Request Body:**
```json
{
  "weight": 81.2,
  "date": "2025-10-08",
  "notes": "Feeling great today!"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Weight recorded successfully",
  "data": {
    "id": "15",
    "date": "2025-10-08",
    "weight": 81.2,
    "notes": "Feeling great today!",
    "recordedBy": "client",
    "movingAverage": 81.0,
    "weeklyRate": -0.2
  },
  "alerts": [
    {
      "type": "lowest",
      "message": "You reached a new lowest weight!"
    }
  ]
}
```

**Código Python:**
```python
from pydantic import BaseModel
from datetime import datetime

class WeightEntryCreate(BaseModel):
    weight: float
    date: str
    notes: str = ""

@app.post("/api/client/weights")
async def add_weight_entry(entry: WeightEntryCreate, client_id: str):
    # 1. Validar datos
    if entry.weight <= 0 or entry.weight > 500:
        raise HTTPException(400, "Invalid weight value")
    
    # 2. Crear entrada
    new_entry = create_weight_entry(client_id, entry)  # Tu lógica
    
    # 3. Recalcular DEMA y weekly rate
    recalculate_entries(client_id)  # Usar las funciones de calculations.js
    
    # 4. Verificar alertas
    alerts = check_alerts(client_id, new_entry)  # Tu lógica
    
    return {
        "success": True,
        "message": "Weight recorded successfully",
        "data": new_entry,
        "alerts": alerts
    }
```

---

### 12. Update Weight Entry
Actualizar una entrada existente (solo notas para cliente).

```http
PUT /api/client/weights/{entry_id}
```

**Request Body:**
```json
{
  "notes": "Updated notes"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Entry updated",
  "data": {...}
}
```

---

### 13. Delete Weight Entry
Eliminar entrada de peso.

```http
DELETE /api/client/weights/{entry_id}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Entry deleted"
}
```

---

### 14. Upload Photo
Cliente sube foto de progreso.

```http
POST /api/client/photos
```

**Request Body:**
```json
{
  "photoUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "notes": "Front view progress",
  "viewType": "front",
  "date": "2025-10-08"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "id": "photo_123",
    "photoUrl": "https://storage.example.com/photos/photo_123.jpg",
    "uploadedAt": "2025-10-08T10:30:00Z",
    "viewType": "front",
    "fileName": "08-10-2025_front.jpg"
  }
}
```

**Código Python:**
```python
import base64
from io import BytesIO

class PhotoUpload(BaseModel):
    photoUrl: str  # Base64
    notes: str = ""
    viewType: str = "front"
    date: str

@app.post("/api/client/photos")
async def upload_photo(photo: PhotoUpload, client_id: str):
    # 1. Decodificar base64
    if photo.photoUrl.startswith('data:image'):
        photo_data = photo.photoUrl.split(',')[1]
    else:
        photo_data = photo.photoUrl
    
    image_bytes = base64.b64decode(photo_data)
    
    # 2. Guardar en storage (S3, local, etc.)
    filename = f"{photo.date.replace('-', '_')}_{photo.viewType}.jpg"
    file_url = save_photo_to_storage(image_bytes, filename)  # Tu lógica
    
    # 3. Crear registro en BD
    photo_record = {
        "id": generate_id(),
        "photoUrl": file_url,
        "uploadedAt": datetime.now().isoformat(),
        "viewType": photo.viewType,
        "fileName": filename,
        "notes": photo.notes
    }
    
    # 4. Notificar al coach
    create_alert_for_coach(client_id, "photo_uploaded", photo_record)
    
    return {
        "success": True,
        "message": "Photo uploaded successfully",
        "data": photo_record
    }
```

---

### 15. Get Notifications
Notificaciones del cliente.

```http
GET /api/client/notifications
```

**Response 200:**
```json
[
  {
    "id": "notif_1",
    "type": "target_rate_changed",
    "message": "Your coach updated your target rate to -0.5 kg/week",
    "date": "2025-10-08",
    "isRead": false,
    "data": {
      "oldTarget": -0.3,
      "newTarget": -0.5
    }
  },
  ...
]
```

---

### 16. Mark Notification as Read
Marcar notificación como leída.

```http
POST /api/client/notifications/{notification_id}/read
```

**Response 200:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 🔄 USER MANAGEMENT (Optional - Demo Only)

### 17. Switch User
Solo para ambiente de desarrollo/demo.

```http
POST /api/users/switch
```

**Request Body:**
```json
{
  "userId": "client1"
}
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "client1",
    "name": "María González",
    "role": "client"
  }
}
```

---

## 🔒 ERROR RESPONSES

### Formato Estándar
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Códigos HTTP Comunes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Ejemplos

**400 - Validación:**
```json
{
  "error": true,
  "message": "Invalid weight value",
  "code": "INVALID_WEIGHT",
  "details": {
    "field": "weight",
    "value": -5.0,
    "constraint": "must be positive"
  }
}
```

**404 - No encontrado:**
```json
{
  "error": true,
  "message": "Client not found",
  "code": "CLIENT_NOT_FOUND",
  "details": {
    "clientId": "invalid_id"
  }
}
```

---

## 📊 CÁLCULOS EN BACKEND

### IMPORTANTE: Implementar las Fórmulas

Para mantener consistencia, debes implementar los mismos cálculos en Python:

```python
def calculate_ema(values: list[float], periods: int = 10) -> list[float]:
    """
    Calculate Exponential Moving Average
    α = 2/(n+1)
    EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))
    """
    if not values:
        return []
    
    alpha = 2 / (periods + 1)
    ema_values = [values[0]]
    
    for i in range(1, len(values)):
        ema = (values[i] * alpha) + (ema_values[i-1] * (1 - alpha))
        ema_values.append(ema)
    
    return ema_values

def calculate_dema(entries: list, current_index: int) -> float:
    """
    Calculate Double Exponential Moving Average
    DEMA = (2 × EMA_n) - EMA(EMA_n)
    """
    # Implementar según calculations.js líneas 23-64
    pass

def calculate_weekly_rate(entries: list, current_index: int) -> float:
    """
    Calculate weekly rate using linear regression on DEMA
    Weekly Rate = slope × 7
    """
    # Implementar según calculations.js líneas 67-109
    pass
```

---

## 🧪 TESTING

### Postman Collection
```json
{
  "info": {
    "name": "Weight Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Coach Dashboard",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/coach/dashboard"
      }
    },
    ...
  ]
}
```

### cURL Examples

**Add Weight:**
```bash
curl -X POST http://localhost:8000/api/client/weights \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 81.2,
    "date": "2025-10-08",
    "notes": "Feeling good"
  }'
```

**Update Target Rate:**
```bash
curl -X PUT http://localhost:8000/api/coach/clients/client1/target-rate \
  -H "Content-Type: application/json" \
  -d '{"targetWeeklyRate": -0.5}'
```

---

## 📝 NOTAS FINALES

1. **CORS**: Asegúrate de habilitar CORS en FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Validación**: Usa Pydantic para validar todos los inputs
3. **Seguridad**: Implementa autenticación JWT si es producción
4. **Rate Limiting**: Considera limitar requests por usuario
5. **Logging**: Registra todas las operaciones importantes

---

**Última Actualización:** 2025-01-11  
**Versión API:** 1.0  
**Contacto:** Tu equipo de desarrollo
