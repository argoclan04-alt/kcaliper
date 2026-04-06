# 👀 GUÍA VISUAL DE CAMBIOS IMPLEMENTADOS

## 🎯 Cómo Ver los Cambios

### Paso 1: Abrir la Aplicación
1. Navega a `/html-version/index.html`
2. Abre el archivo en tu navegador

### Paso 2: Cambiar a Vista de Coach
1. En el selector de usuario (dropdown), selecciona **"Coach Alexandra"**
2. Esto cargará el Coach Dashboard

---

## 📸 CAMBIOS VISUALES IMPLEMENTADOS

### 1️⃣ **Header del User Switcher - Layout Reorganizado**

**ANTES:** Nombre, badge y selector todos en una fila horizontal

**AHORA:**
```
┌─────────────────────────────────────────────────────┐
│ 👤 Coach Alexandra                      🌙 Toggle    │
│ [Coach Badge] [Selector de Usuario ▼]               │
└─────────────────────────────────────────────────────┘
```

**Estructura:**
- **Línea 1:** Ícono + Nombre completo → Theme toggle a la derecha
- **Línea 2:** Badge de rol + Selector de usuario

---

### 2️⃣ **Tabla de Clientes Simplificada**

**ANTES:** Cards grandes con mucha información

**AHORA:** Tabla compacta con solo columnas esenciales

```
┌──────────────────────────────────────────────────────────────────┐
│ Name              │ Current Weight │ Rate          │ Target       │
├──────────────────────────────────────────────────────────────────┤
│ Sarah Johnson     │ 68.5 kg       │ 🟢 -0.5 kg/wk │ ⚪ -0.5 kg/wk │
│ sarah@example.com │               │               │              │
├──────────────────────────────────────────────────────────────────┤
│ Michael Chen      │ 85.2 kg       │ 🟢 -0.8 kg/wk │ 🔴 -1.5 kg/wk│ ← ROJO!
│ michael@example...│               │               │              │
└──────────────────────────────────────────────────────────────────┘
```

**Características:**
- **Name:** Nombre + email del cliente
- **Current Weight:** Último peso registrado
- **Rate:** Weekly rate actual (verde = pérdida, rojo = ganancia)
- **Target:** Target rate con **alerta roja** si está fuera del rango -1.0 a -0.25
- **Actions:** 
  - Desktop: botón "Settings"
  - Móvil: ⋮ (3 puntos verticales)

---

### 3️⃣ **Botón Flotante de Notificaciones**

**Posición:** Esquina superior derecha, debajo del header

```
                                    ┌────┐
                                    │ 🔔 │ ← Badge rojo si hay no leídas
                                    └────┘
```

**Comportamiento de Scroll:**
- 👇 Scroll down → Botón se esconde (fade out + translateY)
- 👆 Scroll up → Botón aparece (fade in + translateY)
- ⏱️ 1 segundo después de dejar de scrollear → Botón aparece

**Visual:**
- Fondo blanco (dark: gris oscuro)
- Sombra elevada
- Ícono de campana
- Badge rojo circular en esquina superior derecha si hay notificaciones no leídas

---

### 4️⃣ **Panel de Notificaciones Full Screen**

**Al hacer click en el botón flotante:**

```
┌──────────────────────────────────────────┐
│ Notifications                         ✕  │ ← Header
├──────────────────────────────────────────┤
│ Unread (3)      │ Read (5)              │ ← Tabs
├──────────────────────────────────────────┤
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 🔻 Lowest weight achieved!         │  │
│ │    Sarah reached 68.5 kg           │  │
│ │    2 hours ago                     │  │
│ │    [Mark as read]                  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ ⚠️ Rate deviation detected         │  │
│ │    Michael's rate is off target    │  │
│ │    5 hours ago                     │  │
│ │    [Mark as read]                  │  │
│ └────────────────────────────────────┘  │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

**Características:**
- **Full screen:** Ocupa toda la pantalla
- **Animación:** Desliza desde la derecha
- **Tabs:** Unread (por defecto) y Read
- **Contador:** Muestra número de notificaciones en cada tab
- **Notificaciones no leídas:** Fondo blanco + botón "Mark as read"
- **Notificaciones leídas:** Opacidad 75%

**Cierre:**
1. ✕ Click en botón X (esquina superior derecha)
2. 👉 Swipe hacia la derecha (móvil) - mínimo 100px

---

### 5️⃣ **Target Rate con Alerta Roja**

**Lógica:**
```javascript
Rango recomendado: -1.0 a -0.25 kg/semana

