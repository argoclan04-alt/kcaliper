# Sistema de Notificaciones - Weight Tracker

## 📋 Resumen

El sistema de notificaciones automáticas alerta al coach cuando ocurren eventos importantes en el progreso de sus clientes. Cada tipo de alerta tiene un propósito específico y se genera automáticamente según criterios técnicos.

---

## 🔔 Tipos de Notificaciones

### 1. **LOWEST WEIGHT** (Peso más bajo alcanzado)
**Color:** 🟢 Verde

**¿Cuándo se genera?**
- Cuando un cliente registra un peso que es el **más bajo** de todo su historial
- Se compara el nuevo peso con TODOS los pesos anteriores registrados
- Solo se genera si el nuevo peso es **estrictamente menor** que cualquier peso anterior

**Ejemplo:**
```
Historial de pesos: 85.5 kg → 84.2 kg → 83.8 kg → 83.5 kg ← ✅ ALERTA
```
Al registrar 83.5 kg, como es el peso más bajo de todo el historial, se genera la alerta "Lowest Weight"

**Propósito:**
- Celebrar hitos importantes en la pérdida de peso
- Motivar al cliente al mostrar progreso tangible
- Ayudar al coach a identificar quién está logrando sus objetivos

---

### 2. **HIGHEST WEIGHT** (Peso más alto alcanzado)
**Color:** 🔴 Rojo

**¿Cuándo se genera?**
- Cuando un cliente registra un peso que es el **más alto** de todo su historial
- Se compara el nuevo peso con TODOS los pesos anteriores registrados
- Solo se genera si el nuevo peso es **estrictamente mayor** que cualquier peso anterior

**Ejemplo:**
```
Historial de pesos: 70.2 kg → 71.5 kg → 72.8 kg → 73.2 kg ← ✅ ALERTA
```
Al registrar 73.2 kg, como es el peso más alto de todo el historial, se genera la alerta "Highest Weight"

**Propósito:**
- Para clientes en fase de ganancia muscular (bulking), es positivo
- Para clientes en pérdida de peso, puede indicar un problema que requiere atención
- Permite al coach intervenir rápidamente si es necesario

---

### 3. **RATE DEVIATION** (Desviación del rate objetivo)
**Color:** 🟠 Naranja

**¿Cuándo se genera?**
- Cuando el **Weekly Rate** actual del cliente se desvía significativamente del **Target Weekly Rate** configurado por el coach
- **Tolerancia:** ±0.3 kg/semana del objetivo
- Se calcula usando la **regresión lineal** sobre la línea de tendencia DEMA

**Fórmula de comparación:**
```javascript
const tolerance = 0.3;
const lowerBound = targetRate - tolerance;
const upperBound = targetRate + tolerance;

// Se genera alerta si:
weeklyRate < lowerBound || weeklyRate > upperBound
```

**Ejemplo 1 - Cliente en pérdida de peso:**
```
Target Weekly Rate: -0.5 kg/week
Rango aceptable: -0.8 a -0.2 kg/week

Semana 1: Rate = -0.4 kg/week → ✅ Dentro del rango (no alerta)
Semana 2: Rate = -0.1 kg/week → ⚠️ ALERTA (muy lento, fuera del rango)
Semana 3: Rate = -0.9 kg/week → ⚠️ ALERTA (muy rápido, fuera del rango)
```

**Ejemplo 2 - Cliente en ganancia muscular:**
```
Target Weekly Rate: +0.3 kg/week
Rango aceptable: 0 a +0.6 kg/week

Semana 1: Rate = +0.4 kg/week → ✅ Dentro del rango (no alerta)
Semana 2: Rate = -0.1 kg/week → ⚠️ ALERTA (perdiendo peso en vez de ganar)
Semana 3: Rate = +0.7 kg/week → ⚠️ ALERTA (ganando muy rápido)
```

**Propósito:**
- Detectar cuando el progreso del cliente no coincide con el plan
- Permite ajustar calorías/macros rápidamente
- Evita pérdidas de peso muy rápidas (pérdida de masa muscular) o muy lentas (falta de adherencia)

**¿Cómo se muestra visualmente?**
- En la lista de clientes, el **Rate badge** se pone en **rojo** si está fuera de rango
- En desktop: "Rate" aparece con color rojo
- En móvil: No se muestra Rate, solo en desktop

---

### 4. **WEIGHT MODIFIED** (Peso modificado)
**Color:** 🟡 Amarillo

**¿Cuándo se genera?**
- Cuando un cliente **edita** un peso que ya había registrado previamente
- Solo se aplica a modificaciones del **valor del peso**, no de las notas
- Se registra tanto el peso anterior como el nuevo

**Ejemplo:**
```
Día 1 - Registro inicial: 85.2 kg
Día 2 - Cliente edita la entrada: 85.2 kg → 84.8 kg ← ⚠️ ALERTA
```

**Propósito:**
- **Transparencia:** El coach debe saber si un cliente está modificando sus datos
- **Integridad de datos:** Detectar posibles intentos de "mejorar" artificialmente el progreso
- **Confianza:** Mantener la honestidad en la relación coach-cliente
- **Ajustes legítimos:** También captura correcciones genuinas (ej: se equivocó al registrar)

**Casos de uso comunes:**
1. ✅ **Legítimo:** Cliente se equivocó al escribir (85.2 en vez de 84.2)
2. ⚠️ **Sospechoso:** Cliente modifica pesos antiguos para "mejorar" su gráfica
3. ✅ **Legítimo:** Cliente usó una báscula diferente y quiere corregir

