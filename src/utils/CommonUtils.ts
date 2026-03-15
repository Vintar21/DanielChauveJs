import {
  ALL_PUNCTUATIONS,
  BackgroundColor,
  COMMA,
  EMPTY,
  END_PUNCTUATIONS,
  FontColor,
  LIGHT_PUNCTUATIONS,
  SPACE,
  STRING_TYPE,
} from "./StringConstants";

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

export function getFormattedDate(): string {
  const date = new Date();
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}.${date.getMilliseconds()}`;
}

export function colorMessage(
  message: string,
  color: FontColor | BackgroundColor,
): string {
  return `\x1b[${color}m ${message} \x1b[0m`;
}

export function log(message: any, color?: FontColor | BackgroundColor): void {
  if (color) {
    console.log(
      `[${getFormattedDate()}] ${colorMessage(message?.toString(), color)}`,
    );
  } else {
    console.log(`[${getFormattedDate()}] ${message?.toString()}`);
  }
}

export function warn(message: any, color?: FontColor | BackgroundColor): void {
  if (color) {
    console.warn(
      `[${getFormattedDate()}] ${colorMessage(message?.toString(), color)}`,
    );
  } else {
    console.warn(`[${getFormattedDate()}] ${message?.toString()}`);
  }
}

export function error(message: any, color?: FontColor | BackgroundColor): void {
  if (color) {
    console.error(
      `[${getFormattedDate()}] ${colorMessage(message?.toString(), color)}`,
    );
  } else {
    console.error(`[${getFormattedDate()}] ${message?.toString()}`);
  }
}

export function capitalizeFirst(input: String): String {
  input = input.trim();
  if (input.length <= 1) {
    return input.toUpperCase();
  }
  return input[0].toUpperCase() + input.slice(1);
}

export function lowerFirst(input: String): String {
  input = input.trim();
  if (input.length <= 1) {
    return input.toLowerCase();
  }
  return input[0].toLowerCase() + input.slice(1);
}

export function isString(object: any): boolean {
  return object instanceof String || typeof object === STRING_TYPE;
}

// Not used
export function concatTextWithPunctuation(
  firstPart: String,
  secondPart: String,
): String {
  firstPart = firstPart.trim();
  secondPart = secondPart.trim();
  if (firstPart.length === 0 && secondPart.length === 0) {
    return EMPTY;
  } else if (firstPart.length === 0) {
    if (ALL_PUNCTUATIONS.includes(secondPart[0])) {
      secondPart = secondPart.slice(1);
    }
    secondPart = capitalizeFirst(secondPart);
  } else if (secondPart.length === 0) {
    return capitalizeFirst(firstPart);
  } else {
    firstPart = capitalizeFirst(firstPart);
    const lastFirstPartChar = firstPart[firstPart.length - 1];
    if (END_PUNCTUATIONS.includes(lastFirstPartChar)) {
      secondPart = capitalizeFirst(secondPart);
    } else if (LIGHT_PUNCTUATIONS.includes(lastFirstPartChar)) {
      secondPart = lowerFirst(secondPart);
    } else {
      firstPart += COMMA;
    }
    return firstPart + SPACE + secondPart;
  }
}
