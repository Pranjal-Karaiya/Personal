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
  audio.muted = true;

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
      } else {
        audio.muted = true;
        setMuted(true);
      }
      return;
    }

    const muted = !audio.muted;
    setMuted(muted);
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  });

  setMuted(true);

  // Start the song immediately, but muted. Safari/WebKit permits muted
  // media autoplay without a user gesture. The visible control can unmute
  // it independently of the intro video's click gesture.
  await startMusic();

  return {
    async startAfterInteraction() {
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
    },

    pause() {
      audio.pause();
      setMuted(true);
    }
  };
}