Si target rate < -1.0 o > -0.25:
  → ROJO (bg-red-100 text-red-700)

Si target rate está dentro del rango:
  → GRIS (bg-gray-100 text-gray-700)
```

**Ejemplo Visual:**

| Cliente       | Target Rate   | Color  | Motivo                                    |
|---------------|---------------|--------|-------------------------------------------|
| Sarah         | -0.5 kg/wk   | ⚪ Gris | Dentro del rango (-1.0 a -0.25)          |
| Michael       | -1.5 kg/wk   | 🔴 Rojo | Muy bajo (< -1.0)                        |
| Jessica       | +0.2 kg/wk   | 🔴 Rojo | Positivo (> -0.25)                       |
| David         | -0.8 kg/wk   | ⚪ Gris | Dentro del rango                         |

---

### 6️⃣ **Settings en Móvil vs Desktop**

**Desktop (pantalla > 768px):**
```
┌──────────────┐
│  Settings    │ ← Texto completo
└──────────────┘
```

**Móvil (pantalla ≤ 768px):**
```
┌────┐
│  ⋮ │ ← 3 puntos verticales (ícono more-vertical)
└────┘
```

**Implementación:**
- Clase `.hide-mobile` en el texto "Settings" → oculto en móvil
- Clase `.show-mobile` en el ícono ⋮ → visible solo en móvil

---

### 7️⃣ **Badge de Notificaciones No Leídas**

**Cuando hay notificaciones no leídas:**
```
    ┌────┐
    │ 🔔 │
    └──●─┘  ← Badge rojo circular
```

**Cuando NO hay notificaciones no leídas:**
```
    ┌────┐
    │ 🔔 │
    └────┘  ← Sin badge
```

**Ubicación:** Esquina superior derecha del botón flotante

---

### 8️⃣ **Dark Theme Soporte**

**Todos los componentes soportan dark theme:**

| Componente            | Light Mode          | Dark Mode                    |
|-----------------------|---------------------|------------------------------|
| Tabla de clientes     | bg-white            | bg-gray-800                  |
| Target rate desviado  | bg-red-100          | bg-red-900/30                |
| Botón flotante        | bg-white            | bg-gray-800                  |
| Panel notificaciones  | bg-white            | bg-gray-900                  |
| Badge rojo            | bg-red-500          | bg-red-500 (sin cambio)      |

---

## 🧪 CÓMO PROBAR CADA CAMBIO

### Test 1: Header Reorganizado
1. Abre la app
2. Verifica que el nombre está en la primera línea
3. Verifica que el badge y selector están en la segunda línea
4. Verifica que el theme toggle está a la derecha

### Test 2: Tabla Simplificada
1. Cambia a Coach Alexandra
2. Verifica que la tabla solo tiene: Name, Current Weight, Rate, Target, Actions
3. Verifica que NO hay título "Coach Dashboard"
4. Verifica que NO hay subtítulo

### Test 3: Target Rate en Rojo
1. Busca clientes con target rate fuera del rango -1.0 a -0.25
2. Verifica que tienen fondo rojo

### Test 4: Settings en Móvil
1. Abre DevTools → Responsive mode
2. Cambia a tamaño móvil (< 768px)
3. Verifica que el botón Settings muestra ⋮ en lugar de texto

### Test 5: Botón Flotante + Scroll
1. Cambia a Coach Alexandra
2. Verifica que aparece el botón flotante en la esquina superior derecha
3. Scroll down → Botón se esconde
4. Scroll up → Botón aparece
5. Detén el scroll → Espera 1 segundo → Botón aparece

### Test 6: Badge Rojo
1. Verifica que hay alertas no leídas en los mock data
2. Verifica que aparece un punto rojo en el botón flotante

### Test 7: Panel de Notificaciones
1. Click en el botón flotante
2. Verifica que el panel se desliza desde la derecha
3. Verifica que hay tabs "Unread" y "Read"
4. Click en cada tab para cambiar
5. Click en "Mark as read" en una notificación
6. Verifica que se mueve al tab "Read"

### Test 8: Cierre del Panel
1. Abre el panel de notificaciones
2. Click en ✕ → Panel se cierra
3. Abre el panel de nuevo
4. En móvil: desliza hacia la derecha → Panel se cierra

### Test 9: Dark Theme
1. Click en el theme toggle
2. Verifica que TODOS los componentes cambian a dark mode
3. Verifica colores de target rate en rojo, botón flotante, panel, etc.

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Desktop:  > 768px
  - Settings como texto
  - Tabla completa visible

Mobile:   ≤ 768px
  - Settings como ⋮
  - Tabla con scroll horizontal si es necesario
  - Swipe gestures activos
```

