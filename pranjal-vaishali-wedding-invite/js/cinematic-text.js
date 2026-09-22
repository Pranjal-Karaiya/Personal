const STAGE_ID = 'cinematic-text-stage';

export function ensureCinematicTextStage() {
  let stage = document.getElementById(STAGE_ID);
  if (stage) return stage;

  stage = document.createElement('div');
  stage.id = STAGE_ID;
  stage.className = 'cinematic-text-stage';
  stage.hidden = true;
  document.body.appendChild(stage);
  return stage;
}

export function mountCinematicContentInStage(content) {
  const stage = ensureCinematicTextStage();
  if (!content) return stage;
  stage.appendChild(content);
  return stage;
}

export function showCinematicTextStage(options = {}) {
  const stage = document.getElementById(STAGE_ID);
  if (!stage) return;
  const instant = options.instant === true;
  stage.classList.toggle('cinematic-text-stage--instant', instant);
  stage.hidden = false;
  stage.classList.add('cinematic-text-stage--visible');
}

export function hideCinematicTextStage() {
  const stage = document.getElementById(STAGE_ID);
  if (!stage) return;
  stage.classList.remove('cinematic-text-stage--visible');
  stage.hidden = true;
}

/**
 * Same DOM node: intro overlay → hero (no second copy).
 * Layout is identical via shared rules in cinematic-text.css.
 */
export function attachCinematicContentToHero() {
  const hero = document.getElementById('hero');
  const stage = document.getElementById(STAGE_ID);
  const content = stage?.querySelector('.hero__content--cinematic');
  if (!hero || !content) return;

  hero.appendChild(content);
  stage.remove();
}
