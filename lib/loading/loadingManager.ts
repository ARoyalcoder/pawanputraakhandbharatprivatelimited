'use client';

import { LoadingState, LoadingPhase, QualityTier, NetworkStatus } from './loadingState';
import { announceIntroComplete, INTRO_SEEN_KEY, INTRO_SESSION_KEY } from '@/lib/animations/heroCue';

type Listener = (state: LoadingState) => void;

class LoadingManager {
  private state: LoadingState = {
    phase: 'idle',
    isFirstVisit: true,
    introCompleted: false,
    criticalAssetsLoaded: false,
    activeRouteLoading: false,
    qualityTier: 'HIGH',
    network: {
      online: true,
      saveData: false,
      effectiveType: '4g',
    },
  };

  private listeners = new Set<Listener>();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initClient();
    }
  }

  private initClient() {
    if (this.initialized) return;
    this.initialized = true;

    // Detect session and local visitor status
    let firstVisit = true;
    try {
      const sessionSeen = sessionStorage.getItem(INTRO_SESSION_KEY);
      const localSeen = localStorage.getItem(INTRO_SEEN_KEY);
      firstVisit = !sessionSeen && !localSeen;
    } catch {
      firstVisit = false;
    }

    // Detect network conditions
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const network: NetworkStatus = {
      online: navigator.onLine,
      saveData: !!nav.connection?.saveData,
      effectiveType: (nav.connection?.effectiveType as NetworkStatus['effectiveType']) || 'unknown',
    };

    this.state = {
      ...this.state,
      isFirstVisit: firstVisit,
      introCompleted: !firstVisit,
      network,
      phase: firstVisit ? 'initializing' : 'interactive',
    };

    // Listen to network changes
    window.addEventListener('online', () => this.updateNetwork({ online: true }));
    window.addEventListener('offline', () => this.updateNetwork({ online: false }));
  }

  public getState(): LoadingState {
    return { ...this.state };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('LoadingManager listener error:', err);
      }
    });
  }

  public setPhase(phase: LoadingPhase) {
    if (this.state.phase === phase) return;
    this.state.phase = phase;
    this.notify();
  }

  public setQualityTier(tier: QualityTier) {
    if (this.state.qualityTier === tier) return;
    this.state.qualityTier = tier;
    this.notify();
  }

  public setRouteLoading(isLoading: boolean) {
    if (this.state.activeRouteLoading === isLoading) return;
    this.state.activeRouteLoading = isLoading;
    this.notify();
  }

  public markCriticalAssetsLoaded() {
    if (this.state.criticalAssetsLoaded) return;
    this.state.criticalAssetsLoaded = true;
    if (this.state.phase === 'initializing') {
      this.setPhase('critical_ready');
    } else {
      this.notify();
    }
  }

  public completeIntro() {
    if (this.state.introCompleted) return;
    this.state.introCompleted = true;
    this.state.phase = 'interactive';

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      localStorage.setItem(INTRO_SEEN_KEY, 'true');
      sessionStorage.setItem('ppab_intro_completed', 'true');
    } catch {
      // Ignore private mode storage failure
    }

    announceIntroComplete();
    this.notify();
  }

  public updateNetwork(update: Partial<NetworkStatus>) {
    this.state.network = { ...this.state.network, ...update };
    this.notify();
  }
}

export const loadingManager = new LoadingManager();
