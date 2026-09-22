import { weddingConfig } from './config.js';
import { events, storyCopy, invitationCopy } from './data.js';
import { initCountdown } from './countdown.js';
import { initGallery } from './gallery.js';
import { initMusicControl } from './music.js';
import { initShare } from './share.js';
import { initScrollReveals } from './animations.js';
import { initBackToTop } from './navigation.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function renderHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const heroSrc = weddingConfig.images.hero;
  const heroMobile = weddingConfig.images.heroMobile;

  hero.className = 'hero';
  hero.innerHTML = `
    <div class="hero__media" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcset="${heroMobile}">
        <img src="${heroSrc}" alt="" width="1920" height="1080" fetchpriority="high">
      </picture>
      <div class="hero__overlay"></div>
    </div>
    <div class="hero__content reveal">
      <p class="eyebrow">Together with their families</p>
      <div class="hero__names">
        <h1 class="script-names">${weddingConfig.couple.groom}</h1>
        <p class="script-amp" aria-hidden="true">&</p>
        <p class="script-names">${weddingConfig.couple.bride}</p>
      </div>
      <p class="heading-md" style="margin-top:1rem;letter-spacing:0.25em">Wedding Invitation</p>
      <p class="body-lg" style="margin-top:1.25rem">${weddingConfig.wedding.displayDate}</p>
      <p class="body-muted">${weddingConfig.wedding.displayLocation}</p>
      <a href="#invitation" class="hero__scroll scroll-hint">
        <span>Scroll to Begin</span>
        <img src="assets/icons/arrow-down.svg" alt="" width="28" height="28">
      </a>
    </div>
  `;
}

function renderInvitation() {
  const section = document.getElementById('invitation');
  if (!section) return;

  const lines = invitationCopy.lines
    .map((line) => (line ? `<p>${line}</p>` : '<br>'))
    .join('');

  section.className = 'section invitation';
  section.innerHTML = `
    <div class="container text-center reveal">
      <div class="divider" aria-hidden="true">
        <span class="divider__line line-reveal"></span>
        <img class="divider__icon" src="assets/decorations/floral-divider.svg" alt="">
        <span class="divider__line line-reveal"></span>
      </div>
      <h2 class="heading-lg">Invitation</h2>
      <div class="invitation__poem body-lg" style="margin-top:2rem">${lines}</div>
    </div>
  `;
}

function renderCountdown() {
  const section = document.getElementById('countdown');
  if (!section) return;

  section.className = 'section section--alt countdown';
  section.innerHTML = `
    <div class="container reveal">
      <p class="eyebrow text-center">Mark Your Calendar</p>
      <h2 class="heading-lg text-center" style="margin-top:0.75rem">Counting Down</h2>
      <div class="countdown__grid" aria-live="polite">
        <div class="countdown__unit"><div class="countdown__value" data-unit="days">00</div><div class="countdown__label">Days</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="hours">00</div><div class="countdown__label">Hours</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="minutes">00</div><div class="countdown__label">Minutes</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="seconds">00</div><div class="countdown__label">Seconds</div></div>
      </div>
      <p class="countdown__passed" data-countdown-passed hidden>We can't wait to celebrate with you!</p>
    </div>
  `;
}

function initDateReveal() {
  const section = document.getElementById('date-reveal');
  if (!section) return;

  section.className = 'section date-reveal';
  section.innerHTML = `
    <div class="container reveal-scale">
      <p class="eyebrow text-center">Save the Date</p>
      <div class="date-reveal__card" style="margin-top:2rem">
        <div class="date-reveal__canvas-wrap" id="date-reveal-wrap">
          <div class="date-reveal__content" aria-hidden="false">
            <p class="eyebrow">Save the Date</p>
            <p class="date-reveal__day">15</p>
            <p class="date-reveal__month">FEBRUARY 2027</p>
            <p class="date-reveal__city">BILASPUR</p>
          </div>
          <canvas class="date-reveal__canvas" id="date-reveal-canvas" aria-label="Scratch to reveal the wedding date"></canvas>
        </div>
        <p class="date-reveal__hint" id="date-reveal-hint">Scratch or tap to reveal</p>
      </div>
    </div>
  `;

  const wrap = section.querySelector('#date-reveal-wrap');
  const canvas = section.querySelector('#date-reveal-canvas');
  const hint = section.querySelector('#date-reveal-hint');
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext('2d');
  let revealed = false;

  function sizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#8e6a32';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(201,164,92,0.35)';
    for (let i = 0; i < rect.width; i += 12) {
      ctx.fillRect(i, 0, 2, rect.height);
    }
    ctx.globalCompositeOperation = 'destination-out';
  }

  function scratch(x, y) {
    const radius = 28;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkReveal() {
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    const step = 32;
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] === 0) transparent += 1;
    }
    const samples = data.length / (4 * step);
    if (transparent / samples > 0.45) {
      revealed = true;
      canvas.classList.add('is-hidden');
      if (hint) hint.textContent = 'See you in Bilaspur!';
    }
  }

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onStart(e) {
    if (revealed) return;
    e.preventDefault();
    canvas.setPointerCapture?.(e.pointerId);
  }

  function onMove(e) {
    if (revealed) return;
    if (e.buttons === 0 && e.type === 'pointermove') return;
    const { x, y } = pointerPos(e);
    scratch(x, y);
    checkReveal();
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  canvas.addEventListener('pointerdown', onStart);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onMove);

  wrap.addEventListener('click', () => {
    if (!revealed) {
      revealed = true;
      canvas.classList.add('is-hidden');
      if (hint) hint.textContent = 'See you in Bilaspur!';
    }
  });
}

