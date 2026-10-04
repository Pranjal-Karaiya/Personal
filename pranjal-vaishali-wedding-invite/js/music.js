const STORAGE_KEY = 'pv-wedding-music-muted';

export async function initMusicControl(button, config) {
  if (!button || !config.music?.enabled || !config.music?.source) {
    button?.remove();
    return null;
  }

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.src = config.music.source;

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
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }

  button.addEventListener('click', async (event) => {
    event.stopPropagation();

    if (audio.paused) {
      audio.muted = false;
      const started = await startMusic();

      if (started) {
        localStorage.setItem(STORAGE_KEY, '0');
        setMuted(false);
      }

      return;
    }

    const muted = !audio.muted;
    setMuted(muted);
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  });

  // Start unmuted by default. Preserve an explicit mute choice from
  // a previous visit.
  const initiallyMuted = localStorage.getItem(STORAGE_KEY) === '1';
  setMuted(initiallyMuted);
  audio.muted = initiallyMuted;

  if (!initiallyMuted) {
    const started = await startMusic();

    // Safari may block audible autoplay. The visible control remains
    // ready so the first tap can start the song audibly.
    if (!started) {
      setMuted(false);
    }
  }

  return {
    async startAfterInteraction() {
      if (!audio.paused) return true;
      return startMusic();
    },

    async startFromUserGesture() {
      audio.muted = false;
      const started = await startMusic();

      if (started) {
        localStorage.setItem(STORAGE_KEY, '0');
        setMuted(false);
      }

      return started;
    },

    setMuted(muted) {
      setMuted(muted);
      localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    },

    pause() {
      audio.pause();
      setMuted(true);
      localStorage.setItem(STORAGE_KEY, '1');
    }
  };
}
