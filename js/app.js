/* ============================================================
   CASA DA FALÉSIA — SHARED APP JS
   ============================================================ */

/* ── LANGUAGE ───────────────────────────────────────────── */
let currentLang = localStorage.getItem('cdf-lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('cdf-lang', lang);
  applyLang(lang);
  // Update active btn
  ['en','pt','fr'].forEach(l => {
    const btn = document.getElementById('l-' + l);
    if (btn) btn.classList.toggle('active', l === lang);
  });
}

function applyLang(lang) {
  const dict = window.T && window.T[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });
}

/* ── NAVBAR ─────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Determine active page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html',       key: 'nav.home',    label: 'Home' },
    { href: 'villa.html',       key: 'nav.villa',   label: 'The Villa' },
    { href: 'destination.html', key: 'nav.dest',    label: 'Pipa' },
    { href: 'reserve.html',     key: 'nav.reserve', label: 'Reserve' },
    { href: 'contact.html',     key: 'nav.contact', label: 'Contact' },
    { href: 'faq.html',         key: 'nav.faq',     label: 'FAQ' },
  ];

  const linksHtml = links.map(l =>
    `<li><a href="${l.href}" data-i18n="${l.key}" ${page === l.href ? 'class="active"' : ''}>${l.label}</a></li>`
  ).join('');

  nav.innerHTML = `
    <a href="index.html" class="nav-logo">Casa da Falésia</a>
    <ul class="nav-links" id="navLinks">
      ${linksHtml}
      <li class="lang-wrap">
        <button onclick="setLang('en')" id="l-en" class="lang-btn">EN</button>
        <span class="lang-sep">·</span>
        <button onclick="setLang('pt')" id="l-pt" class="lang-btn">PT</button>
        <span class="lang-sep">·</span>
        <button onclick="setLang('fr')" id="l-fr" class="lang-btn">FR</button>
      </li>
      <li><a href="reserve.html" class="nav-cta" data-i18n="nav.book">Book a Stay</a></li>
    </ul>
    <div class="nav-toggle" id="toggle" onclick="toggleNav()">
      <span></span><span></span><span></span>
    </div>
  `;

  // Scroll behavior
  const handleScroll = () => {
    const isLight = nav.classList.contains('light');
    if (!isLight) nav.classList.toggle('scrolled', window.scrollY > 64);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

function toggleNav() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

/* ── FOOTER ─────────────────────────────────────────────── */
function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>Casa da Falésia</h3>
        <p data-i18n="footer.tagline">A private beachfront villa in Pipa — built for those who need to truly escape.</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.h.explore">Explore</h4>
        <ul>
          <li><a href="index.html" data-i18n="nav.home">Home</a></li>
          <li><a href="villa.html" data-i18n="nav.villa">The Villa</a></li>
          <li><a href="destination.html" data-i18n="nav.dest">Pipa</a></li>
          <li><a href="reserve.html" data-i18n="nav.reserve">Reserve</a></li>
          <li><a href="faq.html" data-i18n="nav.faq">FAQ</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.h.stay">Stay</h4>
        <ul>
          <li><a href="reserve.html" data-i18n="nav.book">Book a Stay</a></li>
          <li><a href="reserve.html">Rates</a></li>
          <li><a href="faq.html" data-i18n="nav.faq">FAQ</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.h.contact">Contact</h4>
        <ul>
          <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
          <li><a href="mailto:hello@casadafalesia.com">hello@casadafalesia.com</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p data-i18n="footer.copyright">© 2025 Casa da Falésia · All rights reserved</p>
      <div class="socials">
        <a href="#">Instagram</a>
        <a href="#">WhatsApp</a>
        <a href="mailto:hello@casadafalesia.com">Email</a>
      </div>
    </div>
  `;
}

/* ── REVEAL ON SCROLL ───────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('up'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── LIGHTBOX ───────────────────────────────────────────── */
let lbImages = [];
let lbIndex = 0;

function initLightbox() {
  const lb = document.getElementById('lb');
  if (!lb) return;
  lb.innerHTML = `
    <div class="lb-close" onclick="closeLb()">×</div>
    <button class="lb-prev" onclick="lbStep(-1)">&#8249;</button>
    <img src="" alt="" id="lbImg">
    <button class="lb-next" onclick="lbStep(1)">&#8250;</button>
  `;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
  });
}

function openLb(el, groupSelector) {
  const src = el.querySelector('img').src;
  if (groupSelector) {
    lbImages = Array.from(document.querySelectorAll(groupSelector + ' img')).map(i => i.src);
    lbIndex = lbImages.indexOf(src);
  } else {
    lbImages = [src];
    lbIndex = 0;
  }
  showLbImage();
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  const img = document.getElementById('lbImg');
  if (img && lbImages[lbIndex]) {
    img.src = lbImages[lbIndex].replace(/w=\d+/, 'w=2000');
  }
}

function lbStep(dir) {
  lbIndex = (lbIndex + lbImages.length + dir) % lbImages.length;
  showLbImage();
}

function closeLb() {
  const lb = document.getElementById('lb');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFooter();
  initReveal();
  initLightbox();
  // Apply saved language
  setLang(currentLang);
});