function renderStory() {
  const section = document.getElementById('story');
  if (!section) return;
  const imgs = weddingConfig.images.couple;

  section.className = 'section section--alt story';
  section.innerHTML = `
    <div class="container">
      <div class="story__grid">
        <div class="story__image reveal" data-side="left">
          <img src="${imgs[0]}" alt="Placeholder for couple photo" loading="lazy" width="600" height="750">
        </div>
        <div class="story__text reveal">
          <p class="eyebrow">${storyCopy.heading}</p>
          <h2 class="heading-lg" style="margin-top:0.5rem">${storyCopy.heading}</h2>
          ${storyCopy.paragraphs.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="story__image reveal" data-side="right">
          <img src="${imgs[1]}" alt="Placeholder for couple photo" loading="lazy" width="600" height="750">
        </div>
        <div class="story__image story__mobile-img story__mobile-img--mid reveal">
          <img src="${imgs[2]}" alt="Placeholder for couple photo" loading="lazy" width="600" height="750">
        </div>
      </div>
    </div>
  `;
}

function groupEventsByDate(list) {
  return list.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

function renderEvents() {
  const section = document.getElementById('events');
  if (!section) return;

  const grouped = groupEventsByDate(events);
  const timeline = el('div', 'events__timeline');

  Object.entries(grouped).forEach(([date, items]) => {
    timeline.appendChild(el('h3', 'events__day-title reveal', date));
    items.forEach((ev) => {
      const guests =
        ev.guests != null
          ? `<p class="event-card__guests">Guests: ${ev.guests}</p>`
          : '';
      const card = el(
        'article',
        'event-card reveal',
        `
        <p class="event-card__date">${ev.date}</p>
        <p class="event-card__session">${ev.session}</p>
        <h3 class="event-card__title">${ev.title}</h3>
        <p class="event-card__desc">${ev.description}</p>
        ${guests}
      `
      );
      timeline.appendChild(card);
    });
  });

  section.className = 'section events';
  section.innerHTML = `
    <div class="container">
      <p class="eyebrow text-center">Celebrations</p>
      <h2 class="heading-lg text-center" style="margin-top:0.75rem">Wedding Events</h2>
    </div>
  `;
  section.querySelector('.container').appendChild(timeline);
}

function renderGallery() {
  const section = document.getElementById('gallery');
  if (!section) return;

  const items = weddingConfig.images.gallery
    .map(
      (src, i) => `
      <button type="button" class="gallery__item reveal" data-gallery-index="${i}" aria-label="Open gallery image ${i + 1}">
        <img src="${src}" alt="Gallery placeholder ${i + 1} — replace with your photo" loading="lazy" width="400" height="500">
      </button>
    `
    )
    .join('');

  section.className = 'section section--alt gallery';
  section.innerHTML = `
    <div class="container">
      <p class="eyebrow text-center">Memories</p>
      <h2 class="heading-lg text-center" style="margin-top:0.75rem">Gallery</h2>
      <div class="gallery__grid" id="gallery-grid">${items}</div>
    </div>
  `;
}

function renderVenue() {
  const section = document.getElementById('venue');
  if (!section) return;
  const v = weddingConfig.venue;
  const mapBtn =
    v.mapUrl
      ? `<a class="btn" href="${v.mapUrl}" target="_blank" rel="noopener noreferrer">View Location</a>`
      : '';

  const nameBlock =
    v.name && v.name !== 'VENUE NAME'
      ? `<h3 class="heading-md">${v.name}</h3>`
      : `<p class="venue__placeholder">Venue name to be announced</p>`;
  const addressBlock =
    v.address && v.address !== 'VENUE ADDRESS'
      ? `<p class="body-muted" style="margin-top:0.75rem">${v.address}</p>`
      : `<p class="venue__placeholder" style="margin-top:0.75rem">Full address will be shared soon</p>`;

  section.className = 'section venue';
  section.innerHTML = `
    <div class="container">
      <div class="venue__grid reveal">
        <div class="venue__image">
          <img src="${v.image}" alt="Venue placeholder — add your venue photo" loading="lazy" width="800" height="500">
        </div>
        <div>
          <p class="eyebrow">Location</p>
          <h2 class="heading-lg" style="margin-top:0.5rem">Venue</h2>
          ${nameBlock}
          ${addressBlock}
          <p class="body-lg" style="margin-top:1rem">${v.city}, ${weddingConfig.location.country}</p>
          <div class="venue__actions">${mapBtn}</div>
        </div>
      </div>
    </div>
  `;
}

function buildWhatsAppUrl(number, message) {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function renderRsvp() {
  const section = document.getElementById('rsvp');
  if (!section) return;

  const msg = `Hello Pranjal & Vaishali,

I would like to RSVP for your wedding celebrations.

Name:
Number of guests:`;

  const wa = weddingConfig.contact.whatsapp;
  const phone = weddingConfig.contact.phone;

  const rsvpBtn = wa
    ? `<a class="btn btn--primary" href="${buildWhatsAppUrl(wa, msg)}" target="_blank" rel="noopener noreferrer">RSVP</a>`
    : '';
  const contactBtn = phone
    ? `<a class="btn" href="tel:${phone.replace(/\s/g, '')}">Contact Us</a>`
    : wa
      ? `<a class="btn" href="${buildWhatsAppUrl(wa, 'Hello Pranjal & Vaishali,')}" target="_blank" rel="noopener noreferrer">Contact Us</a>`
      : '';

  section.className = 'section section--alt rsvp';
  section.innerHTML = `
    <div class="container reveal">
      <p class="eyebrow">We Would Love To</p>
      <h2 class="heading-lg">Celebrate With You</h2>
      <p class="body-lg" style="margin-top:1rem">Please join us for the celebration.</p>
      <div class="rsvp__actions">${rsvpBtn}${contactBtn}</div>
      ${!rsvpBtn && !contactBtn ? '<p class="body-muted" style="margin-top:1rem">RSVP details will be shared soon.</p>' : ''}
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__closing reveal">
      <p>Your presence</p>
      <p>will make our celebration</p>
      <p>even more special.</p>
      <p class="site-footer__sign">With love,<br>${weddingConfig.couple.displayName}</p>
      <p class="site-footer__copy">${weddingConfig.wedding.displayDate} · ${weddingConfig.location.display}</p>
    </div>
  `;
}

async function initControls() {
  const musicBtn = document.getElementById('music-control');
  const shareBtn = document.getElementById('share-control');
  const toast = document.getElementById('toast');
  const backTop = document.getElementById('back-to-top');

  let musicController = null;
  if (musicBtn) {
    musicBtn.innerHTML = '<img src="assets/icons/music.svg" alt="" width="22" height="22">';
    musicController = await initMusicControl(musicBtn, weddingConfig);
  }

  if (shareBtn) {
    shareBtn.innerHTML = '<img src="assets/icons/share.svg" alt="" width="22" height="22">';
    shareBtn.setAttribute('aria-label', 'Share invitation');
    initShare(shareBtn, weddingConfig, toast);
  }

  if (backTop) {
    backTop.innerHTML = '<img src="assets/icons/arrow-down.svg" alt="" style="transform:rotate(180deg)" width="22" height="22">';
    backTop.setAttribute('aria-label', 'Back to top');
    initBackToTop(backTop);
  }

  return musicController;
}

function applyMeta() {
  document.title = `${weddingConfig.couple.displayName} | Wedding Invitation`;
}

document.addEventListener('DOMContentLoaded', async () => {
  applyMeta();
  renderHero();
  renderInvitation();
  renderCountdown();
  initDateReveal();
  renderStory();
  renderEvents();
  renderGallery();
  renderVenue();
  renderRsvp();
  renderFooter();

  await initControls();

  initCountdown(document.getElementById('countdown'), weddingConfig);
  initGallery(document.getElementById('gallery-grid'), weddingConfig.images.gallery);
  initScrollReveals();
});
