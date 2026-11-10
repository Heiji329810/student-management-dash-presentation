(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const jump = document.querySelector('#jump');
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const dock = document.querySelector('.control-dock');
  const toggle = document.querySelector('#controls-toggle');
  const menu = document.querySelector('#presentation-menu');
  const playback = document.querySelector('#playback');
  const interval = document.querySelector('#interval');
  const status = document.querySelector('#playback-status');
  const params = new URLSearchParams(location.search);
  let seconds = 12;
  let playing = false;
  let timer;
  function setIntervalSeconds(value) {
    const parsed = Number(value);
    seconds = Number.isFinite(parsed) && String(value).trim() !== '' ? Math.max(3, Math.min(120, Math.round(parsed))) : 12;
    interval.value = String(seconds);
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && !document.hidden) timer = setTimeout(() => show((current + 1) % slides.length), seconds * 1000);
  }
  function setPlaying(value) {
    playing = value;
    if (playing && document.body.classList.contains('overview')) overview();
    playback.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    playback.setAttribute('aria-pressed', String(playing));
    status.textContent = playing ? `Playing · ${seconds} seconds per slide · repeats after the last slide` : 'Slideshow paused';
    schedule();
  }
  let keyboardInput = false;
  let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.replace('#slide-', '')) - 1 || 0));

  function setMenu(open, restoreFocus = false) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && restoreFocus) {
      keyboardInput = false;
      toggle.focus({ preventScroll: true });
    }
  }
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, n) => {
      slide.classList.toggle('active', n === current);
      slide.setAttribute('aria-hidden', String(n !== current && !document.body.classList.contains('overview')));
    });
    jump.value = String(current);
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    history.replaceState(null, '', '#slide-' + (current + 1));
    document.title = `${current + 1} / ${slides.length} · CC Student Management`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    schedule();
  }
  function overview() {
    if (!document.body.classList.contains('overview')) setPlaying(false);
    document.body.classList.toggle('overview');
    document.querySelector('#overview').textContent = document.body.classList.contains('overview') ? 'Present' : 'Overview';
    show(current);
    setMenu(false);
  }
  async function fullscreen() {
    setMenu(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else {
        if (document.body.classList.contains('overview')) overview();
        await document.documentElement.requestFullscreen();
      }
      document.activeElement?.blur();
    } catch {
      document.querySelector('#fullscreen').textContent = 'Use browser full screen';
      setMenu(true);
    }
  }

  playback.onclick = () => setPlaying(!playing);
  interval.onchange = () => { setIntervalSeconds(interval.value); setPlaying(playing); };
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('beforeprint', () => setPlaying(false));
  prev.onclick = () => show(current - 1);
  next.onclick = () => show(current + 1);
  jump.onchange = () => show(Number(jump.value));
  document.querySelector('#overview').onclick = overview;
  document.querySelector('#fullscreen').onclick = fullscreen;
  document.querySelector('#print').onclick = () => { setPlaying(false); setMenu(false); window.print(); };
  toggle.onclick = () => setMenu(menu.hidden);
  document.querySelector('#controls-close').onclick = () => setMenu(false, true);
  toggle.addEventListener('focus', () => { if (keyboardInput) setMenu(true); });
  dock.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') setMenu(true); });
  dock.addEventListener('pointerleave', () => { if (!dock.contains(document.activeElement)) setMenu(false); });
  dock.addEventListener('focusout', () => requestAnimationFrame(() => {
    if (!dock.contains(document.activeElement) && !dock.matches(':hover')) setMenu(false);
  }));
  document.addEventListener('pointerdown', event => {
    keyboardInput = false;
    if (!dock.contains(event.target)) setMenu(false);
  });
  document.addEventListener('fullscreenchange', () => {
    document.querySelector('#fullscreen').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
  document.addEventListener('keydown', event => {
    keyboardInput = true;
    if (event.key === 'Escape') {
      if (!menu.hidden) { event.preventDefault(); setMenu(false, true); }
      else if (document.body.classList.contains('overview')) overview();
      return;
    }
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (event.key.toLowerCase() === 'p') { event.preventDefault(); setPlaying(!playing); return; }
    if (event.key === '?') { event.preventDefault(); const open = menu.hidden; setMenu(open); if (open) toggle.focus({ preventScroll: true }); return; }
    if (event.key.toLowerCase() === 'f') { event.preventDefault(); fullscreen(); return; }
    if (event.key.toLowerCase() === 'o') { event.preventDefault(); overview(); return; }
    if (event.key === ' ' && ['BUTTON', 'A'].includes(event.target.tagName)) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
  });
  slides.forEach((slide, i) => slide.addEventListener('click', event => {
    if (document.body.classList.contains('overview') && !event.target.closest('a')) { overview(); show(i); }
  }));
  window.addEventListener('hashchange', () => show(Number(location.hash.replace('#slide-', '')) - 1 || 0));
  setIntervalSeconds(params.get('interval') || 12);
  show(current);
  setPlaying(params.get('autoplay') === '1');
})();
