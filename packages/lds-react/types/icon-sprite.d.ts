import type { JSX } from 'react';

export interface IconSpriteProps {
  /** The glyphs this page draws, added to `COMPONENT_ICONS` (which components draw on their own). */
  icons?: readonly string[];
  /** Inline every glyph in the set instead (about 180KB). */
  all?: boolean;
}
/**
 * The page's glyphs as one inline sprite, for `<use href="#name">`. Render once,
 * near the root. Throws on a name @lew-ds/open-icons does not have.
 */
export declare function IconSprite(props: IconSpriteProps): JSX.Element;
