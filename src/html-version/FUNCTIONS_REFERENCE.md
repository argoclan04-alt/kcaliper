```markdown
# Weight Tracker - Functions Reference

**Referencia completa de todas las funciones JavaScript**

---

## 📁 utils.js (30+ funciones)

### Formateo de Fechas
- `formatDate(dateString)` - Retorna {day, weekday}
- `formatMonthYear(monthKey)` - Formato "MONTH YEAR"
- `getRelativeTime(dateString)` - "Today", "Yesterday", "3 days ago"
- `getTodayString()` - Fecha actual en YYYY-MM-DD
- `isToday(dateString)` - Boolean si es hoy
- `getWeekNumber(date)` - Número de semana del año

### Manipulación de Datos
- `groupEntriesByMonth(entries)` - Agrupa por mes
- `sortEntriesByDate(entries)` - Ordena por fecha desc
- `generateId(prefix)` - ID único con timestamp
- `formatWeight(weight, unit, decimals)` - Formato con unidad
- `formatNumberWithSign(num, decimals)` - +/- number
- `parseFloatSafe(value, defaultValue)` - Parse seguro

### Validaciones
- `isValidEmail(email)` - Valida formato email
- `escapeHtml(text)` - Previene XSS

### Utilidades UI
- `debounce(func, wait)` - Debounce function
- `throttle(func, limit)` - Throttle function
- `copyToClipboard(text)` - Copia al portapapeles
- `downloadJSON(data, filename)` - Descarga JSON
- `imageToBase64(file)` - Convierte imagen a base64

### Detección de Dispositivo
- `isMobile()` - True si < 768px
- `isTablet()` - True si 768-1024px
- `isDesktop()` - True si >= 1024px

### Logging
- `log(message, type)` - Console log con timestamp

---

## 📊 calculations.js (12 funciones)

### Cálculos DEMA
```javascript
// Fórmula: α = 2/(n+1)
// EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))
calculateEMA(values, periods = 10)

// Fórmula: DEMA = (2 × EMA_n) - EMA(EMA_n)
calculateDoubleExponentialMovingAverage(entries, currentIndex)

// Regresión lineal sobre DEMA
// Weekly Rate = slope × 7
calculateWeeklyRate(entries, currentIndex)
```

### Análisis de Tendencias
- `calculateTrend(entries)` - 'up', 'down', 'stable'
- `detectWeightExtremes(entries, newEntry)` - {isNewLowest, isNewHighest}
- `findLowestAndHighestWeights(entries)` - {lowest, highest}
- `checkRateDeviation(currentRate, targetRate, tolerance)` - Boolean

### Helpers
- `calculateMovingAverage(entries, windowSizeOrIndex)` - SMA o DEMA
- `recalculateAllWeeklyRates(entries)` - Recalcula todo
- `getWeeklyRateColor(rate)` - Tailwind classes
- `getWeeklyRateDisplay(rate)` - String con flecha

---

## 🗄️ state.js (20+ funciones)

### Inicialización
- `initializeState()` - Boot desde localStorage o mock
- `saveToLocalStorage()` - Persiste estado
- `clearLocalStorage()` - Limpia todo
- `exportState()` - JSON export
- `importState(data)` - JSON import

### Suscripción (React-like)
```javascript
subscribe(callback)  // Retorna unsubscribe function
updateState(updates) // Dispara todos los subscribers
```

### CRUD de Weight Entries
- `addWeightEntry(clientId, entry)` - Agregar peso
- `updateWeightEntry(clientId, entryId, updates)` - Actualizar
- `updateTargetWeeklyRate(clientId, targetRate)` - Cambiar target
- `updateNotificationSettings(clientId, settings)` - Settings

### Alertas
- `checkAndGenerateAlerts(client, currentEntry, allEntries)` - Auto-genera
- `markAlertAsRead(alertId)` - Marcar leída
- `getUnreadAlerts()` - Filtrar no leídas

### Usuarios
- `switchUser(userId)` - Cambiar usuario
- `getCurrentClient()` - Cliente actual
- `getClientById(clientId)` - Buscar cliente

---

## 🎨 theme.js (ThemeManager)

### Métodos Principales
```javascript
ThemeManager.init()                    // Auto-inicializa
ThemeManager.setTheme(theme)           // 'light' o 'dark'
ThemeManager.toggle()                  // Toggle light/dark
ThemeManager.getTheme()                // Retorna actual
ThemeManager.isDark()                  // Boolean
ThemeManager.isLight()                 // Boolean
ThemeManager.renderToggleButton(containerId)  // Renderiza botón
```

### Eventos
- Dispara evento custom `themechange` al cambiar
- Detecta preferencia del sistema
- Persiste en localStorage

---

## 🧩 ui.js (15+ componentes)

### Botones
```javascript
createButton({
    text: 'Click me',
    variant: 'default',      // default, destructive, outline, secondary, ghost, link
    size: 'default',         // default, sm, lg, icon
    icon: 'plus',            // Lucide icon name
    iconPosition: 'left',    // left, right
    onClick: 'handleClick()',
    disabled: false,
    fullWidth: false,
    className: '',
    id: '',
    type: 'button',
    ariaLabel: ''
})
```

### Cards
```javascript
createCard({
    title: 'Card Title',
    description: 'Card description',
    content: '<p>Content</p>',
    footer: '<button>Action</button>',
    action: '<button>...</button>',  // Top-right action
    className: '',
    id: ''
})
```

### Badges
```javascript
createBadge({
    text: 'New',
    variant: 'default',      // default, secondary, destructive, outline
    icon: 'star',
    className: '',
    onClick: ''
})
```

### Form Inputs
```javascript
createInput({
    type: 'text',
    placeholder: 'Enter text',
    value: '',
    id: '',
    name: '',
    required: false,
    disabled: false,
    className: '',
    onInput: '',
    onChange: '',
    min: '',
    max: '',
    step: ''
})

