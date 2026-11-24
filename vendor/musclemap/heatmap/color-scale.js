// AGOGI MuscleMap — Heatmap color scales

export const COLOR_SCALE_PRESETS = {
  default: ['#343a40', '#00c853', '#ffeb3b', '#ff5722'],
  green: ['#263238', '#00c853', '#69f0ae'],
  neon: ['#101820', '#00e5ff', '#00ff85', '#ffea00'],
  medical: ['#e5e7eb', '#60a5fa', '#2563eb', '#dc2626']
};

export class HeatmapColorScale {
  constructor(colors = COLOR_SCALE_PRESETS.default) {
    this.colors = Array.isArray(colors) ? colors : COLOR_SCALE_PRESETS.default;
  }

  getColor(value) {
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    const index = Math.min(
      this.colors.length - 1,
      Math.floor(v * this.colors.length)
    );
    return this.colors[index];
  }
}

export function resolveColorScale(preset = 'default') {
  if (preset instanceof HeatmapColorScale) return preset;
  if (Array.isArray(preset)) return new HeatmapColorScale(preset);
  return new HeatmapColorScale(
    COLOR_SCALE_PRESETS[preset] || COLOR_SCALE_PRESETS.default
  );
}
