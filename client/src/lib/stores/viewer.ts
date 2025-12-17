import { writable } from 'svelte/store';

export interface ViewerState {
  modelLoading: boolean;
  modelProgress: number;
  lightRotation: number;
  autoRotate: boolean;
  showGrid: boolean;
  showStats: boolean;
  environmentPreset: 'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse';
}

function createViewerStore() {
  const { subscribe, set, update } = writable<ViewerState>({
    modelLoading: false,
    modelProgress: 0,
    lightRotation: 0,
    autoRotate: true,
    showGrid: true,
    showStats: false,
    environmentPreset: 'studio',
  });

  return {
    subscribe,
    
    setModelLoading(loading: boolean, progress: number = 0) {
      update(state => ({ ...state, modelLoading: loading, modelProgress: progress }));
    },

    setLightRotation(rotation: number) {
      update(state => ({ ...state, lightRotation: rotation }));
    },

    toggleAutoRotate() {
      update(state => ({ ...state, autoRotate: !state.autoRotate }));
    },

    toggleGrid() {
      update(state => ({ ...state, showGrid: !state.showGrid }));
    },

    toggleStats() {
      update(state => ({ ...state, showStats: !state.showStats }));
    },

    setEnvironment(preset: ViewerState['environmentPreset']) {
      update(state => ({ ...state, environmentPreset: preset }));
    },

    reset() {
      set({
        modelLoading: false,
        modelProgress: 0,
        lightRotation: 0,
        autoRotate: true,
        showGrid: true,
        showStats: false,
        environmentPreset: 'studio',
      });
    }
  };
}

export const viewerStore = createViewerStore();