createTextarea({
    placeholder: 'Enter text',
    value: '',
    id: '',
    name: '',
    rows: 3,
    required: false,
    disabled: false,
    className: '',
    onInput: ''
})

createLabel({
    text: 'Field Name',
    htmlFor: 'input-id',
    required: false,
    className: ''
})

createSelect({
    id: '',
    name: '',
    value: '',
    options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
    ],
    placeholder: 'Select...',
    onChange: '',
    disabled: false,
    className: ''
})
```

### Modals/Dialogs
```javascript
const modalId = createModal({
    id: 'my-modal',          // Auto-generated si no se provee
    title: 'Modal Title',
    description: 'Description',
    content: '<p>Content</p>',
    footer: '<button>OK</button>',
    onClose: null,           // Callback function
    size: 'default',         // default, sm, lg, xl, full
    closeButton: true
})

showModal(modalId)           // Mostrar
closeModal(modalId)          // Cerrar
removeModal(modalId)         // Eliminar del DOM
```

### Toasts/Notifications
```javascript
createToast({
    message: 'Success!',
    type: 'success',         // default, success, error, warning, info
    duration: 4000,          // ms, 0 = sin auto-close
    icon: 'check-circle',    // Override icon
    action: {
        label: 'Undo',
        onClick: 'handleUndo()'
    }
})

removeToast(toastId)         // Cerrar manualmente
```

### Switch/Toggle
```javascript
createSwitch({
    id: 'my-switch',
    checked: false,
    disabled: false,
    label: 'Enable feature',
    onChange: 'handleChange', // Function name
    className: ''
})

toggleSwitch(switchId, onChangeFunc)  // Toggle programático
```

### Otros Componentes
```javascript
createSpinner({
    size: 'md',              // sm, md, lg
    className: ''
})

createAlert({
    title: 'Alert Title',
    message: 'Alert message',
    variant: 'default',      // default, destructive
    icon: 'info',
    dismissible: false,
    onDismiss: '',
    className: ''
})

