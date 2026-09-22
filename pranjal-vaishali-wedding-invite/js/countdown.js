export function getWeddingTargetDate(config) {
  const { date, time, timezone } = config.wedding;
  if (timezone === 'Asia/Kolkata') {
    return new Date(`${date}T${time}:00+05:30`);
  }
  return new Date(`${date}T${time}:00`);
}

export function initCountdown(root, config) {
  if (!root) return () => {};

  const target = getWeddingTargetDate(config);
  const valueEls = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]')
  };
  const passedEl = root.querySelector('[data-countdown-passed]');

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function tick() {
    const now = Date.now();
    let diff = target.getTime() - now;

    if (diff <= 0) {
      if (passedEl) passedEl.hidden = false;
      Object.values(valueEls).forEach((el) => {
        if (el) el.textContent = '00';
      });
      return;
    }

    if (passedEl) passedEl.hidden = true;

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    if (valueEls.days) valueEls.days.textContent = pad(days);
    if (valueEls.hours) valueEls.hours.textContent = pad(hours);
    if (valueEls.minutes) valueEls.minutes.textContent = pad(minutes);
    if (valueEls.seconds) valueEls.seconds.textContent = pad(seconds);
  }

  tick();
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}
