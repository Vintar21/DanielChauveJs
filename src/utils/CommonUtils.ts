export function choose<T>(strings: Array<T>): T {
  return strings[Math.floor(Math.random() * strings.length)];
}

export type Right = number;
export const BYPASS: Right = 1;
export const ALLOWED: Right = 0;
export const UNALLOWED: Right = -1;
export const DEFAULT_RIGHT: Right = ALLOWED;
