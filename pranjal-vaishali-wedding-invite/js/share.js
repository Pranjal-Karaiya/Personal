export function initShare(button, config, toastEl) {
  if (!button) return;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    window.setTimeout(() => toastEl.classList.remove('is-visible'), 2800);
  }

  button.addEventListener('click', async () => {
    const payload = {
      title: config.share?.title || document.title,
      text: config.share?.text || '',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(payload.url);
      showToast('Link copied to clipboard');
    } catch {
      showToast('Copy this link: ' + payload.url);
    }
  });
}
