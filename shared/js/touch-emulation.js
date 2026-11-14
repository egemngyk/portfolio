/**
 * touch-emulation.js
 * Chrome DevTools mobile emulation benzeri touch simülasyonu.
 * ?touch=1 parametresiyle yüklendiğinde mouse olaylarını gerçek
 * TouchEvent'e dönüştürür; cursor ve scrollbar'ı gizler.
 */
(function () {
  'use strict';

  // ── Scrollbar & cursor gizle ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }
    ::-webkit-scrollbar { display: none !important; }
    html, body {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
  `;
  document.head.appendChild(style);

  // ── Mouse → Touch dönüştürücü ────────────────────────────────────────────
  let isPointerDown = false;

  function createTouch(type, e) {
    const target = document.elementFromPoint(e.clientX, e.clientY) || e.target;
    const touch = new Touch({
      identifier: 1,
      target,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pageX: e.pageX,
      pageY: e.pageY,
      radiusX: 11.5,
      radiusY: 11.5,
      rotationAngle: 0,
      force: 1,
    });

    const touchEvent = new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: type === 'touchend' ? [] : [touch],
      targetTouches: type === 'touchend' ? [] : [touch],
      changedTouches: [touch],
    });

    return { target, touchEvent };
  }

  function dispatch(type, e) {
    const { target, touchEvent } = createTouch(type, e);
    const prevented = !target.dispatchEvent(touchEvent);
    if (prevented) e.preventDefault();
  }

  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 0) return;
      isPointerDown = true;
      dispatch('touchstart', e);
      e.preventDefault();
    },
    { capture: true, passive: false }
  );

  document.addEventListener(
    'mousemove',
    (e) => {
      if (!isPointerDown) return;
      dispatch('touchmove', e);
      e.preventDefault();
    },
    { capture: true, passive: false }
  );

  document.addEventListener(
    'mouseup',
    (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      dispatch('touchend', e);
      e.preventDefault();
    },
    { capture: true, passive: false }
  );

  // mouseup dışarıda olursa da sıfırla
  window.addEventListener('blur', () => {
    isPointerDown = false;
  });

  // Click olaylarını koru (touch → click akışı bozulmasin diye)
  document.addEventListener(
    'click',
    (e) => {
      // touch emulation kendi click'ini tetikler; native mouse click'i engelle
      e.stopImmediatePropagation();
    },
    { capture: true }
  );

  console.log('[TouchEmulation] Aktif — mouse olayları touch\'a dönüştürülüyor.');
})();

