# Weight Tracker - HTML Conversion Progress

## 📊 Status: 30% Completado

**Última actualización:** 2025-01-11

---

## ✅ Completado

### 1. Estructura Base ✅
- [x] `index.html` - HTML principal con Tailwind CDN
- [x] Sistema de dark/light theme implementado
- [x] Variables CSS exactas del diseño original
- [x] Configuración de Tailwind
- [x] CDNs de librerías externas (Chart.js, Lucide, Day.js)
- [x] Estructura de contenedores y modales
- [x] Sistema de toast notifications
- [x] Loading overlay
- [x] Animaciones CSS (pulse, spin, slideIn)

### 2. JavaScript Core ✅
- [x] `utils.js` - 25+ funciones utilitarias
  - Formateo de fechas
  - Validaciones
  - Helpers de UI
  - Detección mobile/tablet/desktop
  - Manipulación de imágenes base64
  - Y más...

- [x] `calculations.js` - Motor de cálculos DEMA
  - `calculateEMA()` - Exponential Moving Average
  - `calculateDoubleExponentialMovingAverage()` - DEMA exacto
  - `calculateWeeklyRate()` - Regresión lineal sobre DEMA
  - `recalculateAllWeeklyRates()` - Recalcular todo
  - `findLowestAndHighestWeights()` - Detectar extremos
  - `checkRateDeviation()` - Validar desviaciones
  - Helpers de visualización y formateo

- [x] `state.js` - Manejo de estado global
  - Sistema de suscripción a cambios (como React hooks)
  - Persistencia en localStorage
  - CRUD de weight entries
  - Gestión de alertas
  - Switch de usuarios
  - Sistema de notificaciones
  - Import/Export de datos

---

## 🚧 En Progreso / Pendiente

### 3. JavaScript UI & Components (40%)
- [ ] `theme.js` - Dark/Light mode toggle
  - Necesita: Implementar switch, detectar preferencia del sistema
  
- [ ] `ui.js` - Componentes UI reutilizables
  - Necesita: Buttons, Cards, Badges, Inputs, Modals, Tooltips
  
- [ ] `components.js` - Generadores de HTML
  - Necesita: Todos los componentes principales
  
- [ ] `app.js` - Inicialización y routing
  - Necesita: Boot logic, event listeners

### 4. Components HTML (0%)

Pendientes de crear:

#### Core Components
- [ ] **UserSwitcher** - Cambiar entre coach/clientes
- [ ] **CoachDashboard** - Vista principal del coach
- [ ] **ClientLogbook** - Vista del cliente (Logbook)
- [ ] **WeightChart** - Gráfica con Chart.js
- [ ] **WeightEntryTable** - Tabla de pesos
- [ ] **AlertsPanel** - Panel de alertas
  
#### Dialogs & Forms  
- [ ] **AddEditWeightDialog** - Agregar/editar peso
- [ ] **PhotoUploadDialog** - Subir foto (disabled)
- [ ] **PhotoRequestWarning** - Advertencia de foto
- [ ] **PhotoRequestDialog** - Coach solicita foto
- [ ] **NutritionDialog** - Datos de nutrición
- [ ] **SettingsDialog** - Configuración de cliente
- [ ] **FormulasDocumentation** - Documentación DEMA

#### UI Components
- [ ] **Button** - Botón con variantes
- [ ] **Card** - Tarjeta con header/content
- [ ] **Badge** - Insignia/etiqueta
- [ ] **Input** - Campo de entrada
- [ ] **Textarea** - Área de texto
- [ ] **Select** - Selector dropdown
- [ ] **Switch** - Toggle switch
- [ ] **Modal** - Dialog/Modal base
- [ ] **Toast** - Notificación temporal
- [ ] **Tooltip** - Tooltip hover
- [ ] **Spinner** - Loading spinner

### 5. FastAPI Integration (0%)
- [ ] `api.js` - Cliente HTTP para FastAPI
- [ ] Endpoints documentados
- [ ] Error handling
- [ ] Loading states
- [ ] Retry logic

### 6. Mock Data (0%)
- [ ] Convertir `mock-data.ts` a JavaScript
- [ ] 8 clientes con datos reales
- [ ] Coach data
- [ ] Alerts
- [ ] Users

---

## 📋 Próximos Pasos Críticos

### PASO 1: Completar Theme System
```javascript
// theme.js
- Toggle dark/light mode
- Detectar preferencia del sistema
- Persistir en localStorage
- Actualizar clases del DOM
- Icon switch (sun/moon)
```

### PASO 2: Mock Data
```javascript
// mock-data.js
- Convertir todos los datos mock de TypeScript
- Asegurar mismas estructuras
- Incluir todos los 8 clientes
- Datos de prueba realistas
```

### PASO 3: UI Components Base
```javascript
// ui.js
- createButton()
- createCard()
- createBadge()
- createInput()
- createModal()
- createToast()
- createTooltip()
```

### PASO 4: Components Generators
```javascript
// components.js
- renderUserSwitcher()
- renderCoachDashboard()
- renderClientLogbook()
- renderWeightChart()
- renderWeightTable()
- renderAlerts()
```

