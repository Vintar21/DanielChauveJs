export const SPACE: string = " ";
export const EMPTY: string = "";
export const SLASH: string = "/";
export const PIPE: string = "|";
export const DOT: string = ".";
export const EXCLAMATION_POINT: string = "!";
export const INTERROGATION_POINT: string = "?";
export const SEMI_COLUMN: string = ";";
export const COLUMN: string = ":";
export const COMMA: string = ",";
export const PLUS: string = "+";
export const MINUS: string = "-";
export const AT: string = "@";
export const START_REGEX: string = "^";
export const SPACED_COMMA: string = COMMA + SPACE;
export const NEW_LINE: string = "\r\n";
export const TWITCH_CHANNEL_PREFIX: string = "https://www.twitch.tv/";

export const END_PUNCTUATIONS: string[] = [
  DOT,
  EXCLAMATION_POINT,
  INTERROGATION_POINT,
];
export const LIGHT_PUNCTUATIONS: string[] = [COMMA, SEMI_COLUMN, COLUMN];
export const ALL_PUNCTUATIONS: string[] =
  END_PUNCTUATIONS.concat(LIGHT_PUNCTUATIONS);

export type FontColor = number;
export const FontColors = Object.freeze({
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  WHITE: 37,
  DEFAULT: 37,
});

export type BackgroundColor = number;
export const BackgroundColors = Object.freeze({
  BLACK: 40,
  RED: 41,
  GREEN: 42,
  YELLOW: 43,
  BLUE: 44,
  MAGENTA: 45,
  CYAN: 46,
  WHITE: 47,
  DEFAULT: 40,
});