setLoading(show)             // Muestra/oculta overlay
```

---

## 🏗️ components.js (10+ generadores)

### User Switcher
```javascript
renderUserSwitcher(users, currentUser)
```

### Weight Table
```javascript
renderWeightTable(entries, {
    unit: 'kg',
    canEdit: false,
    showMovingAverage: true,
    physiquePhotos: []
})
```

### Client Logbook
```javascript
renderClientLogbook(client)
// Incluye: stats cards, add button, chart, table
```

### Stats Cards
```javascript
renderStatsCards(client, stats)
// Genera 4 cards: Current, Lowest, Highest, Target
```

### Coach Dashboard
```javascript
renderCoachDashboard(coach, alerts)
// Incluye: header, alerts panel, clients grid
```

### Client Card (para Coach)
```javascript
renderClientCard(client)
// Card individual con datos del cliente
```

### Alerts Panel
```javascript
renderAlertsPanel(alerts)
// Panel de alertas con scroll
```

### Helpers
```javascript
calculateClientStats(client)
// Retorna: {currentWeight, lowestWeight, highestWeight, totalEntries, streak}

calculateStreak(sortedEntries)
// Calcula racha de días consecutivos

getAlertIcon(type)
// Retorna nombre de icono Lucide

getAlertIconColor(type)
// Retorna clases de color Tailwind
```

---

## 🚀 app.js (WeightTrackerApp)

### Métodos Principales
```javascript
WeightTrackerApp.init()                    // Inicializa app
WeightTrackerApp.render()                  // Renderiza vista actual
WeightTrackerApp.renderUserSwitcher()      // Renderiza top bar
WeightTrackerApp.setupEventListeners()     // Event listeners globales
WeightTrackerApp.initializeChart(client)   // Inicializa Chart.js
WeightTrackerApp.openAddWeightDialog()     // Abre dialog agregar peso
WeightTrackerApp.closeAllModals()          // Cierra todos los modals
```

### Funciones Globales (HTML onclick)
```javascript
handleUserSwitch(userId)
openAddWeightDialog()
submitAddWeight()
viewClientDetails(clientId)
markAlertRead(alertId)
viewNotes(entryId)
editNotes(entryId, currentNotes)
saveNotes(entryId, modalId)
addNotes(entryId)
viewPhoto(photoId)
toggleSettings()
```

---

## 🌐 api.js (FastAPI Integration)

### Configuración
```javascript
API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    TIMEOUT: 10000,
    HEADERS: {...}
}
```

### Core
```javascript
apiFetch(endpoint, options)  // Wrapper de fetch con error handling
checkAPIHealth()             // Health check
initializeAPI()              // Auto-inicializa conexión
syncWithAPI()                // Sincroniza estado con backend
```

### Coach Endpoints
```javascript
fetchCoachDashboard()
fetchClients()
fetchClientDetails(clientId)
fetchAlerts(params)
apiMarkAlertAsRead(alertId)
apiUpdateTargetRate(clientId, targetRate)
apiUpdateClientSettings(clientId, settings)
apiRequestPhoto(photoRequest)
```

### Client Endpoints
```javascript
fetchClientDashboard()
fetchWeightEntries(params)
apiAddWeightEntry(entry)
apiUpdateWeightEntry(entryId, updates)
apiDeleteWeightEntry(entryId)
apiUploadPhoto(photoData)
fetchNotifications()
apiMarkNotificationAsRead(notificationId)
```

### User Management (Demo)
```javascript
apiSwitchUser(userId)
```

### Enhanced Functions (con fallback)
```javascript
addWeightEntryWithAPI(clientId, entry)
// Intenta API, fallback a local state

