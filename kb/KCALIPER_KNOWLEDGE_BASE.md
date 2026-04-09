# 🧠 KCALIPER.AI — KNOWLEDGE BASE MAESTRA
### *Documento Único de Referencia para Marketing, Finanzas, Estrategia y Operaciones*
**Versión:** 2.0 · **Fecha:** 8 de Abril, 2026 · **Autor:** Equipo Fundador ARGO  
**Clasificación:** Confidencial — Solo Equipo Interno y Agencia de Marketing

---

## TABLA DE CONTENIDOS

1. [Identidad de Marca](#1-identidad-de-marca)
2. [Inventario Completo de Funciones](#2-inventario-completo-de-funciones)
3. [Estrategia "Playing to Win"](#3-estrategia-playing-to-win)
4. [Arquitectura de Precios](#4-arquitectura-de-precios)
5. [Análisis Financiero](#5-análisis-financiero)
6. [Estrategia de Marketing](#6-estrategia-de-marketing)
7. [Calendario de Contenido](#7-calendario-de-contenido)
8. [Programa de Influencers](#8-programa-de-influencers)
9. [CaliBot — Mascota de Marca](#9-calibot--mascota-de-marca)
10. [VSL Script para Coaches](#10-vsl-script-para-coaches)
11. [Roadmap Pre-Lanzamiento](#11-roadmap-pre-lanzamiento)
12. [Playbook Operativo](#12-playbook-operativo)

---

## 1. IDENTIDAD DE MARCA

### 1.1 Datos de la Empresa

| Campo | Valor |
|:---|:---|
| **Nombre Comercial** | Kcaliper.ai |
| **Nombre Legal** | ARGO (holding) |
| **Slogan Principal** | *"Nunca más estarás solo en tu transformación."* |
| **Slogan Coach** | *"El sistema nervioso central del entrenador moderno."* |
| **Misión** | Eliminar la adivinanza del peso corporal con matemáticas y IA. |
| **URL Landing (Atleta)** | `kcaliper.ai` (ruta: `/`) |
| **URL Landing (Coach)** | `kcaliper.ai/coach` |
| **URL Early Access** | `kcaliper.ai/early-access` |
| **URL Login** | `kcaliper.ai/login` |
| **Instagram** | `@kcaliper.ai` |

### 1.2 Sistema de Colores

| Token | HEX | Uso |
|:---|:---|:---|
| **Violet Primary** | `#6C5CE7` | Botones CTA, gradientes, acentos de marca |
| **Cyan Secondary** | `#00D2FF` | Features de coach, badges, acentos secundarios |
| **Coral Accent** | `#FF6B6B` | Urgencia, problemas, descuentos, alertas |
| **Yellow Warm** | `#FFD93D` | Milestones, celebraciones, badges de logro |
| **Green Success** | `#22C55E` | Progreso positivo, confirmaciones |
| **Dark Background** | `#0A0A1A` | Fondo principal de landing pages |
| **Dark Card** | `#12122A` | Tarjetas sobre fondo oscuro |
| **Dark Border** | `rgba(108, 92, 231, 0.2)` | Bordes sutiles con tinte violeta |

### 1.3 Gradientes de Marca

| Gradiente | Definición | Uso |
|:---|:---|:---|
| **Primario** | `135deg, #6C5CE7 → #00D2FF` | CTAs principales, headers |
| **Warm** | `135deg, #6C5CE7 → #FF6B6B` | Secciones de urgencia, problema |
| **Full Spectrum** | `135deg, #6C5CE7 → #00D2FF → #FF6B6B` | Efectos especiales, hero bg |
| **Text Warm** | `135deg, #FF6B6B → #FFD93D` | Texto de impacto emocional |

### 1.4 Tipografía

| Uso | Fuente | Peso |
|:---|:---|:---|
| **Headlines** | Inter | 800 (Extra Bold) |
| **Body** | Inter | 400 (Regular) |
| **Labels / Tags** | Inter | 700 (Bold), UPPERCASE, tracking-widest |
| **Números / Data** | System UI (monospace feel) | 600 (Semibold) |

### 1.5 Estilo Visual

- **Dark Mode First** — Todas las landing pages son dark mode (#0A0A1A)
- **Glassmorphism** — Tarjetas con `backdrop-blur(16px)` y bordes translúcidos
- **Micro-animaciones** — Float, pulse, fade-in, slide-up en todos los elementos
- **Mobile-first** — Diseño optimizado primero para móvil, luego desktop
- **Sin stock photos** — Solo modelos generados por IA o mockups de producto

### 1.6 Modelos IA para Contenido

Usamos **2 modelos femeninos generados por IA** como rostros de la marca:
- **Modelo A:** Mujer latina, 23-27 años, fitness lifestyle, cabello oscuro. Tonos cálidos, fondos de cocina/gym/rooftop.
- **Modelo B:** Mujer latina, 25-30 años, más "profesional/coach". Tonos fríos, fondos de estudio/oficina moderna.

> [!IMPORTANT]
> Ambas modelos deben ser **consistentes** en todas las piezas. Solo se generan con IA. Nunca usar fotos de personas reales.

### 1.7 Tono de Comunicación

| Canal | Tono | Ejemplo |
|:---|:---|:---|
| **Instagram (Atletas)** | Empático, motivacional, sin patronizar | "Tu peso subió 0.5kg. Tranqui — es agua. Tu tendencia REAL sigue bajando. 📊" |
| **Instagram (Coaches)** | Profesional, técnico, respeto al expertise | "Dashboard que te muestra lo que importa. Sin ruido. Solo datos accionables." |
| **Landing Page** | Urgente, directo, orientado a dolor → solución | "¿Te rindes porque 'no funciona'? Sin datos objetivos, abandonas dietas que SÍ funcionaban." |
| **WhatsApp (CaliBot)** | Amigable, inteligente, usa emojis estratégicamente | "Tranquila — eso es retención de agua normal. Tu tendencia REAL de grasa sigue en -0.28/semana 📊" |

---

## 2. INVENTARIO COMPLETO DE FUNCIONES

> [!CAUTION]
> Esta lista refleja **exactamente** lo que existe en el código actual. No inventar funciones que no existan. Cualquier función futura debe marcarse como [PRÓXIMAMENTE].

### 2.1 Perspectiva del COACH — Dashboard B2B

#### A. Resumen de Clientes (Vista Principal)
| # | Función | Descripción Técnica | Estado |
|:--|:---|:---|:---|
| C1 | **Panel de Clientes Unificado** | Grid con todos los atletas mostrando badges de peso actual, weekly rate, target rate, último pesaje, y milestone. | ✅ Activo |
| C2 | **Indicador de Alertas por Cliente** | Punto azul junto al nombre si tiene alertas no leídas. | ✅ Activo |
| C3 | **Badge "LOWEST ✨"** | Se muestra pulsante cuando un cliente alcanza su peso más bajo histórico. | ✅ Activo |
| C4 | **Acceso Rápido a Config** | Botón de engranaje/⋮ por cliente para abrir configuración sin abrir el perfil completo. | ✅ Activo |
| C5 | **Click para Análisis Completo** | Click en la tarjeta de cliente abre modal con gráfica + tabla de peso completa. | ✅ Activo |

#### B. Análisis de Peso por Cliente (Modal)
| # | Función | Descripción Técnica | Estado |
|:--|:---|:---|:---|
| C6 | **Gráfica de Tendencia** | Chart con peso real + línea DEMA superpuesta. Recharts. | ✅ Activo |
| C7 | **Tabla de Entradas de Peso** | Tabla con fecha, peso, DEMA, weekly rate, notas, y acciones de edición. | ✅ Activo |
| C8 | **Editar Entrada de Peso** | Coach puede modificar peso, notas. Se genera alerta "weight_modified" al atleta. | ✅ Activo |
| C9 | **Excluir de Cálculos** | Marcar una entrada como excluida (ej. pesaje post-viaje). No afecta DEMA ni rate. | ✅ Activo |
| C10 | **Marcar Peso Lowest/Highest** | Coach puede marcar manualmente un peso como mínimo o máximo notable. | ✅ Activo |
| C11 | **Fotos de Progreso por Peso** | Ver fotos de physique asociadas a cada entrada de peso (front/side/back). | ✅ Activo |
| C12 | **Datos Nutricionales** | Planes nutricionales vinculados a las entradas (calorías, proteína, carbs, grasas). | ✅ Activo |

#### C. Sistema de Alertas del Coach
| # | Función | Tipo de Alerta | Descripción |
|:--|:---|:---|:---|
| C13 | **Peso Mínimo** | `lowest` | "Valentina Torres alcanzó un nuevo peso mínimo: 65.8 kg 🎉" |
| C14 | **Peso Máximo** | `highest` | "Sebastián Ríos alcanzó un nuevo peso máximo: 78.5 kg 💪" |
| C15 | **Desviación de Ritmo** | `rate_deviation` | "Diego Morales — su ritmo semanal (-0.8 kg) excede la meta (-0.5 kg)." |
| C16 | **Peso Modificado** | `weight_modified` | "Valentina Torres modificó su entrada del 2026-04-03" |
| C17 | **Sin Registro** | `no_weight_entry` | "Isabella Mendoza no ha registrado peso por 3 días" |
| C18 | **Milestone Alcanzado** | `milestone_achieved` | "Camila Herrera superó el milestone de 63.5 kg. ¡A re-configurar! 🎯" |
| C19 | **Racha de Target** | `target_streak` | "Camila Herrera ha mantenido su ritmo objetivo por 14 días consecutivos 🏆" |
| C20 | **Foto Subida** | `photo_uploaded` | Notificación cuando un atleta sube una nueva foto de physique. |

> [!TIP]
> Cada alerta se puede **marcar como leída** individualmente. Las alertas no leídas aparecen con badge en el header (mobile) y en el panel lateral (desktop).

#### D. Configuración por Cliente
| # | Función | Descripción |
|:--|:---|:---|
| C21 | **Target Weekly Rate** | Configurar tasa objetivo en kg/semana (ej. -0.5 para cut, +0.3 para bulk). Con selector +/- |
| C22 | **Milestone** | Establecer meta de peso para el cliente. Se genera alerta cuando se alcanza. |
| C23 | **Toggle: Notificar Lowest** | Activar/desactivar alertas de peso mínimo por cliente. |
| C24 | **Toggle: Notificar Highest** | Activar/desactivar alertas de peso máximo por cliente. |
| C25 | **Toggle: Desviación de Tasa** | Alertar si la tasa semanal se desvía significativamente del objetivo. |
| C26 | **Toggle: Peso Modificado** | Alertar si el atleta modifica una entrada existente. |

#### E. Solicitud de Fotos
| # | Función | Descripción |
|:--|:---|:---|
| C27 | **Request Photo** | Coach envía solicitud de foto con fecha objetivo y tipo de vista (front/side/back). |
| C28 | **Estado de Solicitud** | Tracking: pending → completed/overdue/declined. |
| C29 | **Galería de Fotos** | Badge con contador de fotos por cliente. |

#### F. Nutrición
| # | Función | Descripción |
|:--|:---|:---|
| C30 | **Agregar Plan Nutricional** | Registrar calorías, proteína, carbs, grasas, con fecha de inicio y notas. |
| C31 | **Vincular Nutrición a Peso** | Cada entrada de peso puede referenciar el plan nutricional activo en esa fecha. |

---

### 2.2 Perspectiva del ATLETA — Logbook Personal

| # | Función | Descripción | Estado |
|:--|:---|:---|:---|
| A1 | **Registro de Peso** | Formulario para ingresar peso diario con fecha y notas opcionales. | ✅ Activo |
| A2 | **Historial de Peso** | Tabla cronológica con todos los registros: peso, DEMA, weekly rate, notas. | ✅ Activo |
| A3 | **Gráfica de Tendencia** | Chart visual con peso real vs línea DEMA suavizada. | ✅ Activo |
| A4 | **Editar Notas** | Modificar las notas de una entrada existente. | ✅ Activo |
| A5 | **Subir Foto de Physique** | Upload de foto con tipo de vista (front/side/back) y notas. | ✅ Activo |
| A6 | **Notificaciones del Coach** | Mensajes del coach (milestone configurado, tasa ajustada, mensajes personales). | ✅ Activo |
| A7 | **Marcar Notificación Leída** | Click para descartar notificación del coach. | ✅ Activo |
| A8 | **Configurar Recordatorios** | Activar/desactivar recordatorio diario con hora personalizada (HH:MM). | ✅ Activo |
| A9 | **Toggle DEMA** | Mostrar/ocultar la línea de tendencia DEMA en la gráfica. | ✅ Activo |
| A10 | **Ver Milestone** | Ver la meta de peso configurada por el coach y si ya fue alcanzada. | ✅ Activo |

### 2.3 Motor Matemático (Backend de Cálculos)

| # | Función | Fórmula | Descripción |
|:--|:---|:---|:---|
| M1 | **EMA (Exponential Moving Average)** | `EMA_t = (W_t × α) + (EMA_{t-1} × (1-α))`, donde `α = 2/(n+1)`, `n=10` | Suaviza el ruido diario del peso. |
| M2 | **DEMA (Double EMA)** | `DEMA = (2 × EMA) - EMA(EMA)` | Elimina el lag del EMA simple. Responde más rápido a cambios reales. |
| M3 | **Weekly Rate (Regresión Lineal)** | Pendiente de la regresión lineal sobre los valores DEMA de las últimas 14 entradas, multiplicada por 7. | Ritmo de cambio semanal real, no contaminado por fluctuaciones diarias. |
| M4 | **Detección de Extremos** | Comparación directa contra min/max históricos. | Detecta nuevos pesos mínimos y máximos. |
| M5 | **Desviación de Tasa** | `|currentRate - targetRate| > 0.2` | Alerta cuando la tasa se desvía más de ±0.2 kg/sem del objetivo configured. |
| M6 | **Tendencia** | Comparación de promedios: primera mitad vs segunda mitad de las últimas 7 entradas. Diferencia > 0.1 = up/down. | Indicador simplificado de dirección (up/down/stable). |
| M7 | **Recálculo Completo** | Ordena todas las entradas cronológicamente, recalcula DEMA y weekly rate para cada una, excluyendo entradas marcadas. | Se ejecuta al cargar datos para garantizar consistencia. |

### 2.4 Sistema de Usuarios

| # | Función | Descripción |
|:--|:---|:---|
| U1 | **Roles: Coach / Client** | Cada usuario tiene un rol que determina su vista (Dashboard vs Logbook). |
| U2 | **User Switcher** | Dropdown en el header que permite al coach ver la app como cualquiera de sus atletas. |
| U3 | **Login Multi-Cuenta** | Sistema de autenticación que soporta múltiples perfiles de coach independientes. |
| U4 | **Dark Mode** | Toggle para modo oscuro en el dashboard. Persiste en localStorage. |
| U5 | **Módulos de Entrenamiento** | Botón placeholder para futuro contenido educativo del coach. |

### 2.5 Landing Pages

| # | Página | Público | Elementos Clave |
|:--|:---|:---|:---|
| L1 | **Landing Atleta** (`/`) | Atletas individuales | Hero con chat WhatsApp, problema/solución, features, CaliBot section, FAQ, email capture |
| L2 | **Landing Coach** (`/coach`) | Coaches y nutricionistas | Dashboard como hero, propuesta B2B, funciones de coach, pricing |
| L3 | **Early Access** (`/early-access`) | Post-registro | Countdown, pricing con descuento fundador, garantías |
| L4 | **Login** (`/login`) | Usuarios autorizados | Portal gated con credenciales, estilo glassmorphism |
| L5 | **Social Proof Widget** | Todas las landing | Pop-up flotante que simula registros recientes ("Carlos M. de México se unió hace 2 min") |
| L6 | **Waitlist Email Capture** | Landing atleta | Formulario de 2 pasos: email → perfil (nombre, país, fuente) |
| L7 | **Onboarding Wizard** | Post-registro | Cuestionario de 4 pasos que adapta la experiencia (atleta vs coach) |

### 2.6 Funciones de Infraestructura

| # | Función | Descripción |
|:--|:---|:---|
| I1 | **Supabase Backend** | Base de datos PostgreSQL con RLS, auth, y real-time subscriptions para alertas. |
| I2 | **Real-time Alerts** | Canal WebSocket que notifica al coach cuando se insertan/actualizan alertas. |
| I3 | **Real-time Weight** | Canal WebSocket que refresca los datos del cliente cuando se registra un nuevo peso. |
| I4 | **Mock Mode** | Sistema de datos simulados para demos. Detecta ausencia de sesión Supabase y carga datos locales. |
| I5 | **Waitlist (Supabase)** | Tabla de waitlist con email, perfil, y timestamp. Conectada a Supabase directamente. |
| I6 | **Vite + React + TypeScript** | Stack frontend. Build optimizado, HMR en desarrollo, dark mode nativo. |

---

## 3. ESTRATEGIA "PLAYING TO WIN" (Roger Martin)

> *"No estamos construyendo otra app de peso. Estamos construyendo el sistema nervioso central del entrenador moderno."*

### 3.1 Aspiración Ganadora (Winning Aspiration)

**Victoria definida:** Ser el estándar de accountability y monitorización de peso para los **100,000 principales coaches y nutricionistas de habla hispana** en 3 años.

**Propósito:** Eliminar la "brecha de los 29 días" (el atleta abandona en el día 29 porque no ve resultados, cuando SÍ los hay pero no los entiende) y el "estrés de persecución" (el coach persiguiendo al atleta para que le envíe sus datos).

**Métrica de Victoria:** El **95% de los atletas** sienten que su coach está con ellos **24/7** sin que el coach trabaje **un minuto extra**, logrando una retención del cliente **2x** vs sin herramienta.

### 3.2 ¿Dónde Jugar? (Where to Play)

| Dimensión | Elección Estratégica | Lo que NO hacemos |
|:---|:---|:---|
| **Mercado Geográfico** | Hispanoamérica → Perú (validación CENAN) → México, Colombia, España | Mercado anglosajón (fragmentado, saturado) |
| **Segmento Objetivo** | Coaches B2B2C: Entrenadores de competición, nutricionistas clínicos, coaches de hábitos | B2C Directo (usuarios sin coach a largo plazo) |
| **Canal de Acceso** | WhatsApp (donde el atleta YA vive) + Dashboard web para coach | App nativa propia (fricción de descarga) |
| **Modelo de Datos** | Peso corporal + composición como proxy principal | Calorías, pasos, sueño, genérico |
| **Precio** | Flat-fee por profesional (ilimitado en atletas) | Per-seat (cobrar por atleta como Trainerize) |

> [!WARNING]
> **"No jugamos en":** B2C Directo sin coach. Tracker de calorías genérico. App de recetas. Wearable integration. Estamos **verticalizados** en peso + composición corporal para coaches.

### 3.3 ¿Cómo Ganar? (How to Win)

1. **El Clon de IA (CaliBot → WhatsApp)**
   - La IA aprende el tono del coach.
   - El atleta responde por WhatsApp (donde ya vive).
   - **Destruye la fricción** de descargar otra app.
   - [PRÓXIMAMENTE] — Fase 2 post-lanzamiento.

2. **Diferenciación Técnica (DEMA)**
   - Somos la **única herramienta** que da una "tendencia real" matemática (no un SMA genérico).
   - Alertas de umbral reactivas: el coach no busca problemas; **el sistema le grita** cuando algo va mal.

3. **Modelo de Negocio Disruptivo (Tarifa Plana)**
   - Coach paga **$12.99/mes** → clientes ilimitados.
   - La competencia (Trainerize, etc.) cobra **por cliente**. Nosotros por "asiento de profesional".
   - A 20+ clientes, somos **infinitamente más baratos**.

4. **Ecosystem Lock-in (Efecto ARGO)**
   - Una vez que el historial del atleta y el estilo de la IA están configurados, **el costo de cambio es masivo**.
   - Embudo futuro: suplementación, equipo, planes de entrenamiento integrados.

### 3.4 El "Won't" (Ventaja Competitiva Protegida)

Según Roger Martin, la mejor protección es un **"won't"** — algo que los competidores podrían hacer pero **no querrán** porque les obliga a sacrificar su modelo actual.

| Competidor | Su Modelo | Nuestro "Won't" |
|:---|:---|:---|
| **Trainerize** | $45/mes por coach + fees por atleta. Revenue crece con atletas. | **No querrán** cobrar flat-fee porque destruye su unit economics. |
| **MyFitnessPal** | Freemium B2C de calorías. 200M usuarios. | **No querrán** verticalizar en peso/coach B2B porque abandona su base masiva B2C. |
| **Strong** | App de gym tracking. | **No querrán** añadir accountability de peso porque sale de su core de ejercicio. |
| **Manual por WhatsApp** | Coach usa grupo de WA gratis. | **No puede** escalar sin herramienta; nosotros automatizamos lo que ya hace a mano. |

### 3.5 Capacidades Requeridas

| Capacidad | Status | Descripción |
|:---|:---|:---|
| Motor DEMA + Weekly Rate | ✅ LIVE | Diferenciación técnica core. |
| Dashboard unificado de coach | ✅ LIVE | Vista de todos los atletas con alertas reactivas. |
| Sistema de alertas en tiempo real | ✅ LIVE | WebSocket via Supabase Realtime. |
| Ingesta de documentos IA + OCR | ⏳ ROADMAP | Leer PDF/Excel de dieta y extraer macros para contexto de CaliBot. |
| Visión Artificial de alimentos | ⏳ ROADMAP | Foto de comida → validar adherencia al plan. |
| CaliBot WhatsApp Integration | ⏳ ROADMAP | Clon de IA del coach que habla por WhatsApp al atleta. |
| Gestión de marca personal | ⏳ ROADMAP | Prompt engineering para que CaliBot suene como el coach. |

### 3.6 Sistemas de Gestión (Métricas)

| Métrica | Proxy Medible | Target |
|:---|:---|:---|
| **Adherencia del Atleta** | % de días con check-in en los últimos 14 días | > 80% |
| **Valor para el Coach** | Frecuencia con la que un coach abre un perfil tras recibir alerta | > 60% open rate |
| **Precisión de IA** | % de logs de CaliBot que no requieren corrección manual | > 90% |
| **Crecimiento de Red** | # de atletas invitados por coach | > 5 por coach en primer mes |
| **Retención** | % de coaches activos a los 90 días | > 70% |

### 3.7 ¿Qué tendría que ser verdad? (Apuestas de Riesgo)

1. Que el coach **prefiera pagar poco** y ganar eficiencia antes que tener una herramienta "todo en uno" lenta y cara.
2. Que el canal de **WhatsApp sea aceptado profesionalmente** por el atleta.
3. Que nuestro **OCR de fotos** sea lo suficientemente preciso para no irritar al coach con datos falsos.
4. Que los coaches hispanohablantes estén dispuestos a **digitalizar su workflow** (muchos aún usan Excel).

---

## 4. ARQUITECTURA DE PRECIOS

### 4.1 Precios Fundador (Pre-Lanzamiento — HOY)

| Plan | Billing | Precio Regular | **Precio Fundador** | Descuento |
|:---|:---|:---|:---|:---|
| **Atleta Pro** | Mensual | $9.99/mes | **$3.99/mes** | 60% OFF |
| **Atleta Legend** | Anual | $47.88/año | **$12.90/año** ($1.07/mes) | 73% OFF |
| **Coach Professional** | Mensual | — | **$12.99/mes** | — |
| **Coach Global Elite** | Anual | $155.88/año | **$99.90/año** ($8.33/mes) | 35% OFF |

### 4.2 Propuesta de Valor por Plan

**Atleta (Pro/Legend):**
- CaliBot IA — Coach personal 24/7
- Análisis de tendencia DEMA
- Fotos de progreso por fecha
- Milestones inteligentes
- Recordatorios proactivos
- Alertas de desvío
- Legend: Soporte prioritario + acceso vitalicio al precio

**Coach (Professional/Global Elite):**
- Dashboard profesional unificado
- Alertas inteligentes por atleta
- CaliBot auditorías automáticas
- Gestión de fotos de progreso
- Milestones y recordatorios por cliente
- Historial y exportación de datos
- **Clientes ilimitados**
- Soporte prioritario

### 4.3 Nota para Atletas de Coaches

> *"Tus clientes necesitan su cuenta de atleta ($3.99/mes o $12.90/año)"*

El coach paga por su dashboard; cada atleta paga su propia suscripción individual. Esto permite que el coach no asuma el costo de sus atletas, y cada atleta tiene skin in the game.

---

## 5. ANÁLISIS FINANCIERO

### 5.1 Costos de IA (Gemini 2.5 Flash-Lite)

Usaremos **Gemini 2.5 Flash-Lite** como motor de CaliBot por su relación costo/rendimiento:

| Concepto | Precio |
|:---|:---|
| Input Tokens | $0.10 / 1M tokens |
| Output Tokens | $0.40 / 1M tokens |
| Con Batch API (50% OFF) | $0.05 input / $0.20 output |

#### Estimación de Uso por Usuario por Mes:

| Tipo de Interacción | Frecuencia | Input Tokens | Output Tokens |
|:---|:---|:---|:---|
| Check-in diario de peso (CaliBot analiza) | 25 días/mes | 500 × 25 = 12,500 | 300 × 25 = 7,500 |
| Consulta de progreso semanal | 4/mes | 800 × 4 = 3,200 | 600 × 4 = 2,400 |
| Pregunta libre al CaliBot | 8/mes | 600 × 8 = 4,800 | 400 × 8 = 3,200 |
| Análisis de foto de comida | 4/mes | 2,000 × 4 = 8,000 | 500 × 4 = 2,000 |
| **TOTAL por usuario/mes** | — | **28,500** | **15,100** |

#### Costo por Usuario por Mes:

| Concepto | Cálculo | Costo |
|:---|:---|:---|
| Input | 28,500 / 1,000,000 × $0.10 | $0.00285 |
| Output | 15,100 / 1,000,000 × $0.40 | $0.00604 |
| **Total (precio normal)** | — | **$0.0089 / usuario / mes** |
| **Total (Batch API)** | — | **$0.0044 / usuario / mes** |

> [!TIP]
> **El costo de IA por usuario es prácticamente despreciable:** menos de 1 centavo por usuario por mes. Incluso con 100,000 usuarios activos, el costo mensual de IA sería ~$890 (normal) o ~$440 (batch).

### 5.2 Costos de Stripe (Procesamiento de Pagos)

| Escenario | Fee | Cálculo sobre $3.99 | Cálculo sobre $12.99 |
|:---|:---|:---|:---|
| **Doméstico (US)** | 2.9% + $0.30 | $0.42 (10.5%) | $0.68 (5.2%) |
| **Internacional** | 3.9% + $0.30 | $0.46 (11.5%) | $0.81 (6.2%) |
| **Internacional + Conversión** | 5.4% + $0.30 | $0.52 (13%) | $1.00 (7.7%) |

> [!WARNING]
> En el plan Atleta mensual ($3.99), Stripe se come entre el **10-13%** del revenue. Para el plan anual ($12.90), baja a ~4%. **Empujar el plan anual es crítico financieramente.**

### 5.3 Proyección de Usuarios (12 Meses)

| Mes | Coaches Nuevos | Total Coaches | Atletas / Coach (prom.) | Total Atletas | Revenue Coaches (mensual) | Revenue Atletas (mensual) | **Revenue Total** |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 10 | 10 | 3 | 30 | $130 | $120 | **$250** |
| 2 | 15 | 25 | 5 | 125 | $325 | $499 | **$824** |
| 3 | 25 | 50 | 7 | 350 | $650 | $1,397 | **$2,047** |
| 4 | 35 | 85 | 8 | 680 | $1,105 | $2,713 | **$3,818** |
| 5 | 50 | 135 | 10 | 1,350 | $1,755 | $5,387 | **$7,142** |
| 6 | 70 | 205 | 12 | 2,460 | $2,665 | $9,815 | **$12,480** |
| 7 | 80 | 285 | 13 | 3,705 | $3,705 | $14,781 | **$18,486** |
| 8 | 100 | 385 | 14 | 5,390 | $5,005 | $21,505 | **$26,510** |
| 9 | 120 | 505 | 15 | 7,575 | $6,565 | $30,224 | **$36,789** |
| 10 | 140 | 645 | 15 | 9,675 | $8,385 | $38,604 | **$46,989** |
| 11 | 160 | 805 | 16 | 12,880 | $10,465 | $51,382 | **$61,847** |
| 12 | 180 | 985 | 16 | 15,760 | $12,805 | $62,882 | **$75,687** |

*Supuestos: 70% atletas en plan mensual ($3.99), 30% en plan anual ($1.07/mes). Revenue de atleta promedio = $3.99 × 0.7 + $1.07 × 0.3 = $3.11/atleta/mes. Revenu de coach promedio = $12.99/mes.*

### 5.4 Análisis de Rentabilidad (Mes 12)

| Concepto | Monto Mensual |
|:---|:---|
| **Revenue Total** | $75,687 |
| (-) Stripe fees (~7% promedio) | -$5,298 |
| (-) Costo IA (16,745 usuarios × $0.009) | -$151 |
| (-) Hosting (Supabase Pro + Vercel Pro) | -$85 |
| (-) Marketing / Influencers | -$3,000 |
| (-) Herramientas (email, analytics, etc.) | -$200 |
| **= Margen Bruto** | **$66,953** |
| **Margen %** | **88.5%** |

> [!IMPORTANT]
> **El negocio es altamente rentable porque:** (1) El costo de IA por usuario es < 1 centavo, (2) No hay costos de infraestructura por atleta (Supabase escala con PostgreSQL), (3) El producto es digital puro — no hay COGS físico.

### 5.5 Break-Even

| Costos Fijos Mensuales | Monto |
|:---|:---|
| Hosting + Herramientas | $285 |
| Marketing base | $500 |
| **Total fijos** | **$785** |

Con revenue neto promedio de $2.89/atleta y $12.08/coach (post-Stripe):
- **Break-even:** ~100 atletas + 20 coaches = **Mes 2-3**

---

## 6. ESTRATEGIA DE MARKETING

### 6.1 Distribución de Contenido por Público

| Público | % del Contenido | Tipos de Post |
|:---|:---|:---|
| **Atletas (Pain Points)** | 35% | "¿Subiste peso y entraste en pánico?", "Por qué tu peso sube y baja sin sentido" |
| **Coaches (Authority)** | 25% | Dashboard demos, caso de estudio de datos, "cómo tu coach ve tu progreso" |
| **CaliBot / Producto** | 20% | WhatsApp demos, mockups de interfaz, carousels de funciones |
| **Social Proof / FOMO** | 10% | Testimonios simulados, contadores de waitlist, countdown |
| **Educativo (DEMA/Ciencia)** | 10% | "Qué es el DEMA y por qué importa", "tu peso no es tu grasa" |

### 6.2 Pilares de Contenido

1. **🎯 Pain → Solution** — Mostrar el dolor del atleta sin datos → solución Kcaliper
2. **📊 Ciencia Accesible** — Explicar DEMA, fluctuaciones, retención de agua sin jerga
3. **🤖 CaliBot en Acción** — Demos de WhatsApp con conversaciones realistas
4. **👨‍💻 Coach Authority** — El coach como héroe empoderado por tecnología
5. **🏆 Milestones y Celebración** — Contenido aspiracional basado en logros reales
6. **📱 Mockups de Producto** — iPhone/MacBook con la interfaz real, ambientados

### 6.3 Formatos por Plataforma

| Plataforma | Formatos Primarios | Frecuencia |
|:---|:---|:---|
| **Instagram Feed** | Carousels (6-10 slides), imágenes únicas con copy | 5-7/semana |
| **Instagram Reels** | 15-30s punchy, text-on-screen, trend audio | 3-5/semana |
| **Instagram Stories** | Encuestas, countdown, behind-the-scenes | Diario |
| **TikTok** | Repurposed Reels + TikTok-native trends | 3-5/semana |
| **YouTube (futuro)** | VSL largo para coaches, tutoriales | 1-2/mes |

### 6.4 Calendario Semanal Tipo

| Día | Tipo de Contenido | Ejemplo |
|:---|:---|:---|
| **Lunes** | Pain Point (Reel) | "Subiste 0.5kg después del fin de semana. ¿Grasa? NO. Aquí la ciencia..." |
| **Martes** | Feature Carousel | "6 cosas que tu coach ve en tu dashboard que tú no" |
| **Miércoles** | CaliBot Demo (Reel) | Conversación animada de WhatsApp con CaliBot explicando una fluctuación |
| **Jueves** | Educativo (Carousel) | "DEMA vs tu báscula: por qué el número de hoy NO importa" |
| **Viernes** | Coach Authority (Post) | Mockup del dashboard + "Así es como tu coach sabe que vas bien sin preguntarte" |
| **Sábado** | Social Proof | "#YoConKcaliper — 847 coaches ya están en lista de espera" |
| **Domingo** | CTA / FOMO | "Solo quedan 53 spots de fundador. Bloquea tu precio para siempre." |

---

## 7. PROGRAMA DE INFLUENCERS

### 7.1 Perfil del Influencer Ideal

| Criterio | Valor |
|:---|:---|
| **Nicho** | Fitness coach, nutricionista, entrenador personal |
| **Audiencia** | 5K - 100K seguidores hispanos |
| **Ubicación** | México, Colombia, España, Argentina, Perú, Ecuador |
| **Engagement** | > 3% engagement rate |
| **Idioma** | Español nativo |
| **Requisito** | Que actualmente trabaje con clientes (no solo influencer de lifestyle) |

### 7.2 Modelo de Compensación: Fee por Mil Reproducciones (CPM)

| Tier de Influencer | Seguidores | CPM (por 1,000 views) | Budget Mensual Estimado |
|:---|:---|:---|:---|
| **Nano** | 1K - 10K | $2 - $5 | $50 - $200 |
| **Micro** | 10K - 50K | $5 - $15 | $150 - $500 |
| **Mid** | 50K - 100K | $15 - $30 | $500 - $1,500 |
| **Macro** | 100K - 500K | $30 - $60 | $1,000 - $3,000 |

### 7.3 Estructura del Deal

1. **Influencer crea contenido** (Reel/TikTok) mostrando el dashboard o hablando del dolor + solución
2. **Link en bio** → `kcaliper.ai/early-access?ref=NOMBRE`
3. **Tracking** → UTM + ref parameter para medir conversiones
4. **Pago** → CPM basado en views reales del contenido (medido a los 7 días post-publicación)
5. **Bonus** → $1 por cada registro de waitlist con su código

### 7.4 Script Sugerido para Influencer (30s Reel)

> *"Si eres coach y estás CANSADO de perseguir a tus atletas para que te envíen su peso...*
> *Kcaliper hace eso por ti. Tu atleta registra su peso, y el sistema te AVISA si algo se sale del plan.*
> *Sin Excel. Sin WhatsApp infinitos. Solo datos limpios.*
> *Link en mi bio → los primeros 200 coaches tienen 35% OFF de por vida."*

### 7.5 Proyección de Inversión en Influencers

| Mes | # Influencers | Budget | Views Estimados | Registros Estimados (2% conv.) |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 3 nano | $300 | 60,000 | 120 |
| 2 | 5 nano + 2 micro | $800 | 180,000 | 360 |
| 3 | 5 micro + 1 mid | $1,500 | 350,000 | 700 |
| 4 | 3 micro + 2 mid | $2,500 | 500,000 | 1,000 |
| 5 | 2 mid + 1 macro | $3,500 | 800,000 | 1,600 |
| 6 | 3 mid + 1 macro | $5,000 | 1,200,000 | 2,400 |

### 7.6 ROI de Influencers

**Mes 6 ejemplo:**
- Inversión: $5,000
- Registros waitlist: 2,400
- Conversión waitlist → pago (15%): 360
- Revenue generado (360 × $3.99 avg): $1,436/mes recurrente (ongoing)
- **Payback period: 3.5 meses** (revenue recurrente paga la inversión)
- **LTV (12 meses @ 70% retención):** $1,436 × 12 × 0.7 = **$12,062** de un solo batch de $5K

---

## 8. CALENDARIO DE CONTENIDO

*(Ver sección 6.4 para el calendario semanal tipo)*

### 8.1 Contenido de Mockups

Se generan con IA para el feed de Instagram:

| Tipo | Descripción | Frecuencia |
|:---|:---|:---|
| **iPhone Flat-lay** | iPhone con la app sobre mármol/madera/gym | 2/semana |
| **MacBook Studio** | Dashboard de coach en laptop, escritorio profesional | 1/semana |
| **WhatsApp Screenshot** | Conversación CaliBot simulada en pantalla de iPhone | 2/semana |
| **Modelo + App** | Modelo IA usando la app en contexto (gym, cocina, etc.) | 2/semana |
| **CaliBot Mascota** | La mascota en distintas poses/escenas | 1/semana |
| **Data Visualization** | Gráficas DEMA estilizadas como post educativo | 1/semana |

---

## 9. CALIBOT — MASCOTA DE MARCA

### 9.1 Concepto Actual

CaliBot ya existe como mascota oficial. Es un **robot amigable** con estética limpia, colores de marca (violeta + cyan), y expresión cálida.

**Archivo actual:** `src/assets/calibot-mascot.png`

### 9.2 Uso de CaliBot en Comunicación

| Contexto | Rol de CaliBot |
|:---|:---|
| **Landing Page** | Sección dedicada "Conoce a CaliBot" con floating animation |
| **WhatsApp Demo** | Avatar del chat bot en las simulaciones de conversación |
| **Posts de IG** | Personaje recurrente en carousels educativos |
| **Notificaciones** | Icono del bot en alertas push (futuro) |
| **Onboarding** | Guía al usuario en el wizard de registro |

### 9.3 Personalidad de CaliBot

- **Nombre:** CaliBot (de "Calorías + Bot" / "Calibrar + Bot")
- **Personalidad:** Inteligente pero accesible. Usa emojis pero no es payaso. Es el "amigo que sabe de nutrición y no te juzga."
- **Frases signature:**
  - "Tranquila — eso es retención de agua normal. 📊"
  - "Tu tendencia REAL sigue en -0.28/semana. ¡Increíble!"
  - "Para eso estoy 🤖✨ ¡Sigue así!"
  - "¿Te recuerdo mañana a las 8am?"

---

## 10. VSL SCRIPT PARA COACHES

> **Propósito:** Video de 3-5 minutos que se muestra cuando un coach se registra y entra al dashboard por primera vez. Objetivo: convencerlo de que active su cuenta y empiece a vincular atletas.

---

### VSL: "Por qué tus atletas te necesitan en Kcaliper"

**[PANTALLA 1 — 0:00-0:15] HOOK**

*"Si estás aquí, es porque eres de los coaches que quiere dar un servicio diferente. No uno más.*

*Pero déjame preguntarte algo:*

*¿Cuántos de tus atletas te envían su peso cada día... sin que les tengas que recordar?"*

---

**[PANTALLA 2 — 0:15-0:45] PROBLEMA**

*"La verdad es esta: la mayoría de tus clientes abandona antes de ver resultados. No porque tu plan no funcione — funciona. Sino porque a las 3 semanas suben 0.4kg, entran en pánico, y cambian todo.*

*Y tú... estás ocupado. Tienes 15, 20, 30 clientes. No puedes mandarle un mensaje de tranquilidad a cada uno cuando su báscula sube una mañana.*

*Eso se llama la **brecha de los 29 días.** Y es donde se pierde el 40% de tus clientes."*

---

**[PANTALLA 3 — 0:45-1:30] SOLUCIÓN KCALIPER**

*"Kcaliper cierra esa brecha. Mira:*

*(MOSTRAR DASHBOARD)*

*Aquí ves a todos tus atletas. Su peso actual, su tendencia real con DEMA — no el número de hoy, sino la dirección REAL — y su ritmo semanal.*

*¿Ves este ícono? 💡 Valentina alcanzó un nuevo peso mínimo. El sistema ya lo detectó. Tú solo abres la alerta, le mandas un '¡increíble, sigue así!' y ella siente que la estás observando las 24 horas.*

*Pero no lo estás haciendo. El sistema lo hace por ti.*

*Y mira esto: Diego se está desviando de su meta. -0.8 kg esta semana cuando el objetivo era -0.5. Algo no va bien. Kcaliper ya te lo dijo antes de que Diego se frustrara o se lesionara."*

---

**[PANTALLA 4 — 1:30-2:00] DIFERENCIACIÓN**

*"¿Por qué no usar MyFitnessPal o Trainerize? Porque ellos te cobran POR atleta. A 20 clientes ya estás pagando $100+/mes.*

*Aquí pagas $12.99. Punto. Todos los atletas que quieras.*

*Y lo más importante: esta no es una app genérica de calorías. Es un sistema ESPECÍFICO para que tú, como coach, veas lo que importa sin perderte en datos irrelevantes."*

---

**[PANTALLA 5 — 2:00-2:30] SOCIAL PROOF**

*"847 coaches en Hispanoamérica ya están en lista de espera. Los primeros 200 que activen su cuenta tienen precio de fundador congelado para siempre.*

*No es un trial de 14 días. Es un precio que nunca va a subir, mientras tu suscripción esté activa."*

---

**[PANTALLA 6 — 2:30-3:00] CTA**

*"Activa tu cuenta. Agrega a tu primer atleta. En 5 minutos vas a entender por qué esto cambia todo.*

*Kcaliper. El sistema nervioso central del entrenador moderno. 🧠"*

---

## 11. ROADMAP PRE-LANZAMIENTO

### Fase 1: Foundation (Semana 1-2) ← **ESTAMOS AQUÍ**
- [x] Landing page atleta con email capture + waitlist
- [x] Landing page coach
- [x] Early Access page con pricing + Stripe checkout
- [x] Dashboard funcional (demo mode con mock data)
- [x] Login multi-cuenta para demos
- [x] Onboarding wizard
- [ ] Deploy estable en Vercel (bloqueado por CLI, migrar a GitHub deploy)
- [ ] Conectar dominio `kcaliper.ai`

### Fase 2: Content Engine (Semana 3-4)
- [ ] Producir batch de 30 posts para Instagram (10 carousels, 10 reels, 10 stories)
- [ ] Generar modelos IA consistentes para todo el contenido
- [ ] Crear cuenta Instagram @kcaliper.ai
- [ ] Publicar primeros 7 posts
- [ ] Contactar primeros 3 nano-influencers
- [ ] Setear tracking UTM para waitlist

### Fase 3: Validation (Semana 5-8)
- [ ] 500 emails en waitlist
- [ ] 10 coaches registrados (paid)
- [ ] 50 atletas activos
- [ ] Feedback loop: qué funciones piden más
- [ ] Iterar dashboard según feedback real

### Fase 4: CaliBot MVP (Semana 9-12)
- [ ] WhatsApp Business API integration
- [ ] CaliBot básico: check-in de peso por WhatsApp
- [ ] Prompt engineering para tono del coach
- [ ] Beta cerrado con 5 coaches

### Fase 5: Scale (Mes 4+)
- [ ] 1,000 atletas activos
- [ ] 100 coaches activos
- [ ] CaliBot con análisis de fotos de comida
- [ ] App móvil nativa (React Native)

---

## 12. PLAYBOOK OPERATIVO

### 12.1 Stack Tecnológico

| Capa | Tecnología |
|:---|:---|
| **Frontend** | React + TypeScript + Vite |
| **Estilos** | Tailwind CSS + Custom CSS (glassmorphism, gradients) |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Charts** | Recharts |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| **IA** | Google Gemini 2.5 Flash-Lite (API) |
| **Deploy** | Vercel (pending GitHub integration) |
| **Pagos** | Stripe Checkout |
| **Email** | Supabase (directo a tabla de waitlist) |
| **WhatsApp** | [PENDING] WhatsApp Business API via 360dialog or Twilio |

### 12.2 Credenciales de Demo

| Perfil | Email | Password | Datos |
|:---|:---|:---|:---|
| Admin (Dr. Carlos) | `argo@kcaliper.ai` | `kcaliperadmin` | Datos originales con múltiples clientes |
| Coach Esteban Alban | `esteban@kcaliper.ai` | `esteban2026` | 6 clientes con datos hasta abril 2026 |

### 12.3 Contingencias

| Riesgo | Probabilidad | Mitigación |
|:---|:---|:---|
| Vercel deploy falla | ALTA (actual) | Migrar a GitHub Actions + Vercel Git integration |
| Stripe rechaza por "pre-venta" | MEDIA | Asegurar que el producto tiene funcionalidad demostrable antes de cobrar |
| WhatsApp API delays | MEDIA | Lanzar primero con webapp-only; WA como upgrade |
| Coach no entiende el dashboard | MEDIA | VSL + onboarding wizard con video + tooltips |
| Competidor copia el modelo flat-fee | BAJA | "Won't" strategy — sus unit economics no lo permiten |

---

> [!NOTE]
> **Este documento es la fuente única de verdad (SSOT) para Kcaliper.ai.** Cualquier decisión de contenido, pricing, feature, o comunicación debe ser verificada contra este KB. Actualizar con cada cambio significativo.

---

*Documento generado por el equipo fundador ARGO. Fecha de última actualización: 8 de Abril, 2026.*
