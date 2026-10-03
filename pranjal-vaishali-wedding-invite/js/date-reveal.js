import { weddingConfig } from './config.js?v=20261003-2';

function readScratchColors() {
  const styles = getComputedStyle(document.body);
  return {
    center: styles.getPropertyValue('--scratch-heart-center').trim() || '#e8b4c0',
    edge: styles.getPropertyValue('--scratch-heart-edge').trim() || '#d68ea2',
    deep: styles.getPropertyValue('--scratch-heart-deep').trim() || '#c97a8c',
    sparkle: styles.getPropertyValue('--scratch-sparkle').trim() || '252, 235, 240',
  };
}

function paintScratchSurface(ctx, width, height) {
  const { center, edge, deep, sparkle } = readScratchColors();
  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, center);
  base.addColorStop(0.55, edge);
  base.addColorStop(1, deep);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const shine = ctx.createRadialGradient(width * 0.45, height * 0.2, 0, width * 0.5, height * 0.35, width * 0.75);
  shine.addColorStop(0, 'rgba(255,255,255,0.45)');
  shine.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, width, height);

  const specks = [
    'rgba(255,255,255,0.95)',
    'rgba(255,255,255,0.6)',
    `rgba(${sparkle},0.9)`,
  ];
  for (let i = 0; i < 260; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 1.8 + 0.4;
    ctx.fillStyle = specks[Math.floor(Math.random() * specks.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function formatRevealContent(config) {
  const displayDate = config.wedding.displayDate || '';
  const dayMatch = config.wedding.date?.match(/-(\d{2})$/);
  const day = dayMatch ? `${dayMatch[1]}th`.replace('11th','11th').replace('12th','12th').replace('13th','13th') : '15th';
  const monthYear = displayDate.replace(/^\d+\s*/, '').trim();
  const monthMatch = monthYear.match(/^([A-Za-z]+)\s+(\d{4})$/);
  const month = monthMatch ? monthMatch[1] : monthYear;
  const year = monthMatch ? monthMatch[2] : '';
  return { day, month, year };
}

export function initDateReveal() {
  const section = document.getElementById('date-reveal');
  if (!section) return;

  const { day, month, year } = formatRevealContent(weddingConfig);
  section.className = 'section date-reveal';
  section.innerHTML = `
    <div class="container reveal-scale">
      <div class="date-reveal__panel">
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
              <div class="date-reveal__date">
                <span class="date-reveal__day">${day}</span>
                <span class="date-reveal__month"><span class="date-reveal__month-name">${month}</span><span class="date-reveal__year">${year}</span></span>
              </div>
            </div>
            <canvas class="date-reveal__canvas" id="date-reveal-canvas" aria-label="Scratch to reveal the wedding date"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  const wrap = section.querySelector('#date-reveal-wrap');
  const canvas = section.querySelector('#date-reveal-canvas');
  const content = section.querySelector('.date-reveal__content');
  if (!wrap || !canvas || !content) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let revealed = false;
  let painting = false;
  let dpr = 1;

  function sizeCanvas() {
    // Use layout dimensions, not getBoundingClientRect(), because this
    // section is animated with transform: scale() via .reveal-scale.
    const width = wrap.offsetWidth * 1.05;
    const height = wrap.offsetHeight * 1.05;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = '105%';
    canvas.style.height = '105%';
    canvas.style.left = '0px';
    canvas.style.top = '0px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    paintScratchSurface(ctx, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
  }

  function scratch(x, y) {
    ctx.beginPath();
    ctx.arc(x * dpr, y * dpr, 22 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  function finishReveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add('is-hidden');
    wrap.classList.add('is-revealed');
  }

  function checkReveal() {
    const stepX = 15;
    const stepY = 15;
    let transparent = 0;
    let samples = 0;

    for (let y = stepY / 2; y < canvas.clientHeight; y += stepY) {
      for (let x = stepX / 2; x < canvas.clientWidth; x += stepX) {
        const pixel = ctx.getImageData(
          Math.floor(x * dpr),
          Math.floor(y * dpr),
          1,
          1
        ).data;
        samples += 1;
        if (pixel[3] < 32) transparent += 1;
      }
    }

    if (samples && transparent / samples >= 0.35) finishReveal();
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
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(sizeCanvas);
    observer.observe(wrap);
  } else {
    window.addEventListener('resize', sizeCanvas);
  }

  if (window.PointerEvent) {
    canvas.addEventListener('pointerdown', onStart);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onEnd);
    canvas.addEventListener('pointercancel', onEnd);
  } else {
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);
    canvas.addEventListener('touchcancel', onEnd);
  }
}
