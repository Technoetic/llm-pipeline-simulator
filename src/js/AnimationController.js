export class AnimationController {
  constructor(svgElementId) {
    this.svg = document.getElementById(svgElementId);
    this.animationFrameId = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.speed = 1;
    this.currentTime = 0;
    this.totalDuration = 5000;
    this.animatingEdges = [];
    this.lastTimestamp = 0;
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.lastTimestamp = 0;
    this._tick(0);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isPlaying) {
      this.start();
    } else {
      this.isPaused = false;
      this.lastTimestamp = 0;
    }
  }

  reset() {
    this.currentTime = 0;
    this.isPaused = false;
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setSpeed(factor) {
    this.speed = factor || 1;
  }

  _tick(timestamp) {
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
    }

    if (!this.isPaused && this.isPlaying) {
      const elapsed = timestamp - this.lastTimestamp;
      this.currentTime += elapsed * this.speed;
      this.lastTimestamp = timestamp;

      if (this.currentTime >= this.totalDuration) {
        this.currentTime = this.totalDuration;
        this.isPlaying = false;
      }
    }

    if (this.isPlaying && !this.isPaused) {
      this.animationFrameId = requestAnimationFrame(t => this._tick(t));
    }
  }

  _updateEdgeAnimation(edge) {
    const progress = Math.min(this.currentTime / this.totalDuration, 1);
    const dotElement = this.svg.querySelector('.animated-dot-' + edge.id);
    if (dotElement) {
      dotElement.style.opacity = progress < 1 ? '1' : '0';
    }
  }

  _drawAnimatingDot(edge, progress) {
  }

  setAnimatingEdges(edges) {
    this.animatingEdges = edges || [];
  }

  getProgress() {
    return Math.min(this.currentTime / this.totalDuration, 1);
  }
}

export default AnimationController;