### PASO 5: App Initialization
```javascript
// app.js
- initializeApp()
- setupEventListeners()
- renderCurrentView()
- handleStateChanges()
```

### PASO 6: API Integration
```javascript
// api.js
- API_BASE_URL configuration
- fetch() wrappers
- Error handling
- Token management (if needed)
```

---

## 🎯 Endpoints FastAPI Necesarios

### Coach Endpoints
```python
GET  /api/coach/dashboard          # Datos completos
GET  /api/coach/clients            # Lista clientes
GET  /api/coach/alerts             # Alertas
POST /api/coach/alerts/{id}/read   # Marcar leída
PUT  /api/coach/client/{id}/target # Actualizar target
POST /api/coach/photo-request      # Solicitar foto
```

### Client Endpoints  
```python
GET    /api/client/dashboard         # Datos cliente
GET    /api/client/weights           # Pesos
POST   /api/client/weights           # Agregar peso
PUT    /api/client/weights/{id}      # Actualizar
DELETE /api/client/weights/{id}      # Eliminar
POST   /api/client/photos            # Subir foto
```

### Shared
```python
POST /api/users/switch  # Demo only
```

---

## 📝 Notas de Diseño - Mantener Exacto

### Tipografía
```css
h1: 1.5rem (24px), weight: 500
h2: 1.25rem (20px), weight: 500  
h3: 1.125rem (18px), weight: 500
h4, button, label: 1rem (16px), weight: 500
p, input: 1rem (16px), weight: 400
```

### Colores Light
```css
--background: #ffffff
--foreground: oklch(0.145 0 0)
--primary: #030213
--muted: #ececf0
--border: rgba(0, 0, 0, 0.1)
```

### Colores Dark
```css
--background: oklch(0.145 0 0)
--foreground: oklch(0.985 0 0)
--primary: oklch(0.985 0 0)
--muted: oklch(0.269 0 0)
--border: oklch(0.269 0 0)
```

### Weekly Rate Colors
- **Positivo** (ganando): `bg-red-100 text-red-700` (light) / `bg-red-900 text-red-300` (dark)
- **Negativo** (perdiendo): `bg-green-100 text-green-700` (light) / `bg-green-900 text-green-300` (dark)

### Iconos (Lucide)
- Scale, Users, Settings, Camera
- Plus, Info, Bell, HelpCircle
- TrendingUp, TrendingDown, Target
- ChevronDown, ChevronUp
- AlertCircle, CheckCircle

---

## 🔍 Testing Checklist (Cuando esté completo)

### Visual
- [ ] Colores idénticos light/dark
- [ ] Tipografía exacta
- [ ] Espaciado correcto
- [ ] Iconos iguales
- [ ] Animaciones suaves

### Funcional
- [ ] Agregar peso
- [ ] Editar notas
- [ ] Ver gráfica DEMA
- [ ] Calcular weekly rate correcto
- [ ] Alertas funcionan
- [ ] Dark mode funciona
- [ ] Switch usuarios

### Responsive
- [ ] Mobile 320px-640px
- [ ] Tablet 640px-1024px  
- [ ] Desktop 1024px+
- [ ] Touch friendly
- [ ] Landscape mobile

### Performance
- [ ] Carga < 2s
- [ ] 60fps animaciones
- [ ] No memory leaks
- [ ] localStorage optimizado

---

## 🎓 Documentación Creada

1. ✅ `HTML_CONVERSION_PLAN.md` - Plan maestro de conversión
2. ✅ `HTML_CONVERSION_PROGRESS.md` - Este archivo (progreso)
3. ⏳ `API_ENDPOINTS.md` - Documentación de endpoints (pendiente)
4. ⏳ `FUNCTIONS_REFERENCE.md` - Referencia de funciones (pendiente)

---

## ⏱️ Estimación de Tiempo

| Tarea | Tiempo Estimado | Status |
|-------|----------------|--------|
| Estructura Base | 1h | ✅ Completado |
| JavaScript Core | 2h | ✅ Completado |
| Theme System | 0.5h | ⏳ Pendiente |
| Mock Data | 0.5h | ⏳ Pendiente |
| UI Components | 2h | ⏳ Pendiente |
| Component Generators | 3h | ⏳ Pendiente |
| FastAPI Integration | 1h | ⏳ Pendiente |
| Testing & Refinement | 2h | ⏳ Pendiente |
| **TOTAL** | **12h** | **30% Done** |

---

## 💬 Decisiones Técnicas

### ¿Por qué no usar un framework?
- Requisito del usuario: HTML puro + Vanilla JS
- Integración con FastAPI backend
- Control total del código
- Sin dependencias de build

### Chart.js vs Recharts
- Recharts es React-only
- Chart.js es vanilla JS compatible
- Funcionalidad equivalente
- Fácil customización

### Estado Global vs React Hooks
- Sistema de suscripción imita `useState`
- `subscribe()` imita `useEffect`
- `updateState()` dispara re-renders manuales
- localStorage automático

### Dark Mode
- Class-based (`class="dark"` en `<html>`)
- CSS variables reactivas
- Persistencia en localStorage
- Sin flashes (FOUC)

---

**Continuar con:** PASO 1 - Theme System (`theme.js`)
