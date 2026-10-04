import {
  attachCinematicContentToHero,
  showCinematicTextStage,
} from './cinematic-text.js?v=20261003-2';

function getVideoSrc(config) {
  return config.theme?.heroVideo || config.envelope?.video || '';
}

function getTextRevealTime(config) {
  const t = Number(config.theme?.heroTextRevealAt ?? 12);
  return Number.isFinite(t) ? t : 12;
}

function buildClassicEnvelopeHtml(config) {
  const inviteText = config.envelope?.inviteText || 'You are invited';
  const sealText = config.envelope?.sealText || 'Tap to open';
  const names = config.couple?.displayName || '';
  const dateLine = config.wedding?.displayDate || '';

  return `
    <div class="envelope" id="envelope" role="presentation">
      <div class="envelope__card" aria-hidden="true">
        <div class="envelope__card-inner">
          <p class="envelope__card-ornament" aria-hidden="true">✦</p>
          <p class="envelope__card-names">${names}</p>
          <p class="envelope__card-date">${dateLine}</p>
        </div>
      </div>
      <div class="envelope__back">
        <div class="envelope__pattern" aria-hidden="true"></div>
        <div class="envelope__pocket" aria-hidden="true"></div>
        <div class="envelope__flap-wrap">
          <div class="envelope__flap">
            <div class="envelope__flap-edge" aria-hidden="true"></div>
          </div>
        </div>
        <p class="envelope__footer-text">${inviteText}</p>
        <button type="button" class="envelope__seal" id="envelope-open" aria-label="Open wedding invitation">
          <span>${sealText}</span>
        </button>
      </div>
      <p class="envelope__hint">Tap the seal to continue</p>
    </div>
  `;
}

function buildVideoEnvelopeHtml(config) {
  const src = getVideoSrc(config);

  return `
    <video
      class="envelope-screen__video"
      id="envelope-video"
      src="${src}"
      playsinline
      webkit-playsinline
      muted
      preload="auto"
      disablePictureInPicture
    ></video>
    <div class="envelope-screen__shade" aria-hidden="true"></div>
    <button type="button" class="envelope-screen__tap" id="envelope-tap" aria-label="Tap to open wedding invitation">
      <span class="envelope-video-ui" aria-hidden="true"></span>
    </button>
  `;
}

