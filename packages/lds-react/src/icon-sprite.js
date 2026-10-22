// IconSprite: the glyphs a page draws, as one inline sprite. Render it once,
// near the root; every icon is then a `<use href="#name">` into it.
//
// Inline rather than `icons.svg` by URL, because the masked glyphs
// (warning-fill, close-circle-fill, copy…) draw nothing through an external
// file. Only the glyphs named — `COMPONENT_ICONS`, which components draw on
// their own, plus `icons` — so a page carries a few kilobytes rather than the
// whole 180KB set; `all` inlines every glyph.
//
// A subpath of its own, `@lew-ds/lds-react/icon-sprite`, so the glyph table is
// loaded where the sprite is rendered — on the server — and never in a client
// bundle that merely imports a Button.
import { COMPONENT_ICONS } from '@lew-ds/lds';
import { ICON_NAMES } from '@lew-ds/open-icons';
import { SPRITE_ID, spriteSymbols } from '@lew-ds/open-icons/sprite';

// Fixed and clipped, not display:none, which would disable the masks too.
const STYLE = {
  position: 'fixed', top: 0, left: 0, overflow: 'hidden', clipPath: 'inset(50%)', pointerEvents: 'none',
};

export function IconSprite({ icons = [], all = false }) {
  const names = all ? ICON_NAMES : [...COMPONENT_ICONS, ...icons];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" id={SPRITE_ID} aria-hidden="true" data-icon-sprite=""
      width="24" height="24" style={STYLE}
      // The glyphs are @lew-ds/open-icons' own markup, never user input.
      dangerouslySetInnerHTML={{ __html: `<defs>${spriteSymbols(names)}</defs>` }}
    />
  );
}
