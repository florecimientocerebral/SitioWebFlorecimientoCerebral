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
