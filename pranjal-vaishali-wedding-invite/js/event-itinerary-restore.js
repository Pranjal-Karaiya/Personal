import { events } from './data.js?v=20261003-2';

function restoreWeddingEventsTimeline() {
  const section = document.getElementById('events');
  if (!section) return;

  const container = section.querySelector('.container');
  if (!container) return;

  const timeline = document.createElement('div');
  timeline.className = 'events__visual-timeline';
  timeline.innerHTML = events
    .map((ev, index) => `
      <article class="event-item ${index % 2 ? 'event-item--reverse' : ''} reveal">
        <div class="event-item__copy">
          <p class="event-item__date">${ev.date}</p>
          <h3 class="event-item__title">${ev.title}</h3>
          <p class="event-item__time">${ev.time}</p>
          <div class="event-item__rule" aria-hidden="true"></div>
          <p class="event-item__desc">${ev.description}</p>
        </div>
        <div class="event-item__node" aria-hidden="true"><span>${ev.icon}</span></div>
        <div class="event-item__art">
          <img src="${ev.image}" alt="" loading="lazy" width="800" height="560">
        </div>
      </article>
    `)
    .join('');

  const existingTimeline = container.querySelector('.events__timeline');
  if (existingTimeline) {
    existingTimeline.replaceWith(timeline);
  } else {
    container.appendChild(timeline);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', restoreWeddingEventsTimeline, { once: true });
} else {
  restoreWeddingEventsTimeline();
}