---

## 🎨 PALETA DE COLORES

### Light Mode:
```
Fondo tabla:           bg-white
Fondo header tabla:    bg-gray-50
Target desviado:       bg-red-100 text-red-700 border-red-200
Rate negativo:         bg-green-100 text-green-700 border-green-200
Rate positivo:         bg-red-100 text-red-700 border-red-200
Badge rojo:            bg-red-500
Botón flotante:        bg-white + shadow-lg
```

### Dark Mode:
```
Fondo tabla:           bg-gray-800
Fondo header tabla:    bg-gray-900
Target desviado:       bg-red-900/30 text-red-300 border-red-800
Rate negativo:         bg-green-900/30 text-green-300 border-green-800
Rate positivo:         bg-red-900/30 text-red-300 border-red-800
Badge rojo:            bg-red-500 (sin cambio)
Botón flotante:        bg-gray-800 + shadow-lg
```

---

## ✅ CHECKLIST VISUAL

Al abrir la aplicación como Coach, deberías ver:

- [ ] Header con nombre en fila 1 y badge/selector en fila 2
- [ ] Tabla de clientes con solo 5 columnas
- [ ] Target rate en rojo cuando está fuera del rango
- [ ] Botón flotante de notificaciones en esquina superior derecha
- [ ] Badge rojo en el botón si hay notificaciones no leídas
- [ ] Al scroll down, botón se esconde
- [ ] Al scroll up, botón aparece
- [ ] Click en botón abre panel full-screen
- [ ] Panel tiene tabs Unread y Read
- [ ] Click en X cierra el panel
- [ ] Swipe derecha cierra el panel (móvil)
- [ ] En móvil, Settings muestra ⋮
- [ ] Dark theme funciona en todos los componentes

---

## 🚀 PRÓXIMOS PASOS

Una vez verificado que todos los cambios visuales están funcionando:

1. **Conectar con FastAPI:**
   - Implementar endpoints para notificaciones
   - Implementar endpoints para obtener clientes
   - Implementar WebSocket para notificaciones real-time

2. **Optimizaciones:**
   - Agregar filtros en la tabla de clientes
   - Agregar búsqueda por nombre
   - Agregar ordenamiento de columnas
   - Agregar paginación

3. **Testing:**
   - Probar en diferentes dispositivos
   - Probar en diferentes navegadores
   - Probar con muchos clientes (>50)
   - Probar con muchas notificaciones (>100)

---

## 📞 SOPORTE

Si encuentras algún problema o los cambios no están funcionando como se describe:

1. Verifica que estás usando `/html-version/index.html`
2. Verifica que todos los archivos JS están cargados (F12 → Console)
3. Verifica que Lucide icons está cargado
4. Limpia el cache del navegador (Ctrl+Shift+R)
5. Revisa `/html-version/VERIFICACION_CAMBIOS.md` para ubicaciones exactas del código
