import { BodyRenderer } from '../core/body-renderer.js';

export class MuscleMapWidget {
  constructor(container, options = {}) {
    this.container = container;
    this.gender = options.gender ?? 'male';
    this.side = options.side ?? 'front';
    this.multiSelect = options.multiSelect ?? true;
    this.selectedMuscles = new Set();
    this.highlights = new Map();
    this.listeners = new Map();

    this.style = {
      defaultFillColor: '#b6b6b6',
      headColor: '#b6b6b6',
      hairColor: '#444444',
      strokeColor: '#333333',
      strokeWidth: 1,
      selectionColor: '#00c853',
      selectionStrokeColor: '#ffffff',
      selectionStrokeWidth: 2,
      shadowRadius: 0,
      shadowColor: 'transparent',
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'manipulation';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.renderer = new BodyRenderer(
      this.gender,
      this.side,
      this.highlights,
      this.style,
      this.selectedMuscles,
      true
    );

    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const result = this.renderer.hitTest(
        this.ctx,
        event.clientX - rect.left,
        event.clientY - rect.top,
        rect.width,
        rect.height
      );

      if (!result) return;

      if (!this.multiSelect) this.selectedMuscles.clear();

      if (this.selectedMuscles.has(result.muscle)) {
        this.selectedMuscles.delete(result.muscle);
      } else {
        this.selectedMuscles.add(result.muscle);
      }

      this.render();
      this.emit('muscleClick', result.muscle, result.side);
    });

    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(this.container);
    this.render();
  }

  render() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.render(this.ctx, width, height, dpr);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
  }

  emit(event, ...args) {
    for (const callback of this.listeners.get(event) ?? []) {
      callback(...args);
    }
  }

  setGender(gender) {
    this.gender = gender;
    this.renderer.gender = gender;
    this.render();
  }

  setSide(side) {
    this.side = side;
    this.renderer.side = side;
    this.render();
  }

  getHighlightData() {
    return [...this.selectedMuscles].map(muscle => ({
      muscle,
      color: this.style.selectionColor,
      opacity: 1
    }));
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.canvas.remove();
  }
}
