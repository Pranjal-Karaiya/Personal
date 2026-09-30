const STORAGE_KEY = 'pv-wedding-music-playing';

export async function initMusicControl(button, config) {
  if (!button || !config.music?.enabled || !config.music?.source) {
    button?.remove();
    return null;
  }

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.src = config.music.source;

  const labelOn = 'Pause background music';
  const labelOff = 'Play background music';

  function setPlaying(playing) {
    button.setAttribute('aria-pressed', playing ? 'true' : 'false');
    button.setAttribute('aria-label', playing ? labelOn : labelOff);
    button.classList.toggle('is-playing', playing);
  }

  async function startMusic() {
    try {
      audio.volume = 1;
      await audio.play();
      localStorage.setItem(STORAGE_KEY, '1');
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  }

  button.addEventListener('click', async () => {
    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, '0');
      setPlaying(false);
    }
  });

  setPlaying(false);

  return {
    async startAfterInteraction() {
      if (localStorage.getItem(STORAGE_KEY) === '0') return false;
      return startMusic();
    },
    pause() {
      audio.pause();
      setPlaying(false);
    }
  };
}