updateWeightEntryWithAPI(clientId, entryId, updates)
// Intenta API, fallback a local state
```

---

## 📦 mock-data.js

### Funciones
```javascript
getMockClients()   // Array de 8 clientes
getMockCoach()     // Objeto coach
getMockAlerts()    // Array de 8 alertas
getMockUsers()     // Array de 9 usuarios (coach + 8 clientes)
```

### Datos Incluidos
- **8 Clientes** con pesos reales:
  1. María González (81 kg, España) - 14 entradas
  2. John Smith (166 lbs, USA) - 14 entradas
  3. Alex Thompson (90 kg, Canadá) - 14 entradas
  4. Sofia Martinez (72 kg, México) - 8 entradas
  5. Emma Johnson (185 lbs, USA) - 6 entradas
  6. Lucas Silva (68 kg, Brasil) - 4 entradas
  7. Isabella Rossi (95 kg, Italia) - 8 entradas
  8. Michael Chen (200 lbs, USA) - 5 entradas

---

## 🔧 Utilidades Comunes

### Inicialización de Lucide Icons
```javascript
// Después de renderizar HTML con iconos:
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
```

### Event Listeners
```javascript
// Ejemplo de event listener
document.getElementById('my-button').addEventListener('click', () => {
    // Handle click
});
```

### Chart.js
```javascript
const chart = new Chart(ctx, {
    type: 'line',
    data: {...},
    options: {...}
});

chart.update();   // Actualizar datos
chart.destroy();  // Destruir instancia
```

---

## 🎯 Flujos de Trabajo Comunes

### 1. Agregar Peso (Cliente)
```javascript
// 1. Usuario hace click en "Add Weight"
openAddWeightDialog()

// 2. Dialog se renderiza con createModal()

// 3. Usuario llena formulario y hace click en "Add Entry"
submitAddWeight()

// 4. Valida inputs y llama a:
addWeightEntry(clientId, entry)  // Local state
// O
addWeightEntryWithAPI(clientId, entry)  // Con API

// 5. State se actualiza y dispara re-render
// 6. Toast de confirmación
createToast({ message: 'Weight recorded!', type: 'success' })
```

### 2. Cambiar Usuario
```javascript
// 1. Usuario selecciona en dropdown
handleUserSwitch(userId)

// 2. Llama a:
switchUser(userId)

// 3. updateState() dispara notifySubscribers()

// 4. App re-renderiza vista correcta (Coach o Client)
WeightTrackerApp.render()
```

### 3. Toggle Dark Mode
```javascript
// 1. Usuario hace click en botón sun/moon
ThemeManager.toggle()

// 2. setTheme() actualiza DOM y localStorage

// 3. applyTheme() agrega/quita clase 'dark' en <html>

// 4. Dispara evento 'themechange'

// 5. Chart.js escucha evento y actualiza colores
```

---

## 🐛 Debug y Testing

### Console Logs
Todas las funciones importantes usan `log()`:
```javascript
log('Message', 'info')   // [HH:MM:SS] Message
log('Error', 'error')    // [HH:MM:SS] Error (en rojo)
log('Warning', 'warn')   // [HH:MM:SS] Warning (en amarillo)
```

### Inspeccionar Estado
```javascript
// En consola del navegador:
console.log(AppState)            // Ver estado completo
console.log(AppState.coach)      // Ver coach
console.log(AppState.alerts)     // Ver alertas
console.log(AppState.currentUser) // Ver usuario actual
```

### Testing Manual
```javascript
// Test agregar peso:
addWeightEntry('client1', {
    weight: 81.5,
    date: '2025-10-11',
    notes: 'Test',
    recordedBy: 'client'
})

// Test cambiar tema:
ThemeManager.toggle()

// Test crear toast:
createToast({ message: 'Test', type: 'success' })
```

---

## 📝 Convenciones de Código

### Naming
- **Funciones**: camelCase - `calculateWeeklyRate()`
- **Constantes**: UPPER_SNAKE_CASE - `API_CONFIG`
- **Classes**: PascalCase - `APIError`
- **Objects**: camelCase - `appState`

### Comentarios
```javascript
/**
 * Function description
 * @param {type} paramName - Description
 * @returns {type} Description
 */
```

### Error Handling
```javascript
try {
    // Code
} catch (error) {
    log('Error: ' + error.message, 'error');
    createToast({
        message: 'Error: ' + error.message,
        type: 'error'
    });
}
```

---

**Última Actualización:** 2025-01-11  
**Total de Funciones:** 100+  
**Archivos JS:** 7 (utils, calculations, state, theme, mock-data, ui, components, app, api)
```
