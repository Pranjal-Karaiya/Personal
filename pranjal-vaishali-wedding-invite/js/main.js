import { weddingConfig } from './config.js';
import { events, storyCopy, invitationCopy } from './data.js';
import { initCountdown } from './countdown.js';
import { initGallery } from './gallery.js';
import { initMusicControl } from './music.js';
import { initShare } from './share.js';
import { initScrollReveals } from './animations.js';
import { initBackToTop } from './navigation.js';
import { initHeroSlideshow, initHeroVideoPaused } from './hero.js';
import { initEnvelope } from './envelope.js';
import { initDateReveal } from './date-reveal.js';
import { mountCinematicContentInStage } from './cinematic-text.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function royalCornersHtml() {
  return `
    <img class="royal-card__corner royal-card__corner--tl" src="assets/decorations/corner-top-left.svg" alt="" width="56" height="56">
    <img class="royal-card__corner royal-card__corner--tr" src="assets/decorations/corner-top-left.svg" alt="" width="56" height="56">
    <img class="royal-card__corner royal-card__corner--bl" src="assets/decorations/corner-top-left.svg" alt="" width="56" height="56">
    <img class="royal-card__corner royal-card__corner--br" src="assets/decorations/corner-top-left.svg" alt="" width="56" height="56">
  `;
}

function sectionHeader(eyebrow, title) {
  return `
    <div class="royal-section-head reveal text-center">
      <p class="royal-flourish" aria-hidden="true">✦</p>
      <p class="eyebrow">${eyebrow}</p>
      <h2 class="heading-lg royal-title">${title}</h2>
      <div class="royal-title-line line-reveal" aria-hidden="true"></div>
    </div>
  `;
}

function renderHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const heroVideo = weddingConfig.theme?.heroVideo;
  const mediaHtml = heroVideo
    ? `<video class="hero__video" playsinline webkit-playsinline muted preload="none" aria-hidden="true"></video>`
    : (() => {
        const slides = weddingConfig.images.heroSlides?.length
          ? weddingConfig.images.heroSlides
          : [weddingConfig.images.hero];
        const slidesHtml = slides
          .map(
            (src, i) => `
      <div class="hero__slide${i === 0 ? ' is-active' : ''}">
        <img src="${src}" alt="" width="1920" height="1080" ${i === 0 ? 'fetchpriority="high"' : ''} loading="${i === 0 ? 'eager' : 'lazy'}">
      </div>`
          )
          .join('');
        return `<div class="hero__slideshow">${slidesHtml}</div>`;
      })();

  hero.className = 'hero';
  if (heroVideo) {
    hero.classList.add('hero--video');
    if (weddingConfig.theme?.heroVideoBurnedInText === true) {
      hero.classList.add('hero--baked-video-text');
    }
  }
  hero.innerHTML = `
    <div class="hero__media" aria-hidden="true">
      ${mediaHtml}
      <div class="hero__vignette"></div>
      <div class="hero__overlay"></div>
    </div>
    <div class="hero__frame" aria-hidden="true"></div>
    <div class="hero__content ${heroVideo ? 'hero__content--cinematic' : 'reveal royal-hero-card'}">
      ${heroVideo ? '' : royalCornersHtml()}
      ${
        heroVideo
          ? `
      <div class="hero__cinematic-inner">
        <p class="hero__welcome">${weddingConfig.hero?.welcomeMessage || 'We are honored to welcome you to the Wedding ceremony of..'}</p>
        <div class="hero__divider" aria-hidden="true"><span></span><span class="hero__divider-heart">♥</span><span></span></div>
        <div class="hero__couple-block">
          <h1 class="script-names hero__name" data-couple-name="groom">${weddingConfig.couple.groom}</h1>
          ${(weddingConfig.couple.groomLines || [])
            .map((line, i, arr) =>
              `<p class="hero__subline${i === arr.length - 1 ? ' hero__subline--role' : ''}">${line}</p>`
            )
            .join('')}
        </div>
        <p class="hero__amp script-amp" data-couple-amp>&</p>
        <div class="hero__couple-block">
          <h1 class="script-names hero__name" data-couple-name="bride">${weddingConfig.couple.bride}</h1>
          ${(weddingConfig.couple.brideLines || [])
            .map((line, i, arr) =>
              `<p class="hero__subline${i === arr.length - 1 ? ' hero__subline--role' : ''}">${line}</p>`
            )
            .join('')}
        </div>
      </div>
      <a href="#invitation" class="hero__scroll scroll-hint hero__scroll--cinematic">
        <span>SCROLL</span>
        <img src="assets/icons/arrow-down.svg" alt="" width="24" height="24">
      </a>`
          : `
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
      </a>`
      }
    </div>
  `;

  if (heroVideo) {
    const content = hero.querySelector('.hero__content--cinematic');
    mountCinematicContentInStage(content);
  }
}

