# Weight Tracker - Conversión a HTML Puro + Vanilla JS

## 📋 Plan de Conversión - Step by Step

### FASE 1: Estructura Base
- [x] Analizar componentes React existentes
- [ ] Crear index.html con Tailwind CDN
- [ ] Implementar sistema de dark/light theme
- [ ] Crear estructura de carpetas para HTML

### FASE 2: Core JavaScript
- [ ] Convertir tipos TypeScript a JSDoc
- [ ] Migrar funciones de cálculo (weight-calculations)
- [ ] Crear sistema de estado (reemplaza React hooks)
- [ ] Implementar localStorage manager
- [ ] Crear módulo de API para FastAPI

### FASE 3: Componentes UI (HTML Templates)
- [ ] UserSwitcher
- [ ] CoachDashboard
- [ ] ClientDashboard (Logbook)
- [ ] WeightChart (Recharts → Chart.js)
- [ ] WeightEntryTable
- [ ] AlertsPanel
- [ ] Dialogs/Modals
- [ ] Forms (AddWeight, Settings, etc.)

### FASE 4: Interactividad
- [ ] Event handlers
- [ ] Form validations
- [ ] Toast notifications (Sonner → custom)
- [ ] Modal management
- [ ] Responsive navigation

### FASE 5: Integración FastAPI
- [ ] Definir endpoints necesarios
- [ ] Implementar fetch API calls
- [ ] Manejo de errores
- [ ] Loading states

### FASE 6: Testing & Refinamiento
- [ ] Verificar diseño idéntico
- [ ] Test responsividad (móvil/desktop)
- [ ] Test dark/light theme
- [ ] Verificar todas las funciones
- [ ] Optimización de rendimiento

---

## 📂 Estructura de Archivos HTML

```
weight-tracker-html/
├── index.html                 # Punto de entrada principal
├── assets/
│   ├── css/
│   │   └── custom.css        # Estilos adicionales (mínimos)
│   ├── js/
│   │   ├── app.js            # Inicialización principal
│   │   ├── state.js          # Manejo de estado global
│   │   ├── api.js            # Comunicación con FastAPI
│   │   ├── calculations.js   # Funciones DEMA y cálculos
│   │   ├── components.js     # Generadores de HTML
│   │   ├── ui.js             # Componentes UI reutilizables
│   │   ├── theme.js          # Dark/Light mode
│   │   └── utils.js          # Utilidades generales
│   └── icons/
│       └── lucide.min.js     # Iconos (CDN backup)
└── docs/
    └── API_ENDPOINTS.md      # Documentación de endpoints
```

---

## 🎨 Sistema de Diseño - Mantenimiento Exacto

### Colores (Light Theme)
```css
--background: #ffffff
--foreground: #1a1a1a
--primary: #030213
--secondary: #f3f3f5
--muted: #ececf0
--border: rgba(0, 0, 0, 0.1)
--destructive: #d4183d
```

### Colores (Dark Theme)
```css
--background: #1a1a1a
--foreground: #f5f5f5
--primary: #ffffff
--secondary: #2a2a2a
--muted: #3a3a3a
--border: #4a4a4a
--destructive: #ff4d6d
```

### Tipografía
- **Base**: 16px
- **H1**: 1.5rem (24px) - font-weight: 500
- **H2**: 1.25rem (20px) - font-weight: 500
- **H3**: 1.125rem (18px) - font-weight: 500
- **Body**: 1rem (16px) - font-weight: 400
- **Small**: 0.875rem (14px)

### Espaciado (Igual que Tailwind)
- p-2: 0.5rem (8px)
- p-3: 0.75rem (12px)
- p-4: 1rem (16px)
- p-6: 1.5rem (24px)
- gap-2, gap-3, gap-4, etc.

---

## 🔄 Mapeo React → Vanilla JS

### React Hooks → JavaScript
| React Hook | Equivalente Vanilla JS |
|-----------|------------------------|
| `useState` | Variables globales + render() |
| `useEffect` | Event listeners + init functions |
| `useContext` | Global state object |
| `useCallback` | Funciones normales |
| `useMemo` | Cache manual o getters |

### React Components → HTML Templates
```javascript
// React Component
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

// Vanilla JS
function createButton(text, onClick) {
  return `
    <button 
      class="btn" 
      onclick="${onClick}"
    >
      ${text}
    </button>
  `;
}
```

