
export function applyInterpolation(start, end, t) {
  const amount = Math.max(0, Math.min(1, t));
  return start + (end - start) * amount;
}
