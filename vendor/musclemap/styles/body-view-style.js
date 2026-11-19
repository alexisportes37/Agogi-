export const STYLE_DEFAULT = {
  defaultFillColor: '#b6b6b6',
  headColor: '#b6b6b6',
  hairColor: '#444444',
  strokeColor: '#333333',
  strokeWidth: 0.5,
  highlightColor: '#00c853',
  highlightOpacity: 1,
  showShadow: false,
};

export const STYLE_MINIMAL = {
  ...STYLE_DEFAULT,
  strokeWidth: 0,
};

export const STYLE_NEON = {
  ...STYLE_DEFAULT,
  defaultFillColor: '#30363d',
  strokeColor: '#00e5ff',
  highlightColor: '#00e5ff',
};

export const STYLE_MEDICAL = {
  ...STYLE_DEFAULT,
  defaultFillColor: '#d8dfe5',
  strokeColor: '#64748b',
  highlightColor: '#ef4444',
};

export const STYLE_PRESETS = {
  default: STYLE_DEFAULT,
  minimal: STYLE_MINIMAL,
  neon: STYLE_NEON,
  medical: STYLE_MEDICAL,
};

export function resolveStyle(style = 'default') {
  if (typeof style === 'string') {
    return STYLE_PRESETS[style] ?? STYLE_DEFAULT;
  }

  return {
    ...STYLE_DEFAULT,
    ...(style ?? {}),
  };
}