---

## 🌐 FastAPI Endpoints Necesarios

### Authentication (Si aplica)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Coach Endpoints
- `GET /api/coach/dashboard` - Datos completos del coach
- `GET /api/coach/clients` - Lista de clientes
- `GET /api/coach/alerts` - Alertas del coach
- `POST /api/coach/alerts/{id}/read` - Marcar alerta como leída
- `PUT /api/coach/client/{id}/target-rate` - Actualizar target rate
- `PUT /api/coach/client/{id}/settings` - Actualizar configuración
- `POST /api/coach/client/{id}/photo-request` - Solicitar foto

### Client Endpoints
- `GET /api/client/dashboard` - Datos del cliente actual
- `GET /api/client/weights` - Entradas de peso
- `POST /api/client/weights` - Agregar peso
- `PUT /api/client/weights/{id}` - Actualizar peso
- `DELETE /api/client/weights/{id}` - Eliminar peso
- `POST /api/client/photos` - Subir foto
- `GET /api/client/notifications` - Notificaciones del cliente
- `POST /api/client/notifications/{id}/read` - Marcar notificación leída

### Shared Endpoints
- `GET /api/users/switch` - Cambiar usuario (solo dev/demo)

---

## ⚡ Librerías Externas (CDN)

### CSS
```html
<!-- Tailwind CSS v4.0 -->
<script src="https://cdn.tailwindcss.com?v=4"></script>

<!-- Custom Config -->
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: { ... }
  }
</script>
```

### JavaScript
```html
<!-- Chart.js (reemplaza Recharts) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Optional: Day.js para manejo de fechas -->
<script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
```

---

## 🎯 Funcionalidades Críticas a Mantener

### ✅ Cálculos DEMA
- Fórmula exacta: `EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))`
- α = 2/(n+1)
- DEMA = (2 × EMA_n) - EMA(EMA_n)

### ✅ Weekly Rate
- Regresión lineal sobre línea DEMA
- Mostrar en verde claro (negativo) o rojo claro (positivo)

### ✅ Sistema de Alertas
- Nuevo peso más bajo/alto
- Desviación del target rate
- Milestone alcanzado
- 7 días sin registro
- Racha de 7 días en target

### ✅ Permisos
- Coach: Ver todo, NO modificar pesos
- Cliente: Registrar pesos, agregar notas

### ✅ Dark Mode
- Toggle switch en header
- Persistir preferencia en localStorage
- Bordes e iconos visibles en ambos modos
- Transiciones suaves

### ✅ Responsive
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly en móvil
- Navegación adaptable

---

## 📝 Notas de Implementación

### Prioridad 1 (Core)
1. Estructura HTML base + Tailwind
2. Sistema de estado y localStorage
3. Funciones de cálculo (DEMA, weekly rate)
4. Vistas principales (Coach/Client dashboard)

### Prioridad 2 (Features)
5. Gráficas (Chart.js)
6. Modals y formularios
7. Sistema de alertas
8. Dark mode

### Prioridad 3 (Polish)
9. Animaciones y transiciones
10. Toast notifications
11. Loading states
12. Error handling mejorado

---

## 🔍 Checklist de Verificación Final

### Diseño Visual
- [ ] Colores idénticos (light/dark)
- [ ] Tipografía exacta (tamaños, pesos)
- [ ] Espaciado correcto
- [ ] Iconos iguales (Lucide)
- [ ] Bordes y sombras
- [ ] Badges y Pills
- [ ] Botones (primarios, secundarios, outline)

### Funcionalidad
- [ ] Agregar peso (cliente)
- [ ] Editar notas (cliente)
- [ ] Ver gráfica
- [ ] Cambiar target rate (coach)
- [ ] Ver alertas (coach)
- [ ] Marcar alertas leídas
- [ ] Toggle dark/light
- [ ] User switcher

### Responsividad
- [ ] Mobile (320px - 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Touch gestures
- [ ] Landscape móvil

### Performance
- [ ] Tiempo de carga < 2s
- [ ] Animaciones fluidas (60fps)
- [ ] No memory leaks
- [ ] localStorage optimizado

---

**Inicio de Conversión:** Enero 11, 2025  
**Estimación:** 6-8 horas de desarrollo  
**Status:** 🚧 FASE 1 - En Progreso
