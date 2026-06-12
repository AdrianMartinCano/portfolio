# Plan de mejoras del portfolio

> Anotado el 11/06/2026. Plan completo para evolucionar el portfolio (no rehacerlo desde cero).
> Estado actual: Angular 19 + Tailwind 4, datos hardcodeados, desplegado en Vercel con dominio propio.

---

## 1. Contenido (máximo impacto, hacer primero)

- [x] **Casos de estudio en vez de listas.** Cada proyecto tiene `problema` y `aprendizajes`
  (qué resolvía / qué haría distinto hoy), mostrados en la vista de detalle. Contenido
  ESCRITO y fundamentado: se analizaron los repos reales de cada proyecto para redactarlos
  con precisión (tecnologías, características y decisiones tomadas del código). Ya no quedan
  borradores. Futuro opcional: diagrama de arquitectura simple por proyecto.
- [x] **6 proyectos finales** (ordenados por impacto): WoW Auction Analyzer (bandera:
  microservicios Spring Boot + Spring Batch + Blizzard OAuth2 + bot Discord, en producción),
  Artesanos del Torno (web en producción con PHP + Stripe), Ecosistema de librerías
  (Spring + Angular publicadas), Portfolio, KeyCloud y Gas-Path.
- [x] **Unificar proyectos multi-repo.** El modelo `repositorios` es una lista de
  `{etiqueta, url}`, así un proyecto puede tener varios repos. Aplicado a KeyCloud
  (front+back), las Librerías (Spring + Angular) y el propio Portfolio (Angular + API).
- [x] **El Portfolio es ahora Full Stack.** Pasó de tipo "Frontend" a "Full Stack" con dos
  repos (`portfolio` + `portfolio-back`) y stack ampliado (Java 21, Spring Boot 3, Docker,
  Render). La propia web es uno de los proyectos full-stack del portfolio. OJO: la URL del
  repo backend es la convención `github.com/AdrianMartinCano/portfolio-back` (aún sin remoto);
  ajustar en los 4 JSON cuando se suba a GitHub.
- [x] **Slug + imagen por proyecto.** `slug` estable → routing `/detalles/:slug` (legible y
  compartible, ya no por índice de array). `imagen` por proyecto en la vista de detalle.
  **PENDIENTE: crear las capturas** y ponerlas en
  `public/proyectos/{wow-analyzer,artesanos,librerias,portfolio,keycloud,gas-path}.png`.
- [x] **Versión en inglés (i18n ES/EN) con Transloco.** Toggle `es|en` en la barra de
  título + `LANG` clicable en la barra de estado (`es_ES.UTF-8` / `en_US.UTF-8`).
  Textos y datos (proyectos, experiencia, formación) en `public/i18n/es.json` y `en.json`.
  Persistido en localStorage. De paso: limpiado `proyectos.service.ts` (tenía el proyecto
  Portfolio duplicado ~30 veces) y arreglada la descarga del CV (la ruta `assets/` no existía).
- [ ] **CV descargable** en PDF, actualizado, enlazado desde el hero.

## 2. Visual — concepto: TERMINAL LINUX

Dirección elegida: llevar la estética actual (oscuro + Space Mono) a un tema de
terminal Linux completo. **Regla de oro: la terminal es el TEMA, no el modelo de
interacción** — navegación normal y clicable, pero vestida de terminal. Nada de
obligar a escribir comandos para navegar.

### Piezas del concepto

- [x] **Toda la app es UNA ventana de terminal:** barra de título con toggle de tema y
  botones de ventana, pestañas de navegación como tabs de terminal (+ `cv.pdf` descargable),
  footer como barra de estado. Hecho en `app.component.html`.
- [x] **Hero con typewriter:** `whoami` → nombre y rol, `ls ./` cuya salida son los links
  de navegación reales. Cursor de bloque parpadeante. Respeta `prefers-reduced-motion`.
