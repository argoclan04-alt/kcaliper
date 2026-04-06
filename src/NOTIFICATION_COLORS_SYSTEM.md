# Sistema de Colores de Notificaciones - Weight Tracker

## Descripción General

El sistema de notificaciones usa colores distintivos para cada tipo de alerta, permitiendo identificar rápidamente la naturaleza de la notificación tanto en modo claro como oscuro.

---

## 🎨 Colores por Tipo de Notificación

### 🟢 VERDE - Lowest Weight (Peso Más Bajo)
- **Tipo:** `lowest`
- **Borde:** `border-l-green-500`
- **Fondo Claro:** `bg-green-50`
- **Fondo Oscuro:** `bg-green-950/30`
- **Icono:** `TrendingDown` en verde (`text-green-600 / text-green-400`)
- **Uso:** Cuando el asesorado alcanza su peso más bajo registrado
- **Ejemplo:** "Jane Doe has reached a new lowest weight: 62.3 kg"

---

### 🔴 ROJO - Highest Weight (Peso Más Alto)
- **Tipo:** `highest`
- **Borde:** `border-l-red-500`
- **Fondo Claro:** `bg-red-50`
- **Fondo Oscuro:** `bg-red-950/30`
- **Icono:** `TrendingUp` en rojo (`text-red-600 / text-red-400`)
- **Uso:** Cuando el asesorado alcanza su peso más alto registrado
- **Ejemplo:** "John Smith has reached a new highest weight: 85.2 kg"

---

### 🟠 NARANJA - Rate Deviation (Desviación de Ritmo)
- **Tipo:** `rate_deviation`
- **Borde:** `border-l-orange-500`
- **Fondo Claro:** `bg-orange-50`
- **Fondo Oscuro:** `bg-orange-950/30`
- **Icono:** `AlertTriangle` en naranja (`text-orange-600 / text-orange-400`)
- **Uso:** Cuando el weekly rate se desvía significativamente del target
- **Ejemplo:** "Sarah Johnson's weekly rate (-0.75 kg) deviates from target (-0.50 kg)"

---

### 🔵 AZUL - Weight Modified (Peso Modificado)
- **Tipo:** `weight_modified`
- **Borde:** `border-l-blue-500`
- **Fondo Claro:** `bg-blue-50`
- **Fondo Oscuro:** `bg-blue-950/30`
- **Icono:** `Edit3` en azul (`text-blue-600 / text-blue-400`)
- **Uso:** Cuando un coach modifica un registro de peso existente
- **Ejemplo:** "Coach updated weight entry for Mike Chen (78.5 kg → 78.3 kg)"

---

### 🟠 NARANJA - No Weight Entry (Sin Registro de Peso)
- **Tipo:** `no_weight_entry`
- **Borde:** `border-l-orange-500`
- **Fondo Claro:** `bg-orange-50`
- **Fondo Oscuro:** `bg-orange-950/30`
- **Icono:** `AlertTriangle` en naranja (`text-orange-600 / text-orange-400`)
- **Uso:** Cuando un asesorado no registra peso durante varios días
- **Ejemplo:** "Emma Wilson hasn't logged weight in 5 days"

---

### 🟡 AMARILLO - Milestone Achieved (Hito Alcanzado)
- **Tipo:** `milestone_achieved`
- **Borde:** `border-l-yellow-500`
- **Fondo Claro:** `bg-yellow-50`
- **Fondo Oscuro:** `bg-yellow-950/30`
- **Icono:** `Award` en amarillo (`text-yellow-600 / text-yellow-400`)
- **Uso:** Cuando el asesorado alcanza su peso objetivo/milestone
- **Ejemplo:** "🎉 Emily Brown has achieved milestone weight: 65.0 kg!"

---

### 🟣 PÚRPURA - Target Streak (Racha de Objetivos)
- **Tipo:** `target_streak`
- **Borde:** `border-l-purple-500`
- **Fondo Claro:** `bg-purple-50`
- **Fondo Oscuro:** `bg-purple-950/30`
- **Icono:** `Target` en púrpura (`text-purple-600 / text-purple-400`)
- **Uso:** Cuando el asesorado mantiene su weekly rate dentro del rango target
- **Ejemplo:** "David Lee is on a 7-day target streak!"

---

### ⚪ GRIS - Default/Otro
- **Tipo:** Otros tipos no especificados
- **Borde:** `border-l-gray-500`
- **Fondo Claro:** `bg-gray-50`
- **Fondo Oscuro:** `bg-gray-950/30`
- **Icono:** `Bell` en gris (`text-gray-600 / text-gray-400`)
- **Uso:** Notificaciones generales

---

## 🔔 Badge de Contador (Botón de Notificaciones)

El badge que aparece en el botón de notificaciones cambia de color según el tipo de notificación no leída más importante:

### Orden de Prioridad:
1. **Amarillo** (`bg-yellow-500`) - Si hay `milestone_achieved`
2. **Naranja** (`bg-orange-500`) - Si hay `rate_deviation`
3. **Verde** (`bg-green-500`) - Si hay `lowest`
4. **Rojo** (`bg-red-500`) - Si hay `highest` o cualquier otra

---

## 📱 Tabs de Navegación

### Unread (No Leídas)
- **Badge:** Azul (`bg-blue-500`)
- **Texto:** Blanco
- **Muestra:** Cantidad de notificaciones no leídas

### Read (Leídas)
- **Badge:** Gris (`bg-gray-400`)
- **Texto:** Blanco
- **Muestra:** Cantidad de notificaciones leídas

---

## 🌓 Soporte Dark Theme

Todos los colores tienen variantes optimizadas para dark theme:

- **Fondos claros:** `bg-{color}-50` → **Fondos oscuros:** `bg-{color}-950/30`
- **Iconos claros:** `text-{color}-600` → **Iconos oscuros:** `text-{color}-400`
- **Texto principal claro:** `text-gray-900` → **Texto oscuro:** `text-gray-100`
- **Texto secundario claro:** `text-gray-700` → **Texto oscuro:** `text-gray-300`

---

## 📋 Componentes Relacionados

- **MobileNotificationsButton.tsx** - Implementación del panel de notificaciones móvil
- **AlertsPanel.tsx** - Panel de alertas para desktop
- **ClientNotifications.tsx** - Notificaciones en el dashboard del cliente

---

## 🎯 Guía Rápida de Colores

```
✅ VERDE   → Logro positivo (lowest weight)
❌ ROJO    → Alerta de aumento (highest weight)
⚠️ NARANJA → Advertencia (rate deviation, no entry)
ℹ️ AZUL    → Información (weight modified)
🏆 AMARILLO → Celebración (milestone achieved)
🎯 PÚRPURA → Consistencia (target streak)
```

---

## 📝 Notas Importantes

1. **Consistencia:** Los colores se mantienen iguales en mobile, desktop, light y dark theme
2. **Accesibilidad:** Los bordes laterales gruesos (`border-l-4`) facilitan la identificación del tipo
3. **Iconos:** Cada tipo tiene su propio icono distintivo además del color
4. **Priorización:** Las notificaciones críticas (milestone, rate deviation) tienen prioridad visual
5. **Ordenamiento:** Todas las notificaciones se ordenan por fecha (más reciente primero)
