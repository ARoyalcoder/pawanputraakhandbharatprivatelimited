'use client';

import { useSyncExternalStore } from 'react';

/** How long after the page has loaded heavy extras start when the visitor has not interacted. */
const FALLBACK_MS = 6000;
const EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

let ready = false;
let armed = false;
const subscribers = new Set<() => void>();

function fire() {
  if (ready) return;
  ready = true;
  EVENTS.forEach((type) => window.removeEventListener(type, fire));
  subscribers.forEach((notify) => notify());
}

function arm() {
  if (armed) return;
  armed = true;
  EVENTS.forEach((type) => window.addEventListener(type, fire, { passive: true }));
  const startTimer = () => window.setTimeout(fire, FALLBACK_MS);
  if (document.readyState === 'complete') startTimer();
  else window.addEventListener('load', startTimer, { once: true });
}

function subscribe(notify: () => void) {
  subscribers.add(notify);
  arm();
  return () => {
    subscribers.delete(notify);
  };
}

/**
 * False until the visitor first interacts with the page (or a few seconds after load), then true
 * for the rest of the session. Gate non-essential heavy code on it — the WebGL scenes and the
 * three.js bundle behind them — so it never competes with first paint and hydration.
 */
export function useDeferredStart(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false
  );
}
