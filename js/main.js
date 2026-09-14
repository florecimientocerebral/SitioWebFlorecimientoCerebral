/**
 * FLORECIMIENTO CEREBRAL SIGLO XXI - MAIN LOGIC
 * Includes: Neural Particle Canvas, 3D Tilt, Cognitive Duel, Video Controls, Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initNavbar();
  init3DTilt();
  initCognitiveDuel();
  initVideoAuditorium();
  initScrollReveal();
  initContactForm();
  initBuyModal();
});

/* ==========================================================================
   1. NEURAL PARTICLE NETWORK CANVAS
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 65;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(255, 45, 117, ' : 'rgba(0, 229, 255, ';
      this.baseAlpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVBAR & SMOOTH SCROLLING
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('mobile-open'));
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   3. PROMINENT 3D BOOK & EDITORIAL CARDS PARALLAX
   ========================================================================== */
/**
 * Attaches the parallax/tilt behaviour to one book stage.
 * Used by both the hero cluster and the book section, so the two read as
 * the same object rendered twice.
 */
function attachBookTilt(opts) {
  const stage = opts.stage;
  const card = opts.card;
  if (!stage || !card) return;

  const glare = opts.glare || null;
  const cover = card.querySelector('.book-cover');
  const drifters = opts.drifters ? Array.from(stage.querySelectorAll(opts.drifters)) : [];

  const restX = opts.restX !== undefined ? opts.restX : 6;
  const restY = opts.restY !== undefined ? opts.restY : -16;
  const maxX = opts.maxX !== undefined ? opts.maxX : 22;
  const maxY = opts.maxY !== undefined ? opts.maxY : 32;
  const lift = opts.lift !== undefined ? opts.lift : 50;
  const warmShadow = !!opts.warmShadow;

  let mouseX = 0, mouseY = 0;
  let currentRotX = restX, currentRotY = restY;
  let targetRotX = restX, targetRotY = restY;
  let isHovered = false;

  stage.addEventListener('mousemove', (e) => {
    isHovered = true;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    targetRotX = -(y / (rect.height / 2)) * maxX;
    targetRotY = (x / (rect.width / 2)) * maxY;

    mouseX = x;
    mouseY = y;
  });

  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotX = restX;
    targetRotY = restY;
    mouseX = 0;
    mouseY = 0;
  });

  function render3D() {
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;

    card.style.transform =
      'rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) ' +
      'translateZ(' + lift + 'px) scale(' + (isHovered ? 1.05 : 1) + ')';

    if (cover) {
      const shadowX = (-currentRotY * 2.2).toFixed(1);
      const shadowY = (currentRotX * 2 + 28).toFixed(1);
      cover.style.boxShadow = warmShadow
        ? shadowX + 'px ' + shadowY + 'px 70px rgba(60, 20, 28, 0.28)'
        : shadowX + 'px ' + shadowY + 'px 65px rgba(0, 0, 0, 0.82), 0 0 50px rgba(255, 60, 90, 0.3)';
    }

    if (glare) {
      const glareAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 180;
      const glareOpacity = isHovered ? 0.38 : 0.18;
      glare.style.background =
        'linear-gradient(' + glareAngle + 'deg, rgba(255, 255, 255, ' + glareOpacity + ') 0%, transparent 60%)';
    }

    // Petals and emblem drift against the book, each at its own depth.
    drifters.forEach((el, idx) => {
      const depth = 0.03 + (idx % 4) * 0.018;
      const dir = idx % 2 === 0 ? -1 : 1;
      el.style.setProperty('--px', (dir * mouseX * depth).toFixed(1) + 'px');
      el.style.setProperty('--py', (dir * mouseY * depth).toFixed(1) + 'px');
    });

    requestAnimationFrame(render3D);
  }

  render3D();
}

function init3DTilt() {
  // Hero: the book over the blooming floral backdrop.
  attachBookTilt({
    stage: document.getElementById('cards-cluster'),
    card: document.getElementById('main-book-3d'),
    glare: document.getElementById('book-glare'),
    drifters: '.bloom-petal, .bloom-emblem'
  });

  // Book section: the same object, calmer angles on the light ground.
  attachBookTilt({
    stage: document.getElementById('book-tilt-stage'),
    card: document.getElementById('book-3d-libro'),
    glare: document.getElementById('book-glare-libro'),
    restX: 3,
    restY: -11,
    maxX: 15,
    maxY: 24,
    lift: 30,
    warmShadow: true
  });

  // Gentle scroll drift on the hero bloom.
  const petals = Array.from(document.querySelectorAll('.bloom-petal'));
  if (petals.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 900) return;
      petals.forEach((el, idx) => {
        el.style.setProperty('--sy', (scrollY * (idx % 2 === 0 ? 0.07 : -0.05)).toFixed(1) + 'px');
      });
    }, { passive: true });
  }
}

/* ==========================================================================
   4. COGNITIVE DUEL ARENA (docSERsol vs Dr. Neuro Tóxix)
   ========================================================================== */
