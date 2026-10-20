// @lew-ds/lds — the Lew Design System, as plain HTML.
//
// A component is `(props) => string`, where the string is HTML. The five that
// hold state also ship a controller. Nothing here needs a framework or a build
// step.
export * from './templates/index.js';
export * from './controllers/index.js';

/** Points every component at a different sprite. */
export declare function setIconSprite(url: string): void;
export declare function getIconSprite(): string;
/** The sprite a component should use: the argument, or the configured default. */
export declare function resolveSprite(iconHref?: string | null): string;
/**
 * Puts the sprite markup into the document and points every component at it.
 * Needed in Chromium for the 53 glyphs that use a mask (warning-fill,
 * close-circle-fill, copy…): it does not apply a mask through an external
 * `<use href="icons.svg#id">`, so they draw nothing.
 */
export declare function inlineIconSprite(markup: string, doc?: Document): void;
/** Fetches the sprite (default: the current one) and inlines it. */
export declare function loadIconSprite(url?: string, doc?: Document): Promise<void>;

/** The glyph each status resolves to. Shared by Banner, Inline and Toast. */
export declare const STATUS_ICON: Readonly<Record<string, string>>;

/** The palette hue a name always resolves to. Stable across apps and reloads. */
export declare function hueForName(name: string): string;
/** First and last initial — first only when the name is a single word. */
export declare function initialsForName(name: string): string;

/** `[country, dialCode, isoCode]`. */
export type DialCode = [string, string, string];
export declare const DIAL_CODES: DialCode[];

export interface DialOption {
  /** The dial code, e.g. "+44". */
  value: string;
  /** What the closed control shows, e.g. "+44 GB". */
  label: string;
  /** The country, for the optgroup label. */
  name: string;
}
/**
 * DIAL_CODES split into the common countries and the rest, shaped for `select`.
 * The country name belongs in the optgroup, not the option: a native select
 * shows group labels only in the open list, so the box stays "+49 DE" wide.
 */
export declare function dialOptions(priority?: string[]): { top: DialOption[]; rest: DialOption[] };
