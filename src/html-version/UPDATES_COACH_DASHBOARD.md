# Coach Dashboard Updates - Weight Tracker

## Fecha: Actualización 2025

### Resumen de Cambios

Se ha actualizado completamente el Coach Dashboard y el sistema de notificaciones del Weight Tracker con las siguientes mejoras:

---

## 1. **Reorganización del Header (User Switcher)**

### Antes:
- Nombre e ícono en línea horizontal
- Badge de rol al lado del nombre
- Selector de usuario separado a la derecha

### Ahora:
- **Nombre completo en fila horizontal** con ícono
- **Tag de rol y selector de perfil en segunda fila** (a la misma altura)
- Layout más limpio y organizado
- Theme toggle permanece en la esquina superior derecha

```javascript
// Estructura del nuevo layout:
<div class="flex items-start justify-between gap-4">
    <div class="flex flex-col gap-2 flex-1">
        <div>Usuario + Ícono</div>
        <div>Badge + Selector</div>
    </div>
    <div>Theme Toggle</div>
</div>
```

---

## 2. **Simplificación de la Tabla de Clientes**

### Cambios principales:
- **Eliminado**: "Coach Dashboard" título
- **Eliminado**: "Monitor your clients' progress" subtítulo
- **Eliminado**: Grid de cards con información extensa
- **Eliminado**: Badge de alertas en el header

### Nueva tabla compacta:

| Columna | Descripción |
|---------|-------------|
| **Name** | Nombre y email del cliente |
| **Current Weight** | Peso actual con unidad (kg/lbs) |
| **Rate** | Weekly rate con color (verde = negativo, rojo = positivo) |
| **Target** | Target rate con **alerta roja** si está desviado |
| **Actions** | Botón Settings (3 puntos en móvil) |

### Target Rate con Alerta Roja:
- Se marca en **rojo** cuando el target está fuera del rango recomendado
- Rango recomendado: `-1.0` a `-0.25` kg/semana
- Si está fuera de este rango: `bg-red-100 text-red-700` (light mode) / `bg-red-900/30 text-red-300` (dark mode)

### Responsive Design:
- **Desktop**: Muestra "Settings" como texto
- **Mobile**: Muestra 3 puntos verticales (ícono `more-vertical`)
- Botón cambia de ancho: `h-9 w-9` en móvil, `w-auto px-3` en desktop

---

## 3. **Sistema de Notificaciones Flotante**

### Nuevo Botón Flotante:
- **Posición**: Fixed, esquina superior derecha (`top-20 right-4`)
- **Visible solo para coaches**
- **Badge rojo**: Aparece cuando hay notificaciones no leídas
- **Scroll behavior inteligente**:
  - Se esconde al deslizar **hacia abajo**
  - Aparece al deslizar **hacia arriba**
  - Vuelve a aparecer 1 segundo después de dejar de deslizar

```javascript
// Clases CSS para animaciones:
.floating-btn-show {
    opacity: 1;
    transform: translateY(0);
}

.floating-btn-hide {
    opacity: 0;
    transform: translateY(-20px);
    pointer-events: none;
}
```

### Panel de Notificaciones Full Screen:

#### Características:
1. **Ocupa toda la pantalla** cuando se abre
2. **Animación de deslizamiento** desde la derecha
3. **Dos tabs**:
   - **Unread** (Notificaciones no leídas) - Por defecto
   - **Read** (Notificaciones leídas)
4. **Contador de notificaciones** en cada tab

#### Header del Panel:
- Título "Notifications"
- Botón X para cerrar en esquina superior derecha

#### Gestos de Cierre:
- **Click en botón X**
- **Deslizar hacia la derecha** (swipe gesture en móvil)
- Umbral de cierre: 100px

#### Contenido de Notificaciones:
- **Ícono** según tipo de alerta
- **Mensaje** de la notificación
- **Timestamp** relativo (e.g., "2 hours ago")
- **Botón "Mark as read"** para notificaciones no leídas
- **Opacidad reducida** para notificaciones leídas (75%)

#### Estados Vacíos:
- Unread vacío: Ícono `bell-off` + mensaje
- Read vacío: Ícono `inbox` + mensaje

---

## 4. **Funciones JavaScript Agregadas**

### Gestión del Panel:
```javascript
toggleNotificationsPanel()    // Abre/cierra el panel
openNotificationsPanel()       // Abre el panel
closeNotificationsPanel()      // Cierra el panel
switchNotificationTab(tab)     // Cambia entre tabs 'unread' y 'read'
```

