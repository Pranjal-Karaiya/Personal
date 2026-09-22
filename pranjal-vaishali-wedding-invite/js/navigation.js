export function initBackToTop(button) {
  if (!button) return;

  const toggle = () => {
    if (window.scrollY > 480) {
      button.classList.add('is-visible');
    } else {
      button.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