- [x] **Botón de tema oscuro/claro** (perfiles de terminal estilo GitHub dark/light):
  variables CSS en `styles.css` + `TemaService` con signal y localStorage.
- [x] **Páginas convertidas al tema terminal:** cada una abre con su prompt
  (`ls proyectos/`, `cat experiencia.log`, `cat contacto.txt`, `cat <proyecto>.md`)
  y usa los tokens de color (`text-texto`, `text-apagado`, `text-verde`, `text-azul`).
- [ ] **Sección "sobre mí" estilo `neofetch`:** ASCII art o foto a un lado, pares
  clave-valor al otro (OS, Stack, Uptime: 3 años, Location: Madrid...).
- [ ] **Proyectos como salida de terminal:** cards con mini barra de ventana,
  contenido tipo `cat proyecto.md`. Con captura/GIF del proyecto dentro
  (https://shots.so para enmarcar capturas).
- [ ] **Página 404:** `bash: pagina: command not found`.
- [x] **Easter egg:** terminal interactiva en inicio con `help`, `snake` (juego
  completo, teclado + swipe) y `sudo hire adrian` (secuencia que lleva a contacto).
  Comando desconocido responde `bash: command not found`.

### Reglas para que funcione

1. **Typewriter una sola vez** al cargar y rápido (~1-2s). No repetir en cada
   navegación. Respetar `prefers-reduced-motion`.
2. **Cuerpo de texto legible:** monospace solo en prompts, titulares y decoración;
   descripciones largas con una sans legible (ej. Inter).
3. **Todo texto es DOM real** (nada de canvas) por SEO y accesibilidad.
4. **Un color de acento** (verde terminal) para links, hovers y palabras clave.
5. ~~Quitar el gradiente animado de fondo actual~~ Hecho (también se eliminaron el
   header y la barra lateral antiguos, y el bloqueo de zoom táctil, que era un
   problema de accesibilidad).

### Implementación (sin librerías, factible en un finde)

- Typewriter: directiva Angular pequeña con signals (o `typed.js` si se prefiere).
- Chrome de ventana + cursor parpadeante: CSS puro con Tailwind.
- Neofetch: grid de dos columnas.

### Lo que sigue aplicando del plan visual general

- [ ] **Hero con CTAs:** "Ver proyectos" y "Descargar CV" + GitHub/LinkedIn sin scroll.
- [ ] Microinteracciones: hover en cards, fade-in al scroll (IntersectionObserver).
- [ ] Referencia de calidad: https://brittanychiang.com (estructura y espaciados),
  https://godly.website (inspiración).
- [ ] **Open Graph meta tags** para que el enlace se vea bien al compartir en LinkedIn.
- [ ] Auditoría **Lighthouse** (objetivo >90 en todo) y contraste/accesibilidad.

## 3. API en Spring Boot (gratis) — el proyecto "full stack"

> **Guía completa paso a paso en [GUIA-API.md](GUIA-API.md)** (decisión final: SIN base de
> datos — los datos van embebidos en resources de la API; keep-alive con cron-job.org).

> **ESTADO (en curso):** backend `portfolio-back` ya scaffoldeado y corriendo en local.
> Hechos: estructura de paquetes bajo `com.adrianmartincano.portfolio`, DTOs
> (`ProyectoDTO`/`RepositorioDTO`/`ExperienciaDTO`/`FormacionDTO`/`Datos`), `DatosService`
> que carga `datos/es.json` y `datos/en.json` con Jackson, y `DatosController` sirviendo
> `GET /api/proyectos|experiencia|formacion?lang=es|en`. Los JSON del backend están
> sincronizados con los del front (mismos 6 proyectos). **PENDIENTE:** endpoint de contacto
> con Resend, CORS, Dockerfile, `server.port=${PORT:8080}`, subir a GitHub y desplegar en Render.

Objetivo: sacar los datos hardcodeados de `src/app/servicios/proyectos/proyectos.service.ts`
a una API real en Java, y que el formulario de contacto funcione.

### Hosting elegido

| Pieza | Servicio | Por qué |
|---|---|---|
| API | **Render** (plan Free) | Free permanente. Pega: se duerme tras 15 min sin tráfico, cold start ~30-60s |
| Email contacto | **Resend** (3.000 emails/mes gratis) | Alternativa: `spring-boot-starter-mail` + app password de Gmail |

> SIN base de datos: los datos viven en `src/main/resources/datos/*.json` y se cargan en
> memoria al arrancar. Si algún día hace falta persistir algo (contador de visitas, mensajes
> de contacto), se añade Postgres (Neon) entonces.

Truco cold start: ping cada 10 min desde https://cron-job.org mantiene la API despierta.
En el front, poner un loading/skeleton en la página de proyectos para cubrir el primer request.

### Pasos para crear la API (repo `portfolio-back`)

1. Generar proyecto en https://start.spring.io — Spring Boot 3.x, Java 21, Maven.
   Dependencias: `Spring Web`, `Validation`, `Spring Boot Actuator` (+ Lombok opcional).
   **NO** hace falta Spring Data JPA ni driver de BBDD. ✅ HECHO
2. DTOs + `DatosService` (Jackson lee los JSON de resources) + `DatosController`. ✅ HECHO
3. Endpoint `POST /api/contacto` con Resend (+ honeypot y validación, ver GUIA-API §7-8).
4. **CORS:** permitir solo el dominio propio y `http://localhost:4200`.
5. `server.port=${PORT:8080}` en `application.properties` (clave para Render).
6. **Dockerfile multi-stage** (build con Maven, runtime con JRE 21 slim).
7. Subir el repo a GitHub y desplegar en **Render**: New Web Service → Docker → Free →
   variable de entorno `RESEND_API_KEY`. Verificar `/actuator/health`.

### Conectar Angular (cambios en ESTE repo)

- [ ] Crear `src/environments/` con `apiUrl`: `http://localhost:8080` en dev,
  `https://<nombre>.onrender.com` en prod.
- [ ] Añadir `provideHttpClient()` en `app.config.ts`.
- [ ] Crear interfaz `Proyecto` (ahora no existe ningún tipado).
- [ ] Cambiar `ProyectosService` a `http.get<Proyecto[]>(...)`, con fallback a los datos
  locales si la API no responde.
- [ ] Formulario de contacto → `POST /api/contacto`.
- [ ] En Vercel no hay que tocar nada: Angular llama a la API por HTTPS.

## 4. Modernizar el código Angular

- [ ] Actualizar a **Angular 20** (`ng update`).
- [ ] Migrar a **signals**: `signal`, `computed`, `input()`.
- [ ] Nuevo control flow `@if`/`@for` en vez de `*ngIf`/`*ngFor`.
  Schematic automático: `ng generate @angular/core:control-flow`
- [ ] **Lazy loading** en `app.routes.ts`: `loadComponent: () => import(...)`
  en vez de imports directos.
- [ ] **Prerendering/SSR**: `ng add @angular/ssr` con prerender de rutas estáticas
  (mejora SEO y Lighthouse). Vercel soporta Angular SSR.

## 5. Señales de profesionalidad

- [ ] **GitHub Actions**: workflow de build + tests en cada push.
- [ ] **Tests reales** del servicio y de algún componente
  (los `.spec.ts` generados están vacíos: o se escriben o se borran, vacíos quedan peor).
- [ ] README decente en ambos repos (portfolio y API) con capturas y stack.

## Orden recomendado

1. **Contenido + inglés** (máximo impacto, cero riesgo)
2. **Visual** (tipografía, acento, hero, cards con imagen)
3. **Modernización Angular** (signals, control flow, lazy loading, prerender) — un fin de semana
4. **API Spring Boot + Render + Neon** — además se convierte en otra entrada del portfolio
5. CI + tests + Lighthouse
