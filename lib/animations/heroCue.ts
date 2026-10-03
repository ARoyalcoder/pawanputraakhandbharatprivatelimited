/**
 * Hand-over between the first-visit cinematic intro and the hero's 3D assembly, so the hero
 * plays its entrance once it is actually visible instead of behind the intro overlay.
 */
export const INTRO_COMPLETE_EVENT = 'ppab:intro-complete';
export const INTRO_SEEN_KEY = 'ppab_intro_v2';
export const INTRO_SESSION_KEY = 'ppab_intro_v2_session';

export function announceIntroComplete() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
  }
}

/** Calls `start` now if no intro is playing, otherwise when it completes (or after `maxWait` ms). */
export function whenIntroDone(start: () => void, maxWait = 2500): () => void {
  if (typeof window === 'undefined') {
    start();
    return () => undefined;
  }

  let introPending = false;
  try {
    const sessionSeen = sessionStorage.getItem(INTRO_SESSION_KEY);
    const localSeen = localStorage.getItem(INTRO_SEEN_KEY);
    introPending = !sessionSeen && !localSeen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    introPending = false;
  }

  if (!introPending) {
    start();
    return () => undefined;
  }

  const done = () => {
    window.clearTimeout(timer);
    window.removeEventListener(INTRO_COMPLETE_EVENT, done);
    start();
  };

  const timer = window.setTimeout(done, maxWait);
  window.addEventListener(INTRO_COMPLETE_EVENT, done);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener(INTRO_COMPLETE_EVENT, done);
  };
}
