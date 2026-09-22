import { weddingConfig } from './config.js';

/** Shared heart geometry — must match SVG mask in CSS */
export const HEART_VIEWBOX = { w: 300, h: 280 };
export const HEART_PATH =
  'M150,238 C150,238 28,168 28,98 C28,52 68,32 108,58 C128,72 142,96 150,112 C158,96 172,72 192,58 C232,32 272,52 272,98 C272,168 150,238 150,238Z';

function traceHeartPath(ctx, width, height) {
  const sx = width / HEART_VIEWBOX.w;
  const sy = height / HEART_VIEWBOX.h;
  ctx.beginPath();
  ctx.moveTo(150 * sx, 238 * sy);
  ctx.bezierCurveTo(150 * sx, 238 * sy, 28 * sx, 168 * sy, 28 * sx, 98 * sy);
  ctx.bezierCurveTo(28 * sx, 52 * sy, 68 * sx, 32 * sy, 108 * sx, 58 * sy);
  ctx.bezierCurveTo(128 * sx, 72 * sy, 142 * sx, 96 * sy, 150 * sx, 112 * sy);
  ctx.bezierCurveTo(158 * sx, 96 * sy, 172 * sx, 72 * sy, 192 * sx, 58 * sy);
  ctx.bezierCurveTo(232 * sx, 32 * sy, 272 * sx, 52 * sy, 272 * sx, 98 * sy);
  ctx.bezierCurveTo(272 * sx, 168 * sy, 150 * sx, 238 * sy, 150 * sx, 238 * sy);
  ctx.closePath();
}

function pointInHeart(ctx, x, y, width, height) {
  traceHeartPath(ctx, width, height);
  return ctx.isPointInPath(x, y);
}

function heartMaskUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HEART_VIEWBOX.w} ${HEART_VIEWBOX.h}"><path fill="white" d="${HEART_PATH}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function readScratchColors() {
  const styles = getComputedStyle(document.body);
  return {
    heartCenter: styles.getPropertyValue('--scratch-heart-center').trim() || '#e8b4c0',
    heartEdge: styles.getPropertyValue('--scratch-heart-edge').trim() || '#d68ea2',
    heartDeep: styles.getPropertyValue('--scratch-heart-deep').trim() || '#c97a8c',
    sparkle: styles.getPropertyValue('--scratch-sparkle').trim() || '252, 235, 240',
  };
}

