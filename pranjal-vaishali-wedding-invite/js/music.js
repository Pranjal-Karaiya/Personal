const STORAGE_KEY = 'pv-wedding-music-playing';

export async function initMusicControl(button, config) {
  if (!button || !config.music?.enabled) {
    button?.remove();
    return null;
  }

  const audio = new Audio(config.music.source);
  audio.loop = true;
  audio.preload = 'none';

  let available = true;
  try {
    const res = await fetch(config.music.source, { method: 'HEAD' });
    if (!res.ok) available = false;
  } catch {
    available = false;
  }

  if (!available) {
    button.remove();
    return null;
  }

  const labelOn = 'Pause background music';
  const labelOff = 'Play background music';

  function setPlaying(playing) {
    button.setAttribute('aria-pressed', playing ? 'true' : 'false');
    button.setAttribute('aria-label', playing ? labelOn : labelOff);
    button.classList.toggle('is-playing', playing);
  }

  button.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        localStorage.setItem(STORAGE_KEY, '1');
        setPlaying(true);
      } else {
        audio.pause();
        localStorage.setItem(STORAGE_KEY, '0');
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  });

  setPlaying(false);

  return {
    async startAfterInteraction() {
      if (localStorage.getItem(STORAGE_KEY) === '0') return;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    },
    pause() {
      audio.pause();
      setPlaying(false);
    }
  };
}
