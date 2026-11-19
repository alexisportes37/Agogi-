/**
 * MuscleMapJS — Public API Entry Point
 *
 * Import everything from this file:
 *   import { MuscleMapWidget, ALL_MUSCLES, ... } from './MuscleMapJS/src/index.js';
 */
// Main widget
export { MuscleMapWidget } from './widget/muscle-map-widget.js';
// Heatmap legend component
export { HeatmapLegend } from './widget/heatmap-legend.js';
// Muscle helpers
export { ALL_MUSCLES, BASE_MUSCLES, SUB_GROUP_MUSCLES, MUSCLE_DISPLAY_NAMES, getSubGroups, getParentGroup, isSubGroup, isCosmeticPart, isAlwaysVisibleSubGroup, } from './core/muscles.js';
// Style presets
export { STYLE_DEFAULT, STYLE_MINIMAL, STYLE_NEON, STYLE_MEDICAL, STYLE_PRESETS, resolveStyle, } from './styles/body-view-style.js';
// Heatmap
export { HeatmapColorScale, COLOR_SCALE_PRESETS, resolveColorScale } from './heatmap/color-scale.js';
export { applyInterpolation } from './heatmap/color-interpolation.js';
// Color utilities
export { parseColor, toCSSColor, interpolateColor, interpolateCSS } from './utils/color.js';
// i18n
export { setLocale, getLocale, getAvailableLocales, getMuscleName, getAllMuscleNames, getUIString, } from './i18n/locales.js';
