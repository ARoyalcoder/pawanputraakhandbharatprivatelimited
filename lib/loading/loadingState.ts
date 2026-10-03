export type LoadingPhase = 'idle' | 'initializing' | 'critical_ready' | 'interactive' | 'complete';

export type AssetPriority = 1 | 2 | 3 | 4;

export type QualityTier = 'HIGH' | 'MEDIUM' | 'LOW' | 'OFF';

export interface NetworkStatus {
  online: boolean;
  saveData: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
}

export interface LoadingState {
  phase: LoadingPhase;
  isFirstVisit: boolean;
  introCompleted: boolean;
  criticalAssetsLoaded: boolean;
  activeRouteLoading: boolean;
  qualityTier: QualityTier;
  network: NetworkStatus;
}