function initCognitiveDuel() {
  const buttons = document.querySelectorAll('.arena-btn');
  if (!buttons.length) return;
  const quoteText = document.getElementById('arena-quote-text');
  const quoteSpeaker = document.getElementById('arena-speaker');

  const quotes = {
    docser: [
      {
        text: '“Estamos en el siglo del cerebro. Su estudio, desarrollo y sanación consciente son la base indispensable para un futuro prometedor y armónico de la humanidad.”',
        speaker: 'docSERsol — Médico Integrativo'
      },
      {
        text: '“La neuroplasticidad no es una teoría lejana: es la capacidad viva de regenerar tus redes neuronales cuando alineas ciencia, empatía y propósito.”',
        speaker: 'docSERsol — Creador del Taller Cerebro & Corazón & Vida'
      },
      {
        text: '“Cuando el subconsciente es comprendido y despojado de sus miedos primarios, el cerebro florece en una claridad indescriptible.”',
        speaker: 'docSERsol — El Laberinto del Subconsciente'
      }
    ],
    toxix: [
      {
        text: '“¡Poderoso cerebro! Nadie sabe que lo tiene hasta que lo descubre... ¡o hasta que una sobredosis de hedonismo y curiosidad lo enciende!”',
        speaker: 'Dr. Neuro Tóxix — Coautor & Viajero en el Tiempo'
      },
      {
        text: '“Mi pterodáctilo de Solnhofen de 150 millones de años me enseñó una cosa: ¡el instinto y la locura controlada son el combustible del universo!”',
        speaker: 'Dr. Neuro Tóxix — Creador de la PDNT'
      },
      {
        text: '“¿Razón o instinto? ¡Bah! ¡Mézclalos en un tubo de ensayo, ponle un poco de humor salvaje y observa cómo la mente rompe cualquier molde!”',
        speaker: 'Dr. Neuro Tóxix — Disertante Incorregible'
      }
    ]
  };

  let currentIndex = { docser: 0, toxix: 0 };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const side = btn.dataset.side;
      const list = quotes[side];
      currentIndex[side] = (currentIndex[side] + 1) % list.length;
      const current = list[currentIndex[side]];

      if (quoteText && quoteSpeaker) {
        quoteText.style.opacity = '0';
        quoteSpeaker.style.opacity = '0';

        setTimeout(() => {
          quoteText.textContent = current.text;
          quoteSpeaker.textContent = current.speaker;
          quoteSpeaker.style.color = side === 'docser' ? 'var(--color-cyan)' : 'var(--color-pink)';
          quoteText.style.opacity = '1';
          quoteSpeaker.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   5. VIDEO AUDITORIUM
   ========================================================================== */
function initVideoAuditorium() {
  const video = document.getElementById('project-video');
  if (!video) return;

  // Enhance video UX
  video.addEventListener('play', () => {
    video.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.55), 0 0 60px rgba(255, 140, 160, 0.25)';
  });

  video.addEventListener('pause', () => {
    video.style.boxShadow = 'none';
  });
}

/* ==========================================================================
   6. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. CONTACT & ORDER FORM (NETLIFY FORMS + MAILTO FALLBACK)
   ========================================================================== */
/* Where enquiries are delivered. Netlify Forms captures the submission and
   forwards it to this address; the mailto fallback keeps the message
   recoverable if the POST ever fails. */
var CONTACT_EMAIL = 'florecimientocerebral@gmail.com';

function initContactForm() {
  const form = document.getElementById('order-contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-text');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.innerHTML : '';

  function showToast(html, ms) {
    if (!toast || !toastMsg) return;
    toastMsg.innerHTML = html;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, ms || 5000);
  }

  function mailtoFor(data) {
    const subject = 'Solicitud web: ' + (data.get('interes') || 'Florecimiento Cerebral');
    const body =
      'Nombre: ' + (data.get('nombre') || '') + '\n' +
      'Correo: ' + (data.get('email') || '') + '\n' +
      'Interés: ' + (data.get('interes') || '') + '\n\n' +
      (data.get('mensaje') || '');
    return 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get('nombre') || '').toString().trim();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);

      showToast('¡Gracias' + (name ? ' ' + name : '') + '! Tu solicitud fue enviada. Te responderemos muy pronto.');
      form.reset();
    } catch (err) {
      // Delivery failed (offline, or previewing outside Netlify). Offer the
      // direct email so the enquiry is never simply lost.
      showToast(
        'No pudimos enviar tu solicitud. Escríbenos a ' +
        '<a href="' + mailtoFor(data) + '">' + CONTACT_EMAIL + '</a>',
        9000
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitLabel;
      }
    }
  });
}

/* ==========================================================================
   8. BUY BOOK MODAL (DISTRIBUTION SELECTOR)
   ========================================================================== */
function initBuyModal() {
  const modal = document.getElementById('buy-modal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.btn-open-buy-modal, [data-open-buy-modal]');
  const closeTriggers = modal.querySelectorAll('[data-close-modal]');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    
    // Accessibility: focus first retailer card
    setTimeout(() => {
      const firstLink = modal.querySelector('.retailer-card');
      if (firstLink) firstLink.focus();
    }, 60);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  closeTriggers.forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
}

