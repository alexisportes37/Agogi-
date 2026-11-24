
export function parseColor(color) {
  if (typeof color !== "string") return null;

  const hex = color.trim().replace(/^#/, "");
  const full = hex.length === 3
    ? [...hex].map(c => c + c).join("")
    : hex;

  if (!/^[0-9a-f]{6}$/i.test(full)) return null;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

export function toCSSColor(color) {
  if (typeof color === "string") return color;
  if (!color) return "transparent";

  const { r, g, b, a = 1 } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function interpolateColor(start, end, t) {
  const a = parseColor(start);
  const b = parseColor(end);
  if (!a || !b) return start;

  const amount = Math.max(0, Math.min(1, t));

  return toCSSColor({
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount)
  });
}

export const interpolateCSS = interpolateColor;