export function initEnvelope(config, onOpened, onTapToOpen) {
  const enabled = config.envelope?.enabled !== false;
  const screen = document.getElementById('envelope-screen');
  if (!enabled || !screen) {
    onOpened?.();
    return;
  }

  const src = getVideoSrc(config);
  const useVideo = Boolean(src) && config.envelope?.useVideo !== false;
  const textRevealAt = getTextRevealTime(config);

  screen.classList.toggle('envelope-screen--video', useVideo);
  screen.innerHTML = useVideo ? buildVideoEnvelopeHtml(config) : buildClassicEnvelopeHtml(config);

  document.body.classList.add('envelope-active');
  if (useVideo) {
    document.body.classList.add('envelope-active--video');
  }

  let opened = false;
  let introStarted = false;
  let heroTextShown = false;
  let heroVisualHoldTime = 0;
  let playing = false;
  let rafId = 0;
  let intervalId = 0;

  function stopWatchers() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (intervalId) clearInterval(intervalId);
    intervalId = 0;
  }

  function revealHeroTextNow() {
    if (heroTextShown) return;
    heroTextShown = true;
    heroVisualHoldTime =
      video && Number.isFinite(video.currentTime) ? Math.max(0, video.currentTime) : textRevealAt;
    showCinematicTextStage();
    stopWatchers();
  }

  function maybeRevealHeroText() {
    if (heroTextShown || !playing || !video) return;
    if (video.currentTime < textRevealAt) return;
    revealHeroTextNow();
  }

  function startRevealWatchers() {
    playing = true;
    const tick = () => {
      maybeRevealHeroText();
      if (playing && !heroTextShown) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    intervalId = window.setInterval(maybeRevealHeroText, 16);
    video?.addEventListener('timeupdate', maybeRevealHeroText);

    if (typeof video.requestVideoFrameCallback === 'function') {
      const onFrame = (_now, metadata) => {
        if (!playing || heroTextShown) return;
        if (metadata.mediaTime >= textRevealAt) {
          revealHeroTextNow();
          return;
        }
        video.requestVideoFrameCallback(onFrame);
      };
      video.requestVideoFrameCallback(onFrame);
    }
  }

  function finish(videoEndTime) {
    stopWatchers();
    video?.removeEventListener('timeupdate', maybeRevealHeroText);
    attachCinematicContentToHero();
    document.getElementById('main-content')?.style.setProperty('visibility', 'visible');
    screen.classList.add('is-dismissed');
    document.body.classList.remove('envelope-active', 'envelope-active--video');
    window.setTimeout(() => {
      screen.remove();
      onOpened?.(videoEndTime);
    }, useVideo ? 500 : 900);
  }

  if (!useVideo) {
    const envelope = screen.querySelector('#envelope');
    const openBtn = screen.querySelector('#envelope-open');

    function openClassic() {
      if (opened) return;
      opened = true;
      openBtn.disabled = true;
      onTapToOpen?.();

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        finish();
        return;
      }

      envelope.classList.add('is-opening');
      window.setTimeout(() => envelope.classList.add('is-open'), 50);
      window.setTimeout(() => finish(), 1400);
    }

    openBtn.addEventListener('click', openClassic);
    return;
  }

  const video = screen.querySelector('#envelope-video');
  const tapTarget = screen.querySelector('#envelope-tap');

  function transferVideoToHero() {
    const heroMedia = document.querySelector('#hero .hero__media');
    if (!heroMedia || !video) return;
    heroMedia.querySelector('.hero__video')?.remove();
    video.classList.remove('envelope-screen__video');
    video.classList.add('hero__video');
    video.removeAttribute('id');
    heroMedia.insertBefore(video, heroMedia.firstChild);
  }

  function handoff() {
    if (opened) return;
    opened = true;
    if (!heroTextShown) showCinematicTextStage({ instant: true });

    // SCROLL is intentionally hidden while the video is playing.
    // Reveal it only after the video has completed, with a soft fade/slide.
    const scrollControl = document.querySelector('.hero__scroll--cinematic');
    scrollControl?.classList.add('is-video-complete');
    const endTime =
      heroVisualHoldTime > 0
        ? heroVisualHoldTime
        : video?.currentTime ?? 0;
    video?.pause();
    transferVideoToHero();
    finish(endTime);
  }

  function playIntro() {
    if (opened || introStarted || !video) return;
    introStarted = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      showCinematicTextStage({ instant: true });
      handoff();
      return;
    }

    tapTarget?.classList.add('is-playing');
    tapTarget?.querySelector('.envelope-video-ui')?.classList.add('is-hidden');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const syncHtmlToVideo = config.theme?.heroHtmlSyncedToVideo !== false;
    if (syncHtmlToVideo) startRevealWatchers();

    video.addEventListener(
      'ended',
      () => handoff(),
      { once: true }
    );

    // Keep the iOS tap gesture exclusively for the video. Do not seek,
    // pause, or start another media element before calling play().
    const playPromise = video.play();

    // Use the same tap gesture for both media elements. Video gets the
    // gesture first, then background audio is requested immediately.
    onTapToOpen?.();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        introStarted = false;
        stopWatchers();
        tapTarget?.classList.remove('is-playing');
        tapTarget?.querySelector('.envelope-video-ui')?.classList.remove('is-hidden');
      });
    }
  }

  video?.addEventListener('error', () => {
    tapTarget?.classList.remove('is-playing');
  });

  tapTarget?.addEventListener('click', (e) => {
    e.stopPropagation();
    playIntro();
  });
  screen.addEventListener('click', () => playIntro());
}
