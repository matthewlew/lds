// `@lew-ds/open-icons/sprite` — an inline sprite of only the glyphs an app draws.
// A subpath of its own, so the glyph table (about 180KB) is loaded only by code
// that builds a sprite, never by everything that resolves `spriteUrl`.

/**
 * The `<symbol>` elements for `names`, as in `icons.svg` (same ids, mask ids
 * already made unique). Throws on a name the set does not have.
 */
export declare function spriteSymbols(names: Iterable<string>): string;

/**
 * An `<svg>` sprite of only `names`, for putting in the page: masked glyphs
 * render only from an in-document sprite. Fixed and clipped out of view (not
 * `display:none`, which disables masks), with the id @lew-ds/lds's
 * `inlineIconSprite` uses. Throws on a name the set does not have.
 */
export declare function buildSprite(names: Iterable<string>, options?: { id?: string }): string;

/** The id `buildSprite` (and @lew-ds/lds's `inlineIconSprite`) gives the sprite. */
export declare const SPRITE_ID: 'open-icons-sprite';
/** The inline style that keeps an in-page sprite's masks rendering while it stays out of sight. */
export declare const SPRITE_STYLE: string;
