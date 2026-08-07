/// <reference types="react" />

export * from './components/Avatar/Avatar';
export * from './components/Banner/Banner';
export * from './components/Button/Button';
export * from './components/ButtonGroup/ButtonGroup';
export * from './components/Card/Card';
export * from './components/Checkbox/Checkbox';
export * from './components/Chip/Chip';
export * from './components/CodeField/CodeField';
export * from './components/EmptyState/EmptyState';
export * from './components/Icon/Icon';
export * from './components/Inline/Inline';
export * from './components/Link/Link';
export * from './components/Menu/Menu';
export * from './components/Modal/Modal';
export * from './components/Nav/Nav';
export * from './components/Radio/Radio';
export * from './components/Row/Row';
export * from './components/SegmentedControl/SegmentedControl';
export * from './components/Select/Select';
export * from './components/Skeleton/Skeleton';
export * from './components/Table/Table';
export * from './components/Tabs/Tabs';
export * from './components/Tag/Tag';
export * from './components/TextField/TextField';
export * from './components/Textarea/Textarea';
export * from './components/Toast/Toast';
export * from './components/Toggle/Toggle';
export * from './components/Tooltip/Tooltip';

/** [name, dial code, ISO 3166-1 alpha-2] for every ITU dial code. */
export declare const DIAL_CODES: ReadonlyArray<readonly [string, string, string]>;

export interface DialOption {
  /** The dial code, e.g. "+1". */
  value: string;
  /** "+1 US" — the code plus the ISO code, which is what keeps a closed
   *  `<select>` at the width of its own content rather than its widest country
   *  name, and disambiguates the twenty countries sharing +1. */
  label: string;
  name: string;
}
/** Splits the list into a short priority group and everything else, for a
 *  two-`<optgroup>` select. */
export declare function dialOptions(priority?: string[]): {
  top: DialOption[];
  rest: DialOption[];
};

/**
 * Point every component at a different copy of the icon sprite. Call once at
 * startup, before anything renders. Defaults to the sprite inside
 * `@lew/open-icons`.
 */
export declare function setIconSprite(url: string): void;
/** The sprite URL components currently resolve against. */
export declare function getIconSprite(): string;
/** Resolves a component's `iconHref` prop against the configured default. */
export declare function resolveSprite(iconHref?: string | null): string;
