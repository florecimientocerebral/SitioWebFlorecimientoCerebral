# Florecimiento Cerebral Siglo XXI — Landing Page Oficial

Sitio web oficial y landing page interactiva de **Florecimiento Cerebral Siglo XXI**, la obra del **Dr. Pedro Hernán Pérez Estrada (docSERsol)** y el coautor singular **Dr. Neuro Tóxix**.

Este proyecto está construido con estándares modernos de la web (HTML5 semántico, CSS3 con tokens personalizados y modo oscuro bioluminiscente, y Vanilla JavaScript reactivo). Está 100% optimizado para ser alojado en un repositorio de **GitHub** y desplegado en **Netlify** sin necesidad de pasos de compilación complejos.

---

## 🚀 Despliegue Rápido en Netlify y GitHub

### 1. Inicializar Repositorio Git
Abre tu terminal en esta carpeta y ejecuta:

```bash
git init
git add .
git commit -m "feat: landing page inicial Florecimiento Cerebral Siglo XXI"
```

### 2. Conectar con tu Repositorio de GitHub
Crea un nuevo repositorio en [GitHub](https://github.com/new) y enlázalo:

```bash
git remote add origin https://github.com/TU-USUARIO/florecimiento-cerebral.git
git branch -M main
git push -u origin main
```

### 3. Desplegar en Netlify
1. Ingresa a [Netlify](https://app.netlify.com/).
2. Haz clic en **"Add new site"** > **"Import an existing project"**.
3. Selecciona **GitHub** y escoge tu repositorio `florecimiento-cerebral`.
4. En las opciones de despliegue:
   - **Build command**: *(Dejar en blanco)*
   - **Publish directory**: `.` (o dejar el valor por defecto configurado en `netlify.toml`)
5. Haz clic en **Deploy site**. ¡Tu web estará en vivo con HTTPS automático en cuestión de segundos!

---

## 📁 Estructura del Proyecto

```
├── index.html                    # Estructura principal y SEO de la landing page
├── netlify.toml                  # Configuración de cabeceras y caché en Netlify
├── .gitignore                    # Reglas de exclusión para Git
├── README.md                     # Documentación de instalación y uso
├── css/
│   ├── style.css                 # Sistema de diseño, temas y componentes
│   └── animations.css            # Animaciones neuronales, keyframes y scroll reveal
├── js/
│   ├── main.js                   # Canvas de sinapsis, inclinación 3D, video y navegación
│   └── neurogame.js              # Mini-juego interactivo Neuro-Cuadri-Color (audio y puntuación)
└── assets/
    ├── img/                      # Logotipo, portada 3D, fotos del autor y neurojuegos
    └── vid/                      # FlorecimientoCerebralVideo.mp4 (video oficial)
```

---

## 🌟 Características Principales

- **Hero 3D Interactivo**: Portada con efecto de perspectiva física que reacciona al movimiento del ratón.
- **Canvas de Redes Neuronales**: Fondo interactivo de sinapsis que reacciona a la posición del cursor.
- **Duelo Cognitivo: Razón vs. Instinto**: Selector interactivo entre **docSERsol** (médico integrativo) y el excéntrico **Dr. Neuro Tóxix** (viajero en el tiempo con su pterodáctilo de Solnhofen).
- **El Libro & Portada 3D**: Presentación de las historietas *Neuronitas*, *El Laberinto del Subconsciente* y el sello de *Editorial ibukku*.
- **Sala Audiovisual**: Reproductor HTML5 optimizado para el video oficial `FlorecimientoCerebralVideo.mp4`.
- **Neuro-Desafío en el Navegador**: Mini-juego real inspirado en *Neuro-Cuadri-Color™* con síntesis de sonido Web Audio API, cronómetro de milisegundos, rachas y diagnóstico cerebral dinámico.
- **Fórmulas Magistrales**: Catálogo visual interactivo de *Juventud Cerebral*, *Insom-NO*, *Sin Dis3*, *Sin Cefalea*, esencias florales y retiros *ERES*.
- **Formulario & WhatsApp**: Enlace directo con mensaje preconfigurado para adquirir ejemplares o coordinar talleres en cualquier ciudad.

---

## 📬 Formulario de Contacto (Netlify Forms)

El formulario de la sección **Contacto** usa **Netlify Forms**. El envío se hace por
`fetch` (sin recargar la página) y muestra el toast de confirmación; si el envío
falla, se ofrece un enlace `mailto:` ya prellenado para que el mensaje no se pierda.

- Nombre del formulario: `contacto-florecimiento`
- Campos: `nombre`, `email`, `interes`, `mensaje`
- Anti-spam: honeypot `bot-field`

> El campo del correo se llama `email` a propósito: Netlify usa ese nombre para
> poner el **Reply-To** del aviso, así se puede responder al interesado
> directamente desde el correo de notificación.

### PASO 1 — Desplegar (obligatorio antes de todo lo demás)

**Netlify detecta los formularios al desplegar, leyendo el HTML publicado.**
Mientras no se despliegue el `index.html` con el formulario nuevo, la sección
**Forms** aparecerá vacía y no habrá nada que configurar.

Si el sitio está conectado a un repositorio:

```bash
git add .
git commit -m "feat: formulario de contacto con Netlify Forms"
git push
```

Si se despliega manualmente: **Deploys → Deploy manually** y arrastrar la carpeta
del proyecto completa.

Cuando termine el deploy, en **Forms** debe aparecer `contacto-florecimiento`.

### PASO 2 — Activar el correo de notificación

Netlify guarda los envíos, pero no los reenvía hasta configurar el aviso:

1. **Project configuration** (menú izquierdo)
2. **Notifications**
3. **Emails and webhooks**
4. En **Form submission notifications** → **Add notification** → **Email notification**
5. *Email to notify*: `florecimientocerebral@gmail.com`
6. *Form*: `contacto-florecimiento` → **Save**

Enlace directo:
`https://app.netlify.com/projects/florecimientocerebral/configuration/notifications#form-submission-notifications`

A partir de ahí cada solicitud llega a ese correo y queda archivada en
**Forms** dentro del panel de Netlify.

> **Nota:** el formulario solo funciona en el sitio desplegado en Netlify. En
> local (`node serve.js`) el envío no se registra; el formulario mostrará el
> mensaje de respaldo con el enlace de correo directo.

### Cambiar el correo de destino

- Correo de las notificaciones: se cambia en el panel de Netlify (paso 5).
- Correo del enlace de respaldo: constante `CONTACT_EMAIL` en `js/main.js`.

---

## 💬 Enlace de WhatsApp

El botón *Contactar por WhatsApp Directo* apunta a `https://wa.me/docSERsol`.

> **Importante:** `wa.me` normalmente requiere el **número de teléfono en formato
> internacional sin signos** (por ejemplo `https://wa.me/573001234567`). Si el
> usuario `@docSERsol` no está reclamado como nombre de usuario de WhatsApp, hay
> que reemplazar `docSERsol` por el número en `index.html`.
