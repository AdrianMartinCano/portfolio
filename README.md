![Portfolio Logo](./logo.svg)

# Portfolio

Frontend interactivo que muestra proyectos, experiencia y formación, con interfaz de **terminal Linux**, soporte multiidioma (ES/EN) y datos servidos desde una API REST propia en Spring Boot.

🔗 **En vivo:** [www.codeadrianmc.dev](https://www.codeadrianmc.dev)

**Stack:** Angular 19 · TypeScript · Tailwind CSS 4 · Transloco · Signals · RxJS

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│  Angular (Vercel)   │  Frontend: tema terminal (oscuro/claro), comandos interactivos
│  Signals · Tailwind │  Idiomas ES/EN con Transloco · lazy loading + prefetch
└──────────┬──────────┘
           │ HTTPS
           ↓
┌─────────────────────────────────┐
│  Spring Boot API (Render)       │  GET  /api/proyectos?lang=es|en
│  - datos JSON en memoria        │  GET  /api/experiencia?lang=...
│  - email con Resend             │  GET  /api/formacion?lang=...
│  - rate limiting + honeypot     │  POST /api/contacto
└─────────────────────────────────┘
```

**Documentación de la API:** ver [`GUIA-API.md`](./GUIA-API.md). Backend en repositorio aparte ([portfolio-back](https://github.com/AdrianMartinCano/portfolio-back)).

---

## 🚀 Características

- **Interfaz de terminal:** comandos interactivos en la home (`help`, `snake`, `sudo hire`…).
- **Datos dinámicos:** proyectos/experiencia/formación cargados desde la API (no hardcodeados), con **fallback local** a los JSON de `public/i18n/` si la API no responde.
- **Carga fluida:** lazy loading de rutas con `PreloadAllModules`, **prefetch** de los datos al arrancar (calienta el backend de Render y cachea las respuestas) y **spinner estilo terminal** mientras la API responde.
- **Multiidioma:** español e inglés, cambio en tiempo real (Transloco).
- **Tema claro/oscuro:** toggle con persistencia en `localStorage`.
- **Formulario de contacto:** validación de email, honeypot anti-bots y correo de confirmación automático al visitante.
- **Responsive y accesible:** móvil/tablet/desktop, ARIA labels y navegación semántica.

---

## 📖 Proyectos que muestra

La API sirve 6 proyectos, cada uno con descripción, stack, características y caso de estudio:

1. **WoW Auction Analyzer** — Full Stack · análisis del mercado de subastas de WoW + bot de Discord
2. **Artesanos del Torno** — Full Stack · web oficial en producción con panel de administración
3. **Ecosistema de librerías compartidas** — Full Stack · suite reutilizable (Spring Boot + Angular)
4. **Portfolio** — Full Stack · esta misma web (Angular + Spring Boot)
5. **KeyCloud** — Full Stack · gestor de contraseñas (cliente Angular + API Spring Boot)
6. **Gas-Path** — Móvil · buscador de gasolineras por ubicación (proyecto de fin de grado)

---

## 🔐 Permisos chmod de los proyectos

La lista de proyectos imita un `ls -l`: cada proyecto lleva un permiso octal (campo `permisos` en los JSON de datos, tanto en `public/i18n/*.json` como en la API) con semántica propia:

| Permiso | Simbólico | Significado |
|---------|-----------|-------------|
| `755` | `drwxr-xr-x` | Proyecto público y desplegado (hay demo que visitar) |
| `750` | `drwxr-x---` | Proyecto profesional con parte privada |
| `700` | `drwx------` | Proyecto personal / laboratorio |
| `555` | `dr-xr-xr-x` | Solo lectura: terminado o sin mantenimiento |
| `777` | `drwxrwxrwx` | Experimental — "haz lo que quieras" (con humor; lo lleva este portfolio) |

- El campo es opcional; si un proyecto no lo trae, el frontend asume `755`.
- La notación simbólica se **calcula en el frontend** a partir del octal (no se guarda). En móvil solo se muestra el octal por espacio.
- Bajo la lista hay una leyenda `# chmod:` generada dinámicamente **solo con los códigos en uso** (textos en `proyectos.leyenda` de los JSON de idioma).

---

## 🛠️ Tecnologías

- **Framework:** Angular 19 (standalone components, control flow `@if`/`@for`)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **i18n:** Transloco (ES/EN)
- **Estado:** Signals + reactive forms
- **HTTP/reactividad:** RxJS + `toSignal`
- **Deploy:** Vercel

---

## 🎨 Diseño

Interfaz minimalista inspirada en una terminal Linux, con paleta tipo **GitHub dark/light**:

- **Fondo:** `#0d1117` (oscuro) / `#ffffff` (claro)
- **Acentos:** verde `#3fb950`, azul `#58a6ff`, ámbar `#d29922`, rojo `#f85149`
- **Tipografía:** monoespaciada (**Space Mono**)
- **Interactividad:** comandos en la home, prompt `adrian@portfolio:~$`, cursor parpadeante

Los colores son CSS custom properties (`--term-*` en `src/styles.css`) expuestas como utilidades de Tailwind, lo que permite el cambio de tema instantáneo.

---

## 🔌 Conexión con la API

| Endpoint | Uso |
|---|---|
| `GET /api/proyectos?lang=es` | Lista de proyectos |
| `GET /api/experiencia?lang=es` | Experiencia profesional |
| `GET /api/formacion?lang=es` | Formación académica |
| `POST /api/contacto` | Envío del formulario de contacto |

- **Fallback local:** si la API no responde (timeout/cold start), se usan los JSON de `public/i18n/` como datos estáticos.
- **Idioma:** se envía con `?lang=es|en`, sincronizado con el idioma activo.
- **`apiUrl`:** se define en `src/environments/` (dev → `http://localhost:8080`, prod → Render).

---

## 📁 Estructura

```
portfolio/
├── public/
│   ├── logo.svg
│   ├── i18n/                 # textos de UI + datos (fallback de la API)
│   │   ├── es.json
│   │   └── en.json
│   └── proyectos/            # imágenes de los proyectos
├── src/
│   ├── app/
│   │   ├── componentes/      # reutilizables (footer, snake, spinner-terminal)
│   │   ├── paginas/          # inicio, proyectos, detalles-proyecto, experiencia, formacion, contacto
│   │   ├── servicios/        # datos-api, proyectos, experiencia, formacion, cv, tema, idioma
│   │   ├── app.routes.ts     # rutas lazy
│   │   └── app.config.ts     # Transloco, HttpClient, router + preloading
│   ├── styles.css            # Tailwind + temas (custom properties)
│   └── environments/         # apiUrl dev/prod
├── angular.json
└── GUIA-API.md
```

> Las interfaces de datos (`Proyecto`, `Experiencia`, `Formacion`) viven junto a su servicio en `src/app/servicios/`, no en una carpeta `models` aparte.

---

## 🚀 Cómo ejecutar

```bash
npm install
npm start          # → http://localhost:4200
```

Para datos en vivo, el backend (Spring Boot) debe estar corriendo en `http://localhost:8080`. Sin él, la web funciona igual con el fallback de `public/i18n/`.

```bash
npm run build      # build de producción (dist/portfolio)
```

---

## 📝 Notas

- Los datos de proyectos viven en **dos sitios** que deben mantenerse sincronizados: `public/i18n/*.json` (fallback) y la API (`resources/datos/*.json` en el repo del back).
- El cambio de idioma es instantáneo gracias a Transloco; el tema, gracias a las CSS custom properties.
- La API está documentada en [`GUIA-API.md`](./GUIA-API.md).
