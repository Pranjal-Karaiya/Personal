export function initHeroSlideshow(root, intervalMs = 5500) {
  const slides = root?.querySelectorAll('.hero__slide');
  if (!slides?.length || slides.length < 2) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return () => {};

  let index = 0;
  const id = window.setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, intervalMs);

  return () => window.clearInterval(id);
}

/** Hold hero video on the final frame (no loop, no replay). */
export function initHeroVideoPaused(root, src, endTime) {
  const video = root?.querySelector('.hero__video');
  if (!video || !src) return;

  video.removeAttribute('loop');
  if (!video.getAttribute('src') && src) {
    video.setAttribute('src', src);
  }

  const park = () => {
    const duration = video.duration;
    if (!duration || !Number.isFinite(duration)) return;
    const alreadyAtEnd = video.paused && video.currentTime >= duration - 0.15;
    if (alreadyAtEnd) return;
    const target =
      typeof endTime === 'number' && endTime > 0
        ? Math.min(endTime, duration - 0.04)
        : duration - 0.04;
    try {
      video.currentTime = Math.max(0, target);
    } catch {
      /* ignore */
    }
    video.pause();
  };

  if (video.paused && video.currentTime > 0.5 && video.duration && video.currentTime >= video.duration - 0.2) {
    return;
  }

  if (video.readyState >= 1 && video.duration) {
    park();
  } else {
    video.addEventListener('loadedmetadata', park, { once: true });
    video.addEventListener('loadeddata', park, { once: true });
  }
}
