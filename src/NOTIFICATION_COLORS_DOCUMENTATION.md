# Notification Colors System - Weight Tracker

## Coach Alert Types

Estas son las alertas que el coach recibe con sus colores correspondientes:

### 1. **Lowest Weight** (Verde)
- **Color**: Green (#22c55e)
- **Border**: `border-l-green-500`
- **Background**: `bg-green-50 dark:bg-green-950/20`
- **Icon**: `text-green-600 dark:text-green-400`
- **Descripción**: Se activa cuando el cliente alcanza su peso más bajo

### 2. **Highest Weight** (Rojo)
- **Color**: Red (#ef4444)
- **Border**: `border-l-red-500`
- **Background**: `bg-red-50 dark:bg-red-950/20`
- **Icon**: `text-red-600 dark:text-red-400`
- **Descripción**: Se activa cuando el cliente alcanza su peso más alto

### 3. **Rate Deviation** (Naranja)
- **Color**: Orange (#f97316)
- **Border**: `border-l-orange-500`
- **Background**: `bg-orange-50 dark:bg-orange-950/20`
- **Icon**: `text-orange-600 dark:text-orange-400`
- **Descripción**: Se activa cuando la tasa de pérdida/ganancia de peso se desvía del objetivo

### 4. **Weight Modified** (Azul)
- **Color**: Blue (#3b82f6)
- **Border**: `border-l-blue-500`
- **Background**: `bg-blue-50 dark:bg-blue-950/20`
- **Icon**: `text-blue-600 dark:text-blue-400`
- **Descripción**: Se activa cuando el coach modifica un peso registrado

### 5. **No Weight Entry** (Naranja)
- **Color**: Orange (#f97316)
- **Border**: `border-l-orange-500`
- **Background**: `bg-orange-50 dark:bg-orange-950/20`
- **Icon**: `text-orange-600 dark:text-orange-400`
- **Descripción**: Se activa cuando el cliente no ha registrado peso en varios días

### 6. **Milestone Achieved** (Amarillo)
- **Color**: Yellow (#eab308)
- **Border**: `border-l-yellow-500`
- **Background**: `bg-yellow-50 dark:bg-yellow-950/20`
- **Icon**: `text-yellow-600 dark:text-yellow-400`
- **Descripción**: Se activa cuando el cliente alcanza un milestone configurado

### 7. **Target Streak** (Púrpura)
- **Color**: Purple (#a855f7)
- **Border**: `border-l-purple-500`
- **Background**: `bg-purple-50 dark:bg-purple-950/20`
- **Icon**: `text-purple-600 dark:text-purple-400`
- **Descripción**: Se activa cuando el cliente mantiene una racha dentro del objetivo

### 8. **Photo Uploaded** (Cian) ⭐ NUEVO
- **Color**: Cyan (#06b6d4)
- **Border**: `border-l-cyan-500`
- **Background**: `bg-cyan-50 dark:bg-cyan-950/20`
- **Icon**: `text-cyan-600 dark:text-cyan-400`
- **Descripción**: Se activa cuando el cliente sube una foto de progreso
- **Funcionalidad especial**: Al hacer clic en esta alerta se muestra la foto en un dialog modal

---

## Client Notification Types

Estas son las notificaciones que el cliente/athlete recibe:

### 1. **Weight Modified** (Azul)
- **Descripción**: Notifica cuando el coach modifica un peso registrado

### 2. **Target Rate Changed** (Azul)
- **Descripción**: Notifica cuando el coach cambia el objetivo de tasa semanal

### 3. **Photo Requested** (Naranja)
- **Descripción**: Notifica cuando el coach solicita una foto de progreso

### 4. **Milestone Set** (Amarillo)
- **Descripción**: Notifica cuando el coach establece un nuevo milestone

### 5. **Reminder Updated** (Gris)
- **Descripción**: Notifica cambios en la configuración de recordatorios

### 6. **Nutrition Updated** (Verde)
- **Descripción**: Notifica cuando el coach actualiza el plan nutricional

### 7. **Coach Message** (Púrpura)
- **Descripción**: Mensajes generales del coach

---

## Implementación Técnica

### En el código (AlertsPanel.tsx):

```typescript
const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'lowest':
      return {
        border: 'border-l-green-500',
        bg: 'bg-green-50 dark:bg-green-950/20',
        icon: 'text-green-600 dark:text-green-400'
      };
    case 'photo_uploaded':
      return {
        border: 'border-l-cyan-500',
        bg: 'bg-cyan-50 dark:bg-cyan-950/20',
        icon: 'text-cyan-600 dark:text-cyan-400'
      };
    // ... otros casos
  }
};
```

### Interacción especial para Photo Uploaded:

Cuando el usuario hace clic en una alerta de tipo `photo_uploaded`, se abre un dialog modal que muestra la foto subida en lugar de navegar al cliente. Esto permite al coach ver rápidamente la foto sin salir del panel de alertas.

---

## Colores HEX para Documentación Externa

| Tipo | Color Principal | Código HEX |
|------|----------------|------------|
| Lowest Weight | Verde | #22c55e |
| Highest Weight | Rojo | #ef4444 |
| Rate Deviation | Naranja | #f97316 |
| Weight Modified | Azul | #3b82f6 |
| No Weight Entry | Naranja | #f97316 |
| Milestone Achieved | Amarillo | #eab308 |
| Target Streak | Púrpura | #a855f7 |
| **Photo Uploaded** | **Cian** | **#06b6d4** |

---

**Nota**: El color Cian (#06b6d4) fue elegido para las notificaciones de fotos porque:
1. Es distintivo y fácil de identificar
2. No se confunde con otros tipos de alertas
3. Evoca "visual/imagen" de manera intuitiva
4. Funciona bien tanto en light como en dark theme
