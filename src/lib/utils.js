export const cx = (...parts) => parts.filter(Boolean).join(" ");
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