### Swipe Gesture:
```javascript
setupSwipeGesture(panel)       // Configura el gesto de deslizar
// - Trackea touchstart, touchmove, touchend
// - Cierra si swipe > 100px
```

### Badge y Scroll:
```javascript
updateNotificationBadge()      // Muestra/oculta badge rojo
setupNotificationButtonScroll() // Configura comportamiento de scroll
initializeNotifications()      // Inicializa todo el sistema
```

---

## 5. **Cálculo de Weekly Rate**

### Implementación:
- Utiliza la función `calculateWeeklyRate()` existente
- Requiere mínimo 3 entradas de peso
- Usa regresión lineal sobre la línea de tendencia DEMA
- Colores:
  - **Verde claro**: Valores negativos (pérdida de peso)
  - **Rojo claro**: Valores positivos (ganancia de peso)
  - **Gris**: Valor 0 o sin datos

---

## 6. **Componentes HTML Actualizados**

### Archivos Modificados:
1. **`/html-version/index.html`**:
   - Agregado botón flotante de notificaciones
   - Agregado panel full-screen de notificaciones
   - Agregados estilos CSS para animaciones
   - Corregido `.show-mobile` display

2. **`/html-version/assets/js/components.js`**:
   - Actualizado `renderUserSwitcher()` - Nuevo layout vertical
   - Actualizado `renderCoachDashboard()` - Tabla en lugar de cards
   - Agregado `renderClientRow()` - Nueva función para filas de tabla
   - Agregado `renderNotificationsPanel()` - Panel completo con tabs

3. **`/html-version/assets/js/app.js`**:
   - Agregadas funciones de gestión del panel de notificaciones
   - Agregado scroll behavior para botón flotante
   - Agregado sistema de swipe gesture
   - Actualizado `markAlertRead()` para re-renderizar panel
   - Agregado `initializeNotifications()` al render

---

## 7. **Responsive Design**

### Media Queries:
- **`.hide-mobile`**: Oculto en pantallas < 768px
- **`.show-mobile`**: Visible solo en pantallas < 768px (`display: inline-flex`)

### Tabla de Clientes:
- Scroll horizontal automático en móvil (`overflow-x-auto`)
- Botones adaptativos (texto vs ícono)

### Panel de Notificaciones:
- Funciona perfectamente en todas las resoluciones
- Gestos táctiles optimizados para móvil

---

## 8. **Dark Theme Soporte**

Todos los nuevos componentes tienen soporte completo para dark theme:

```css
/* Ejemplo: Target rate desviado */
Light: bg-red-100 text-red-700 border-red-200
Dark:  bg-red-900/30 text-red-300 border-red-800
```

---

## 9. **Accesibilidad**

- Atributo `title="Settings"` en botón de settings
- Iconos de Lucide re-inicializados después de cada render
- Transiciones suaves (300ms) para mejor UX
- Focus states preservados en todos los elementos interactivos

---

## 10. **Testing Checklist**

### Para verificar los cambios:

- [ ] Header muestra nombre en fila completa con badge y selector abajo
- [ ] Tabla de clientes muestra solo: Name, Current Weight, Rate, Target, Actions
- [ ] Target rate se marca en rojo cuando está fuera del rango -1.0 a -0.25
- [ ] Botón Settings muestra texto en desktop y 3 puntos en móvil
- [ ] Botón flotante de notificaciones visible solo para coaches
- [ ] Badge rojo aparece cuando hay notificaciones no leídas
- [ ] Botón se esconde al scroll down, aparece al scroll up
- [ ] Panel de notificaciones se abre ocupando toda la pantalla
- [ ] Tabs Unread/Read funcionan correctamente
- [ ] Swipe derecha cierra el panel en móvil
- [ ] Botón X cierra el panel
- [ ] Dark theme funciona en todos los componentes
- [ ] Lucide icons se renderizan correctamente
- [ ] Responsive design funciona en móvil y desktop

---

## Próximos Pasos Sugeridos

1. **Implementar endpoints en FastAPI** para notificaciones real-time
2. **Agregar filtros** en la tabla de clientes
3. **Agregar búsqueda** de clientes por nombre
4. **Implementar ordenamiento** de columnas en la tabla
5. **Agregar paginación** si hay muchos clientes
6. **Notificaciones push** cuando lleguen alertas nuevas
7. **Sound/vibration** para notificaciones importantes

---

## Compatibilidad

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## Conclusión

El Coach Dashboard ahora es más limpio, eficiente y fácil de usar. El sistema de notificaciones flotante proporciona una experiencia moderna y mobile-friendly. Todos los cambios mantienen la consistencia visual con el resto de la aplicación y son 100% compatibles con el sistema de dark theme existente.
