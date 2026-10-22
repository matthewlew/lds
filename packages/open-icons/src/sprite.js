// An inline sprite of just the glyphs an app draws.
//
// Masked glyphs (warning-fill, close-circle-fill, copy…) only render when the
// sprite is in the page: a browser does not apply a mask inside an SVG that
// `<use>` clones from another file. Inlining all of icons.svg puts 174 symbols,
// about 180KB, into every page; an app drawing twenty of them needs about 15KB.
//
// So this builds the sprite from a list of names. The symbols are the ones
// icons.svg holds — same ids, same mask ids made unique per symbol, the `${u}`
// placeholder already substituted — so a `<use href="#warning-fill">` resolves
// the same whichever sprite is in the page.
import symbols from './symbols.js';

// What makes the sprite usable in the page rather than merely present. Hidden
// with display:none, visibility:hidden or a zero size, its masks do not render
// either; fixed and clipped, it takes no layout and draws nothing of its own.
// The id and attributes are the ones `inlineIconSprite` in @lew-ds/lds gives
// its sprite, so a page that already carries this one is not given a second.
export const SPRITE_ID = 'open-icons-sprite';
export const SPRITE_STYLE = 'position:fixed;top:0;left:0;overflow:hidden;clip-path:inset(50%);pointer-events:none';

/**
 * The `<symbol>` elements for `names`, in the order given, duplicates dropped.
 * Throws on a name the set does not have, rather than drawing a blank square.
 */
export function spriteSymbols(names) {
  const unique = [...new Set(names)];
  const unknown = unique.filter((name) => !Object.hasOwn(symbols, name));
  if (unknown.length) throw new Error(`@lew-ds/open-icons has no glyph named ${unknown.map((n) => `"${n}"`).join(', ')}`);
  return unique.map((name) => symbols[name]).join('');
}

/**
 * A complete `<svg>` sprite holding only `names`, ready to put in the page —
 * server-rendered into the document, or handed to @lew-ds/lds's
 * `inlineIconSprite`.
 */
export function buildSprite(names, { id = SPRITE_ID } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" aria-hidden="true" data-icon-sprite=""`
    + ` width="24" height="24" style="${SPRITE_STYLE}"><defs>${spriteSymbols(names)}</defs></svg>`;
}
