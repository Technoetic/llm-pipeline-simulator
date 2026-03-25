/**
 * StateManager.js
 * localStorage를 통한 상태 저장/복구
 */

export class StateManager {
  constructor() {
    this.storageKey = 'llm-pipeline-tutorial-state';
  }

  saveCurrentStep(stepNum) {
    const state = this.loadState();
    state.currentStep = stepNum;
    state.timestamp = Date.now();
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  loadCurrentStep() {
    const state = this.loadState();
    return state.currentStep || 1;
  }

  saveAnimationState(isPlaying, speed, currentTime) {
    const state = this.loadState();
    state.animationState = { isPlaying, speed, currentTime };
    state.timestamp = Date.now();
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  loadAnimationState() {
    const state = this.loadState();
    return state.animationState || { isPlaying: false, speed: 1, currentTime: 0 };
  }

  clearState() {
    localStorage.removeItem(this.storageKey);
  }

  getLastVisitTime() {
    const state = this.loadState();
    return state.timestamp || null;
  }

  loadState() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return {
        currentStep: 1,
        animationState: { isPlaying: false, speed: 1, currentTime: 0 },
        timestamp: Date.now(),
        version: '1.0',
      };
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return this.getDefaultState();
    }
  }

  getDefaultState() {
    return {
      currentStep: 1,
      animationState: { isPlaying: false, speed: 1, currentTime: 0 },
      timestamp: Date.now(),
      version: '1.0',
    };
  }
}

export default StateManager;
