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
   3. 3D BOOK TILT EFFECT
   ========================================================================== */
function init3DTilt() {
  const card = document.querySelector('.book-card-3d');
  if (!card) return;

  const wrapper = card.parentElement;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 22;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = `rotateY(-18deg) rotateX(8deg) scale(1)`;
  });
}

/* ==========================================================================
   4. COGNITIVE DUEL ARENA (docSERsol vs Dr. Neuro Tóxix)
   ========================================================================== */
function initCognitiveDuel() {
  const buttons = document.querySelectorAll('.arena-btn');
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
    video.style.boxShadow = '0 0 50px rgba(0, 229, 255, 0.4)';
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
   7. CONTACT & ORDER FORM (WHATSAPP + DIRECT CONFIRMATION)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('order-contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-text');

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const interest = document.getElementById('form-interest').value;
      const notes = document.getElementById('form-notes').value.trim();

      // Build WhatsApp message URL
      const textMessage = `¡Hola Dr. Pedro (docSERsol)! Mi nombre es ${encodeURIComponent(name)}. Me interesa: ${encodeURIComponent(interest)}. Correo: ${encodeURIComponent(email)}. Comentario: ${encodeURIComponent(notes)}`;
      const whatsappUrl = `https://wa.me/573000000000?text=${textMessage}`;

      showToast(`¡Gracias ${name}! Tu solicitud ha sido preparada. Redirigiendo...`);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        form.reset();
      }, 1000);
    });
  }
}
