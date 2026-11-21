/* Shared behaviour: header state, mobile menu, scroll reveal, hero spotlight, toast */
(function () {
  'use strict';
  const CBS = (window.CBS = window.CBS || {});
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Toast ------------------------------------------------------------------ */
  let toastEl, toastTimer;
  CBS.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  };

  /* Header: scrolled state ------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu ------------------------------------------------------------ */
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (btn && nav && header) {
    const setOpen = function (open) {
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('is-locked', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) return;
      const first = nav.querySelector('a');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 120);
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
    });
    // Reset if the viewport grows past the mobile breakpoint
    window.matchMedia('(min-width: 761px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* Scroll reveal ---------------------------------------------------------- */
  const items = document.querySelectorAll('[data-reveal]');
  if (items.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* Hero spotlight: warm light that follows the pointer (fine pointers only) */
  const spot = document.querySelector('[data-spotlight]');
  if (spot && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0, tx = 0.7, ty = 0.4, cx = tx, cy = ty;
    const art = spot.querySelector('[data-parallax]');
    const tick = function () {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      spot.style.setProperty('--mx', (cx * 100).toFixed(2) + '%');
      spot.style.setProperty('--my', (cy * 100).toFixed(2) + '%');
      if (art) art.style.transform = 'translate3d(' + ((cx - 0.5) * -18).toFixed(2) + 'px,' + ((cy - 0.5) * -18).toFixed(2) + 'px,0)';
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0005) ? requestAnimationFrame(tick) : 0;
    };
    spot.addEventListener('pointermove', function (e) {
      const r = spot.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* Roving radio/tab group: arrow keys move + select, one tab stop ---------- */
  CBS.roving = function (group, itemSel, attr, onSelect) {
    const items = function () { return Array.from(group.querySelectorAll(itemSel)); };
    const select = function (el, focus) {
      items().forEach(function (i) { const on = i === el; i.setAttribute(attr, String(on)); i.tabIndex = on ? 0 : -1; });
      if (focus) el.focus();
      if (onSelect) onSelect(el);
    };
    group.addEventListener('click', function (e) { const el = e.target.closest(itemSel); if (el) select(el, false); });
    group.addEventListener('keydown', function (e) {
      const list = items(), i = list.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % list.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + list.length) % list.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = list.length - 1;
      if (n >= 0) { e.preventDefault(); select(list[n], true); }
    });
    const cur = items().find(function (i) { return i.getAttribute(attr) === 'true'; }) || items()[0];
    items().forEach(function (i) { i.tabIndex = i === cur ? 0 : -1; });
    return { select: function (el) { select(el, false); } };
  };

  /* Footer year ------------------------------------------------------------ */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