function paintGlitterHeart(ctx, width, height) {
  const { heartCenter, heartEdge, heartDeep, sparkle } = readScratchColors();
  ctx.save();
  traceHeartPath(ctx, width, height);
  ctx.clip();

  const base = ctx.createRadialGradient(
    width * 0.5,
    height * 0.36,
    width * 0.06,
    width * 0.5,
    height * 0.42,
    width * 0.58
  );
  base.addColorStop(0, heartCenter);
  base.addColorStop(0.55, heartEdge);
  base.addColorStop(1, heartDeep);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const shine = ctx.createRadialGradient(width * 0.46, height * 0.28, 0, width * 0.5, height * 0.35, width * 0.45);
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  shine.addColorStop(0.6, 'rgba(255, 255, 255, 0.12)');
  shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, width, height);

  const specks = [
    'rgba(255, 255, 255, 0.95)',
    'rgba(255, 255, 255, 0.6)',
    `rgba(${sparkle}, 0.9)`,
    'rgba(230, 190, 200, 0.75)',
    'rgba(180, 120, 135, 0.35)',
  ];

  for (let i = 0; i < 1100; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    if (!pointInHeart(ctx, x, y, width, height)) continue;
    const r = Math.random() * 1.8 + 0.35;
    ctx.fillStyle = specks[Math.floor(Math.random() * specks.length)];
    if (Math.random() > 0.7) {
      ctx.fillRect(x, y, r * 2, r * 0.55);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function buildGoogleCalendarUrl(config) {
  const { couple, wedding, venue, share } = config;
  const date = (wedding.date || '').replace(/-/g, '');
  if (!date) return '#';
  const title = encodeURIComponent(share?.title || `${couple.displayName} — Wedding`);
  const details = encodeURIComponent(share?.text || '');
  const location = encodeURIComponent(venue?.address || config.location?.display || '');
  const dates = `${date}/${date}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function formatRevealContent(config) {
  const displayDate = config.wedding.displayDate || '';
  const dayMatch = config.wedding.date?.match(/-(\d{2})$/);
  const day = dayMatch ? dayMatch[1] : '15';
  const monthYear = displayDate.replace(/^\d+\s*/, '').trim();
  const city = config.location?.city || config.wedding.displayLocation?.split(',')[0]?.trim() || 'Bilaspur';
  const region =
    config.location?.state ||
    config.wedding.displayLocation?.split(',').slice(1).join(',').trim() ||
    '';

  return { day, monthYear, city, region };
}

export function initDateReveal() {
  const section = document.getElementById('date-reveal');
  if (!section) return;

  const { day, monthYear, city, region } = formatRevealContent(weddingConfig);
  const calendarUrl = buildGoogleCalendarUrl(weddingConfig);
  const mask = heartMaskUrl();

  section.className = 'section date-reveal';
  section.innerHTML = `
    <div class="container reveal-scale">
      <div class="date-reveal__panel">
        <p class="date-reveal__panel-heart" aria-hidden="true">♥</p>
        <h2 class="date-reveal__scratch-title">Scratch to Reveal</h2>
        <div class="date-reveal__divider" aria-hidden="true">
          <span class="date-reveal__divider-line"></span>
          <span class="date-reveal__divider-heart">♥</span>
          <span class="date-reveal__divider-line"></span>
        </div>
        <div class="date-reveal__stage">
          <div class="date-reveal__canvas-wrap" id="date-reveal-wrap">
            <div class="date-reveal__content" aria-hidden="false">
              <p class="date-reveal__invited">You're Invited</p>
              <p class="date-reveal__day">${day}</p>
              <p class="date-reveal__month">${monthYear}</p>
              <p class="date-reveal__city">${city}</p>
              ${region ? `<p class="date-reveal__region">${region}</p>` : ''}
            </div>
            <canvas class="date-reveal__canvas" id="date-reveal-canvas" aria-label="Scratch the heart to reveal the wedding date"></canvas>
          </div>
        </div>
      </div>
      <p class="date-reveal__hint" id="date-reveal-hint">Scratch the heart to reveal the date</p>
      <a class="date-reveal__calendar-btn" href="${calendarUrl}" target="_blank" rel="noopener noreferrer">
        <svg class="date-reveal__calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 14v4M10 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Save the Date
      </a>
    </div>
  `;

  const wrap = section.querySelector('#date-reveal-wrap');
  const canvas = section.querySelector('#date-reveal-canvas');
  const content = section.querySelector('.date-reveal__content');
  const hint = section.querySelector('#date-reveal-hint');
  if (!wrap || !canvas || !content) return;

  wrap.style.setProperty('--heart-mask', mask);
  content.style.setProperty('--heart-mask', mask);
  canvas.style.setProperty('--heart-mask', mask);

  const ctx = canvas.getContext('2d');
  let revealed = false;
  let painting = false;

  function sizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    paintGlitterHeart(ctx, rect.width, rect.height);
    ctx.globalCompositeOperation = 'destination-out';
  }

  function scratch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  function finishReveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add('is-hidden');
    wrap.classList.add('is-revealed');
    if (hint) hint.textContent = 'See you there!';
  }

  function checkReveal() {
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    const step = 28;
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] === 0) transparent += 1;
    }
    const samples = data.length / (4 * step);
    if (transparent / samples > 0.42) finishReveal();
  }

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onStart(e) {
    if (revealed) return;
    painting = true;
    e.preventDefault();
    canvas.setPointerCapture?.(e.pointerId);
    const { x, y } = pointerPos(e);
    scratch(x, y);
    checkReveal();
  }

  function onMove(e) {
    if (revealed || !painting) return;
    if (e.type === 'pointermove' && e.buttons === 0) return;
    e.preventDefault();
    const { x, y } = pointerPos(e);
    scratch(x, y);
    checkReveal();
  }

  function onEnd() {
    painting = false;
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  canvas.addEventListener('pointerdown', onStart);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onEnd);
  canvas.addEventListener('pointercancel', onEnd);
}