function renderInvitation() {
  const section = document.getElementById('invitation');
  if (!section) return;

  const lines = invitationCopy.lines
    .map((line) => (line ? `<p>${line}</p>` : '<br>'))
    .join('');

  section.className = 'section invitation';
  section.innerHTML = `
    <div class="container">
      ${sectionHeader('With Love', 'Invitation')}
      <div class="royal-card reveal text-center">
        ${royalCornersHtml()}
        <div class="invitation__poem body-lg">${lines}</div>
      </div>
    </div>
  `;
}

function renderCountdown() {
  const section = document.getElementById('countdown');
  if (!section) return;

  section.className = 'section section--alt countdown';
  section.innerHTML = `
    <div class="container">
      ${sectionHeader('Mark Your Calendar', 'Counting Down')}
      <div class="countdown__grid reveal" aria-live="polite">
        <div class="countdown__unit"><div class="countdown__value" data-unit="days">00</div><div class="countdown__label">Days</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="hours">00</div><div class="countdown__label">Hours</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="minutes">00</div><div class="countdown__label">Minutes</div></div>
        <div class="countdown__unit"><div class="countdown__value" data-unit="seconds">00</div><div class="countdown__label">Seconds</div></div>
      </div>
      <p class="countdown__passed" data-countdown-passed hidden>We can't wait to celebrate with you!</p>
    </div>
  `;
}

function renderStory() {
  const section = document.getElementById('story');
  if (!section) return;
  const imgs = weddingConfig.images.couple;

  section.className = 'section section--alt story';
  section.innerHTML = `
    <div class="container">
      ${sectionHeader('Forever', storyCopy.heading)}
      <div class="story__grid">
        <div class="story__image reveal" data-side="left">
          <img src="${imgs[0]}" alt="Placeholder for couple photo" loading="lazy" width="600" height="750">
        </div>
        <div class="story__text reveal royal-card">
          ${royalCornersHtml()}
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
  section.innerHTML = `<div class="container">${sectionHeader('Celebrations', 'Wedding Events')}</div>`;
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
      ${sectionHeader('Memories', 'Gallery')}
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
        <div class="royal-card">
          ${royalCornersHtml()}
          ${sectionHeader('Location', 'Venue')}
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
    <div class="container">
      <div class="royal-card reveal text-center">
        ${royalCornersHtml()}
        ${sectionHeader('We Would Love To', 'Celebrate With You')}
        <p class="body-lg">Please join us for the celebration.</p>
        <div class="rsvp__actions">${rsvpBtn}${contactBtn}</div>
        ${!rsvpBtn && !contactBtn ? '<p class="body-muted" style="margin-top:1rem">RSVP details will be shared soon.</p>' : ''}
      </div>
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

function bootSite(musicController, videoHandoffTime) {
  const heroEl = document.getElementById('hero');
  const heroVideo = weddingConfig.theme?.heroVideo;
  if (heroVideo) {
    initHeroVideoPaused(heroEl, heroVideo, videoHandoffTime);
  } else {
    initHeroSlideshow(heroEl, weddingConfig.theme?.heroSlideshowIntervalMs);
  }
  initCountdown(document.getElementById('countdown'), weddingConfig);
  initGallery(document.getElementById('gallery-grid'), weddingConfig.images.gallery);
  initScrollReveals();

  const heroReveal = document.getElementById('hero')?.querySelector('.reveal');
  heroReveal?.classList.add('is-visible');

  if (musicController?.startAfterInteraction) {
    musicController.startAfterInteraction();
  }

  document.getElementById('main-content')?.style.removeProperty('visibility');
  window.scrollTo(0, 0);
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

  const musicController = await initControls();

  initEnvelope(weddingConfig, () => bootSite(musicController));
});
