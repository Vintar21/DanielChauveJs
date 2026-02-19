export function choose<T>(strings: Array<T>): T {
  return strings[Math.floor(Math.random() * strings.length)];
}

export function days(days: number): number {
  return hours(days * 24);
}

export function hours(hours: number): number {
  return minutes(hours * 60);
}

export function minutes(minutes: number): number {
  return seconds(minutes * 60);
}

export function seconds(seconds: number): number {
  return seconds * 1000;
}

export function pluralize(name: string, count: number): string {
  return count > 1 ? name + "s" : name;
}
