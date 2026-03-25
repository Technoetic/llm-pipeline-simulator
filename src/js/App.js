import '../css/variables.css';
import '../css/main.css';
import '../css/animations.css';
import '../css/visualizer.css';

import { StepManager } from './StepManager.js';
import { PipelineVisualizer } from './PipelineVisualizer.js';
import { AnimationController } from './AnimationController.js';
import { InteractionHandler } from './InteractionHandler.js';
import { StateManager } from './StateManager.js';

export class App {
  constructor() {
    this.stepManager = new StepManager();
    this.visualizer = new PipelineVisualizer('pipeline-svg');
    this.animator = new AnimationController('pipeline-svg');
    this.interaction = new InteractionHandler();
    this.state = new StateManager();
    this.currentStep = this.state.loadCurrentStep();
    this.isPlaying = false;
  }

  init() {
    this.loadStep(this.currentStep);
    this.interaction.setupListeners(this);
    this.updateSidebar();
    this.updateUI();
  }

  loadStep(stepNum) {
    const stepData = this.stepManager.getStepData(stepNum);
    if (!stepData) return;

    this.currentStep = stepNum;
    this.state.saveCurrentStep(stepNum);

    // 제목 업데이트
    const titleEl = document.getElementById('step-title');
    if (titleEl) titleEl.textContent = stepData.title;

    // 설명 업데이트
    const descTitle = document.getElementById('description-title');
    const descText = document.getElementById('description-text');
    if (descTitle) descTitle.textContent = stepData.content.heading || stepData.title;
    if (descText) descText.textContent = stepData.content.description || '';

    // 진행률 업데이트
    const progress = this.stepManager.getStepProgress(stepNum);
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = progress + '%';

    const currentStepEl = document.getElementById('current-step');
    if (currentStepEl) currentStepEl.textContent = stepNum;

    // placeholder 숨기기
    const placeholder = document.getElementById('visualizer-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    // SVG 시각화
    if (stepData.visualization && stepData.visualization.nodes && stepData.visualization.nodes.length > 0) {
      this.visualizer.render(stepData.visualization);
    } else {
      const svg = document.getElementById('pipeline-svg');
      if (svg) {
        const nodesG = svg.querySelector('#nodes-group');
        const edgesG = svg.querySelector('#edges-group');
        if (nodesG) nodesG.innerHTML = '';
        if (edgesG) edgesG.innerHTML = '';
        // 비시각화 단계: 큰 텍스트만 표시
        if (nodesG) {
          nodesG.innerHTML = '<text x="600" y="280" text-anchor="middle" fill="#f1f5f9" font-size="28" font-weight="bold">' +
            (stepData.content.keyPoint || stepData.title) +
            '</text><text x="600" y="330" text-anchor="middle" fill="#94a3b8" font-size="18">' +
            (stepData.content.analogy || '') + '</text>';
        }
      }
    }

    this.animator.reset();
    this.isPlaying = false;
    this.updateSidebar();
    this.updateUI();
  }

  updateSidebar() {
    document.querySelectorAll('.step-item').forEach(item => {
      const step = parseInt(item.dataset.step);
      item.classList.toggle('active', step === this.currentStep);
      item.classList.toggle('completed', step < this.currentStep);
    });
  }

  goToStep(stepNum) {
    const total = this.stepManager.getTotalSteps();
    if (stepNum >= 1 && stepNum <= total) {
      this.loadStep(stepNum);
    }
  }

  nextStep() {
    const next = this.stepManager.getNextStep(this.currentStep);
    if (next > this.currentStep) this.goToStep(next);
  }

  prevStep() {
    const prev = this.stepManager.getPrevStep(this.currentStep);
    if (prev < this.currentStep) this.goToStep(prev);
  }

  playAnimation() {
    this.animator.start();
    this.isPlaying = true;
    this.updateUI();
  }

  pauseAnimation() {
    this.animator.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  resetAnimation() {
    this.animator.reset();
    this.isPlaying = false;
    this.updateUI();
  }

  setAnimationSpeed(factor) {
    this.animator.setSpeed(factor);
  }

  updateUI() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');

    if (btnPrev) btnPrev.disabled = this.stepManager.isFirstStep(this.currentStep);
    if (btnNext) btnNext.disabled = this.stepManager.isLastStep(this.currentStep);
    if (btnPlay) btnPlay.style.display = this.isPlaying ? 'none' : 'inline-block';
    if (btnPause) btnPause.style.display = this.isPlaying ? 'inline-block' : 'none';
  }

  onNodeClick(nodeId) {
    this.interaction.onNodeClick(nodeId);
  }

  onNodeHover(nodeId, isEnter) {
    this.interaction.onNodeHover(nodeId, isEnter);
  }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.__app = app; // 디버그용
});
