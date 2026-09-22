export function initGallery(gridEl, images) {
  if (!gridEl || !images?.length) return null;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox__img');
  const btnClose = lightbox?.querySelector('.lightbox__close');
  const btnPrev = lightbox?.querySelector('.lightbox__nav--prev');
  const btnNext = lightbox?.querySelector('.lightbox__nav--next');

  let currentIndex = 0;

  function openAt(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
    lightboxImg.alt = `Gallery photo ${currentIndex + 1}`;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    btnClose?.focus();
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImg.removeAttribute('src');
  }

  function step(delta) {
    openAt(currentIndex + delta);
  }

  gridEl.querySelectorAll('[data-gallery-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openAt(Number(btn.dataset.galleryIndex));
    });
  });

  btnClose?.addEventListener('click', close);
  btnPrev?.addEventListener('click', () => step(-1));
  btnNext?.addEventListener('click', () => step(1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  return { openAt, close };
}
