export class InteractionHandler {
  constructor() {
    this.app = null;
    this.modalElement = null;
    this.activeTooltip = null;
  }

  setupListeners(app) {
    this.app = app;

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnReset = document.getElementById('btn-reset');
    const speedSelect = document.getElementById('speed-select');

    if (btnPrev) btnPrev.addEventListener('click', () => app.prevStep());
    if (btnNext) btnNext.addEventListener('click', () => app.nextStep());
    if (btnPlay) btnPlay.addEventListener('click', () => app.playAnimation());
    if (btnPause) btnPause.addEventListener('click', () => app.pauseAnimation());
    if (btnReset) btnReset.addEventListener('click', () => app.resetAnimation());
    if (speedSelect) speedSelect.addEventListener('change', (e) => app.setAnimationSpeed(parseFloat(e.target.value)));

    this._setupSvgNodeListeners();
  }

  _setupSvgNodeListeners() {
    const svg = document.getElementById('pipeline-svg');
    if (!svg) return;

    const nodes = svg.querySelectorAll('.pipeline-node');
    nodes.forEach(nodeElement => {
      nodeElement.addEventListener('click', (e) => {
        const nodeId = nodeElement.getAttribute('data-node-id');
        this.onNodeClick(nodeId);
        e.stopPropagation();
      });

      nodeElement.addEventListener('mouseenter', () => {
        const nodeId = nodeElement.getAttribute('data-node-id');
        this.onNodeHover(nodeId, true);
      });

      nodeElement.addEventListener('mouseleave', () => {
        const nodeId = nodeElement.getAttribute('data-node-id');
        this.onNodeHover(nodeId, false);
      });
    });

    svg.addEventListener('click', () => this.closeAllPopups());
  }

  onNodeClick(nodeId) {
    const nodeData = this.app.visualizer.getNodeById(nodeId);
    if (nodeData) {
      this._showModal(nodeData);
    }
  }

  onNodeHover(nodeId, isEnter) {
    if (isEnter) {
      this.app.visualizer.highlightNode(nodeId);
      const nodeData = this.app.visualizer.getNodeById(nodeId);
      if (nodeData) {
        this._showTooltip(nodeData);
      }
    } else {
      this.app.visualizer.unhighlightNode();
      this._hideTooltip();
    }
  }

  _showModal(nodeData) {
    this.closeAllPopups();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.zIndex = '1000';
    modal.style.maxWidth = '500px';

    const title = document.createElement('h3');
    title.textContent = nodeData.label || 'Node Info';
    title.style.margin = '0 0 10px 0';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.border = 'none';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '20px';
    closeBtn.addEventListener('click', () => this._hideModal());

    const content = document.createElement('p');
    content.textContent = nodeData.content || 'Node details';
    content.style.margin = '10px 0';

    modal.appendChild(title);
    modal.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
    this.modalElement = modal;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
    backdrop.style.zIndex = '999';
    backdrop.addEventListener('click', () => this._hideModal());
    document.body.appendChild(backdrop);
  }

  _hideModal() {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  _showTooltip(nodeData) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = nodeData.label || 'Node';
    tooltip.style.position = 'fixed';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '998';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.top = (event?.clientY || 0) + 10 + 'px';
    tooltip.style.left = (event?.clientX || 0) + 10 + 'px';
    document.body.appendChild(tooltip);
    this.activeTooltip = tooltip;
  }

  _hideTooltip() {
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  closeAllPopups() {
    this._hideModal();
    this._hideTooltip();
  }
}

export default InteractionHandler;