**Mensaje de la alerta:**
```
"John Smith modified weight entry from 85.2 kg to 84.8 kg on Jan 15"
```

---

### 5. **NO WEIGHT ENTRY** (Sin registro de peso)
**Color:** 🟠 Naranja

**¿Cuándo se genera?**
- Cuando un cliente **no ha registrado su peso** en los últimos **X días** (configurable, típicamente 3-7 días)
- Se verifica diariamente
- Solo se genera una vez hasta que el cliente vuelva a registrar

**Propósito:**
- Mantener la adherencia del cliente al plan
- Detectar falta de compromiso temprano
- Permitir al coach intervenir con un mensaje motivacional

---

### 6. **MILESTONE ACHIEVED** (Hito alcanzado)
**Color:** 🟡 Amarillo/Dorado

**¿Cuándo se genera?**
- Cuando un cliente alcanza el **Weight Milestone** configurado por el coach
- Solo se genera **una vez** cuando se cruza el umbral
- Para pérdida de peso: cuando el peso es ≤ milestone
- Para ganancia de peso: cuando el peso es ≥ milestone

**Ejemplo:**
```
Cliente: Sarah Connor
Milestone configurado: 68.0 kg
Progreso:
  - 72.5 kg → Sin alerta
  - 70.2 kg → Sin alerta
  - 68.5 kg → Sin alerta
  - 68.0 kg → ✅ ALERTA "Milestone Achieved"
  - 67.5 kg → Sin nueva alerta (ya se generó)
```

**Propósito:**
- Celebrar objetivos importantes
- Motivar al cliente
- Permitir al coach felicitar personalmente

---

## 🎨 Indicadores Visuales

### En la lista de clientes:
```
Cliente con alertas:
┌─────────────────────────────────────┐
│ John Smith 🔵                       │ ← Círculo azul = tiene alertas
│ Weight: 85.2 kg  Target: -0.5      │
│ Milestone: 80.0 kg                 │
└─────────────────────────────────────┘
```

### En el panel de alertas:
```
🟢 John Smith reached lowest weight: 83.5 kg
🔴 Sarah Connor reached highest weight: 73.2 kg
🟠 Mike Johnson's rate deviating from target
🟡 Emily Davis modified weight entry
```

---

## ⚙️ Configuración por Cliente

El coach puede activar/desactivar cada tipo de notificación individualmente para cada cliente en **Settings**:

```
Client Settings - John Smith

Notification Settings:
☑ Lowest Weight        - Alert when client reaches new lowest
☑ Highest Weight       - Alert when client reaches new highest
☑ Rate Deviation       - Alert when rate deviates from target
☑ Weight Modified      - Alert when client modifies existing entry
```

---

## 📊 Fórmulas Técnicas

### Weekly Rate (usado en Rate Deviation)
```
1. Calcular DEMA para todas las entradas
2. Aplicar regresión lineal sobre los valores DEMA
3. Weekly Rate = pendiente de la línea de regresión × 7
```

### DEMA (Double Exponential Moving Average)
```
α = 2 / (n + 1)
EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))
DEMA = (2 × EMA_n) - EMA(EMA_n)
```

---

## 🎯 Mejores Prácticas para Coaches

1. **Lowest/Highest Weight:**
   - Felicita inmediatamente cuando veas estas alertas
   - Úsalas como oportunidades de motivación

2. **Rate Deviation:**
   - Revisa la nutrición del cliente
   - Ajusta calorías/macros si es necesario
   - Pregunta sobre adherencia y posibles obstáculos

3. **Weight Modified:**
   - Comunícate con el cliente para entender el motivo
   - Si es legítimo, no hay problema
   - Si es sospechoso, habla sobre honestidad

4. **No Weight Entry:**
   - Envía un mensaje recordatorio amigable
   - Pregunta si hay algún problema con el plan

5. **Milestone Achieved:**
   - ¡Celebra! 🎉
   - Considera ajustar a un nuevo milestone

---

## 💡 Ejemplos de Escenarios Reales

### Escenario 1: Cliente en Pérdida de Peso (Fat Loss)
```
Cliente: John Smith
Objetivo: Perder grasa
Target Rate: -0.5 kg/week
Milestone: 80.0 kg

Semana 1: 85.5 kg → 85.0 kg (Rate: -0.5) ✅ En objetivo
Semana 2: 85.0 kg → 84.3 kg (Rate: -0.7) ⚠️ Rate Deviation (muy rápido)
Semana 3: 84.3 kg → 83.5 kg (Rate: -0.8) 🟢 Lowest Weight
         → Coach ajusta calorías ligeramente hacia arriba
```

### Escenario 2: Cliente en Ganancia Muscular (Lean Bulk)
```
Cliente: Sarah Connor
Objetivo: Ganar músculo
Target Rate: +0.3 kg/week
Milestone: 75.0 kg

Semana 1: 70.5 kg → 70.8 kg (Rate: +0.3) ✅ En objetivo
Semana 2: 70.8 kg → 71.5 kg (Rate: +0.7) ⚠️ Rate Deviation (muy rápido, probablemente grasa)
Semana 3: 71.5 kg → 72.0 kg (Rate: +0.5) ⚠️ Rate Deviation
         → Coach reduce calorías ligeramente
```

---

## 🔧 Configuración Técnica

Ubicación en el código: `/hooks/useWeightTracker.ts`

Los criterios de alerta se configuran en:
```typescript
// Rate Deviation tolerance
const RATE_TOLERANCE = 0.3; // ±0.3 kg/week

// No entry alert threshold  
const NO_ENTRY_DAYS = 7; // 7 días sin registro
```

---

**Última actualización:** Enero 2025
