export class HeatmapLegend {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'musclemap-heatmap-legend';

    this.element.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #b6b6b6;
    `;

    const label = document.createElement('span');
    label.textContent = 'Low';

    const gradient = document.createElement('div');
    gradient.style.cssText = `
      width: 140px;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(
        to right,
        #374151,
        #00c853,
        #facc15,
        #ef4444
      );
    `;

    const high = document.createElement('span');
    high.textContent = 'High';

    this.element.append(label, gradient, high);
    this.container.appendChild(this.element);
  }

  destroy() {
    this.element.remove();
  }
}
