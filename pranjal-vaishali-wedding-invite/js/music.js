export async function initMusicControl(button, config) {
  if (!button || !config.music?.enabled || !config.music?.source) {
    button?.remove();
    return null;
  }

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.src = config.music.source;
  audio.muted = false;

  const labelMuted = 'Unmute background music';
  const labelPlaying = 'Mute background music';
  const iconPlaying = `
    <svg class="music-icon music-icon--playing" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor"/>
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
  const iconMuted = `
    <svg class="music-icon music-icon--muted" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor"/>
      <path d="m17 9 4 6M21 9l-4 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;

  function setMuted(muted) {
    audio.muted = muted;
    button.innerHTML = muted ? iconMuted : iconPlaying;
    button.setAttribute('aria-pressed', muted ? 'false' : 'true');
    button.setAttribute('aria-label', muted ? labelMuted : labelPlaying);
    button.classList.toggle('is-muted', muted);
    button.classList.toggle('is-playing', !muted);
  }

  async function startMusic() {
    audio.muted = false;
    try {
      await audio.play();
      setMuted(false);
      return true;
    } catch {
      setMuted(false);
      return false;
    }
  }

  button.addEventListener('click', async (event) => {
    event.stopPropagation();

    if (audio.paused) {
      await startMusic();
      return;
    }

    setMuted(!audio.muted);
  });

  // Always start every new visit unmuted.
  // The user's mute click only affects the current visit.
  setMuted(false);
  await startMusic();

  return {
    async startAfterInteraction() {
      if (!audio.paused) return true;
      return startMusic();
    },

    async startFromUserGesture() {
      return startMusic();
    },

    setMuted(muted) {
      setMuted(muted);
    },

    pause() {
      audio.pause();
    }
  };
}
