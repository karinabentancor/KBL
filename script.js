const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const sections = document.querySelectorAll('.page-scroll > section');

function isDesktop() { return window.innerWidth > 768; }

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.querySelector(id);
  if (target) target.classList.add('active');
}

function initDesktop() {
  if (isDesktop()) {
    showSection('#inicio');
  } else {
    sections.forEach(s => {
      s.classList.remove('active');
      s.style.display = '';
      s.style.opacity = '';
    });
  }
}

initDesktop();
window.addEventListener('resize', initDesktop);

document.querySelectorAll('.nav-links a, .nav-logo').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    if (isDesktop()) {
      e.preventDefault();
      showSection(href);
    }
  });
});

function fmt(s) {
  return Math.floor(s / 60) + ':' + Math.floor(s % 60).toString().padStart(2, '0');
}

document.querySelectorAll('.sound-item').forEach(item => {
  const btn   = item.querySelector('.play-btn');
  const audio = item.querySelector('audio');
  const fill  = item.querySelector('.track-fill');
  const dur   = item.querySelector('.track-dur');
  const bar   = item.querySelector('.track-progress');

  function stopAll() {
    document.querySelectorAll('.sound-item.playing').forEach(c => {
      c.classList.remove('playing');
      c.querySelector('audio').pause();
    });
  }

  function doToggle() {
    const wasPlaying = item.classList.contains('playing');
    stopAll();
    if (!wasPlaying) {
      item.classList.add('playing');
      if (audio.src && audio.src !== window.location.href) audio.play().catch(() => {});
    }
  }

  btn.addEventListener('click', e => { e.stopPropagation(); doToggle(); });
  item.addEventListener('click', doToggle);

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    if (dur) dur.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
  });

  audio.addEventListener('ended', () => {
    item.classList.remove('playing');
    fill.style.width = '0%';
    if (dur) dur.textContent = '—:——';
  });

  if (bar) bar.addEventListener('click', e => {
    e.stopPropagation();
    if (!audio.duration) return;
    const r = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
});

document.getElementById('send-btn').addEventListener('click', () => {
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('msg').value.trim();
  if (!name || !email || !msg) return;
  window.location.href =
    'mailto:karinabentancorlenzi@gmail.com'
    + '?subject=' + encodeURIComponent('Message from ' + name)
    + '&body='    + encodeURIComponent(msg + '\n\n— ' + email);
});

const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalIdx   = document.getElementById('modal-idx');
const modalTitle = document.getElementById('modal-title');
const modalMeta  = document.getElementById('modal-meta');
const modalDesc  = document.getElementById('modal-desc');
const modalPhotos = document.getElementById('modal-photos');

function placeholder() {
  return `<div class="modal-photo">
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="#EDE8DF" stroke-width="0.6">
      <rect x="2" y="8" width="36" height="26" rx="1"/>
      <circle cx="20" cy="21" r="7"/><circle cx="20" cy="21" r="2.5"/>
    </svg>
  </div>`;
}

function openModal(cell) {
  modalIdx.textContent   = cell.dataset.idx;
  modalTitle.textContent = cell.dataset.title;
  modalMeta.textContent  = cell.dataset.meta;
  modalDesc.textContent  = cell.dataset.desc;
  modalPhotos.innerHTML  = placeholder() + placeholder() + placeholder() + placeholder();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.proc-cell').forEach(cell => {
  cell.addEventListener('click', () => openModal(cell));
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });