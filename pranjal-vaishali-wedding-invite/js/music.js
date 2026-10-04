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

  function setMuted(muted) {
    audio.muted = muted;
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
