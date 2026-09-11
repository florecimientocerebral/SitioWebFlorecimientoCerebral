/**
 * FLORECIMIENTO CEREBRAL SIGLO XXI - BLOG ENGINE
 * Dynamic post listing, filtering, markdown reader & sharing
 */

(function () {
  'use strict';

  // State
  let allPosts = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Minimalist robust markdown parser
  function renderMarkdown(md) {
    if (!md) return '';
    let html = md;

    // Normalize newlines
    html = html.replace(/\r\n/g, '\n');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');

    // Bold & Italics
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Lists (unordered)
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>(\n|(?=<li>)))/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<blockquote') || block.startsWith('<ul') || block.startsWith('<hr')) {
        return block;
      }
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
  }

  function formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return isoStr;
    }
  }

  // Toast notification
  function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) {
      toastText.textContent = msg;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3200);
    } else {
      alert(msg);
    }
  }

  // --- BLOG LIST VIEW (blog.html) ---
  function initBlogListing() {
    const grid = document.getElementById('blog-posts-grid');
    const searchInput = document.getElementById('blog-search-input');
    const chips = document.querySelectorAll('.category-chip');

    if (!grid) return;

    fetch('content/blog/index.json?v=' + Date.now())
      .then(res => res.json())
      .then(posts => {
        allPosts = posts;
        renderFilteredPosts();
      })
      .catch(err => {
        console.error('Error cargando artículos del blog:', err);
        grid.innerHTML = `
          <div class="blog-empty-state">
            <p>No fue posible cargar las publicaciones en este momento.</p>
          </div>
        `;
      });

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderFilteredPosts();
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.dataset.category || 'all';
        renderFilteredPosts();
      });
    });

    function renderFilteredPosts() {
      const filtered = allPosts.filter(post => {
        const matchesCategory = (currentCategory === 'all') || (post.category.toLowerCase() === currentCategory.toLowerCase());
        const matchesSearch = !searchQuery ||
          (post.title && post.title.toLowerCase().includes(searchQuery)) ||
          (post.summary && post.summary.toLowerCase().includes(searchQuery)) ||
          (post.code && post.code.toLowerCase().includes(searchQuery)) ||
          (post.body && post.body.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="blog-empty-state" style="grid-column: 1 / -1;">
            <svg class="ico" style="width:48px;height:48px;stroke:var(--color-pink);margin-bottom:1rem;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-brain"></use></svg>
            <h4 style="color:#ffffff;font-size:1.4rem;margin-bottom:0.5rem;">No se encontraron artículos</h4>
            <p style="color:var(--text-muted);">Intenta buscar con otros términos o selecciona otra categoría temática.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(post => {
        const imgSrc = post.image || 'assets/img/FlorecimientoCerebral3.jpeg';
        const formattedDate = formatDate(post.date);

        return `
          <article class="blog-card">
            <div class="blog-card-img-wrap">
              <img src="${imgSrc}" alt="${post.title}" class="blog-card-img" loading="lazy">
              <span class="badge badge-pink blog-card-badge">${post.category}</span>
              ${post.code ? `<span class="blog-card-code">${post.code}</span>` : ''}
            </div>
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span>
                  <svg class="ico" style="width:14px;height:14px;stroke:currentColor;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-compass"></use></svg>
                  ${formattedDate}
                </span>
                <span>•</span>
                <span>${post.readTime}</span>
              </div>
              <h3 class="blog-card-title">
                <a href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a>
              </h3>
              <p class="blog-card-excerpt">${post.summary}</p>
              <div class="blog-card-footer">
                <span style="font-size:0.85rem;color:var(--text-muted);">${post.author}</span>
                <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card-read-more">
                  Leer entrada
                  <svg class="ico" style="width:16px;height:16px;stroke:currentColor;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-bolt"></use></svg>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }

  // --- POST SINGLE VIEW (post.html) ---
  function initPostView() {
    const postContainer = document.getElementById('post-article-container');
    if (!postContainer) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    fetch('content/blog/index.json?v=' + Date.now())
      .then(res => res.json())
      .then(posts => {
        let post = posts.find(p => p.slug === slug);
        if (!post && posts.length > 0) {
          post = posts[0]; // Default to latest
        }

        if (!post) {
          postContainer.innerHTML = `
            <div class="blog-empty-state">
              <h2>Artículo no encontrado</h2>
              <p>El artículo solicitado no existe o ha sido trasladado.</p>
              <a href="blog.html" class="btn btn-primary" style="margin-top:1.5rem;">Volver al Blog</a>
            </div>
          `;
          return;
        }

        // Update page title & meta
        document.title = `${post.title} | Blog Florecimiento Cerebral`;

        const formattedDate = formatDate(post.date);
        const parsedBody = renderMarkdown(post.body);
        const pageUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(`${post.title} - Florecimiento Cerebral Siglo XXI`);

        postContainer.innerHTML = `
          <header class="post-header">
            <div class="post-header-tags">
              <span class="badge badge-pink">${post.category}</span>
              ${post.code ? `<span class="badge badge-cyan">${post.code}</span>` : ''}
            </div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta-bar">
              <div class="post-author-box">
                <img src="https://res.cloudinary.com/kaiqn1tp/image/upload/v1788996435/logo.png" alt="${post.author}" class="post-author-avatar">
                <span>${post.author}</span>
              </div>
              <span>•</span>
              <span>${formattedDate}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
          </header>

          ${post.image ? `
            <div class="post-featured-media">
              <img src="${post.image}" alt="${post.title}" id="post-main-img">
              ${post.code ? `<div class="post-media-caption">Viñeta oficial — ${post.code} • docSERsol & Dr. Neuro Tóxix</div>` : ''}
            </div>
          ` : ''}

          <div class="post-content">
            ${parsedBody}
          </div>

          <div class="post-share-bar">
            <div class="post-share-title">Compartir Conocimiento</div>
            <div class="post-share-buttons">
              <a href="https://api.whatsapp.com/send?text=${shareTitle}%20${pageUrl}" target="_blank" rel="noopener" class="post-share-btn" title="Compartir en WhatsApp">
                <svg class="ico" style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-whatsapp"></use></svg>
                WhatsApp
              </a>
              <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${pageUrl}" target="_blank" rel="noopener" class="post-share-btn" title="Compartir en X / Twitter">
                <svg class="ico" style="width:16px;height:16px;stroke:currentColor;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-send"></use></svg>
                X / Twitter
              </a>
              <button type="button" class="post-share-btn" id="btn-copy-url">
                <svg class="ico" style="width:16px;height:16px;stroke:currentColor;" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-pin"></use></svg>
                Copiar Enlace
              </button>
            </div>
          </div>

          <div class="post-cta-box">
            <span class="badge badge-pink" style="margin-bottom:1rem;">Lectura Complementaria</span>
            <h3>Florecimiento Cerebral Siglo XXI</h3>
            <p>Descubre el libro completo del Dr. Pedro Hernán Pérez Estrada y transforma tu salud cognitiva con neurociencia y medicina integrativa.</p>
            <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
              <a href="index.html#libro" class="btn btn-primary">Conocer el Libro</a>
              <a href="blog.html" class="btn btn-secondary">Más Artículos</a>
            </div>
          </div>
        `;

        // Wire copy button
        const copyBtn = document.getElementById('btn-copy-url');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href)
              .then(() => showToast('¡Enlace del artículo copiado al portapapeles!'))
              .catch(() => showToast('No se pudo copiar el enlace.'));
          });
        }
      })
      .catch(err => {
        console.error('Error al cargar el artículo:', err);
        postContainer.innerHTML = '<p class="error-text">Ocurrió un error al cargar el artículo.</p>';
      });

    // Reading progress listener
    window.addEventListener('scroll', () => {
      const progressBar = document.getElementById('reading-progress');
      if (!progressBar) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    });
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initBlogListing();
    initPostView();
  });
})();
