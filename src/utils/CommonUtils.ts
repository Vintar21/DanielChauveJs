export function choose<T>(strings: Array<T>): T {
  return strings[Math.floor(Math.random() * strings.length)];
}

export function days(days: number): number {
  return hours(days * 24);
}

export function hours(
  hours: number,
  inMinutes: boolean = false,
  inSeconds: boolean = false,
): number {
  const mins = hours * 60;
  return inMinutes ? mins : minutes(mins, inSeconds);
}

export function minutes(minutes: number, inSeconds: boolean = false): number {
  const secs = minutes * 60;
  return inSeconds ? secs : seconds(secs);
}

export function seconds(seconds: number): number {
  return seconds * 1000;
}

export function pluralize(name: string, count: number): string {
  return count > 1 ? name + "s" : name;
}
