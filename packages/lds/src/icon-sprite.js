import { spriteUrl } from '@lew-ds/open-icons';

// Where components look for the icon sprite.
//
// The prototypes hardcoded a relative `icons.svg`, which only resolves when the
// page sits next to the file. An installed package cannot assume that, so the
// default is the sprite's resolved URL inside @lew-ds/open-icons and an app can
// repoint it once if it serves the file from somewhere else.
//
// Read through a getter rather than captured as a default parameter: a default
// is evaluated when the module is loaded, so a component would freeze whatever
// the value was at import time and ignore a later `setIconSprite`.
let sprite = spriteUrl;

/**
 * Point every component at a different copy of the sprite — e.g. one served
 * from your own CDN. Call once at startup, before anything renders.
 */
export function setIconSprite(url) {
  sprite = url;
}

/** The sprite URL components currently resolve against. */
export function getIconSprite() {
  return sprite;
}

/** Resolves a component's `iconHref` prop against the configured default. */
export function resolveSprite(iconHref) {
  return iconHref === undefined || iconHref === null ? sprite : iconHref;
}

// ---- Inlining ---------------------------------------------------------------
//
// 53 of the 174 glyphs cut a moat or a detail out of their shape with an SVG
// <mask> — warning-fill and close-circle-fill among them, and outline glyphs
// such as copy, download and eye-off. Chromium does not apply a mask to
// content that <use> clones from ANOTHER file, wherever in that file the mask
// sits, so `<use href="icons.svg#warning-fill">` draws nothing at all. Those
// are the glyphs Banner, Inline and Toast use for warning and error: in Chrome
// the blocking statuses rendered with no icon.
//
// Referenced inside the document the same symbols render correctly, so the fix
// that keeps the geometry exactly as drawn is to put the sprite in the page.
// It stays at full size and is clipped out of view rather than hidden: a mask
// inside a display:none, visibility:hidden or zero-size <svg> does not render
// either. Fixed and clipped, it takes no layout and cannot cause a scrollbar in
// either writing direction.

const INLINE_ID = 'open-icons-sprite';
// Documents with an insert still waiting on DOMContentLoaded, so a second call
// made from <head> does not queue a second sprite.
const pending = new WeakSet();

/**
 * Put the sprite markup into the document and point every component at it.
 * Call once at startup, before rendering; icons already in the document that
 * point at the previous sprite URL are repointed too.
 */
export function inlineIconSprite(markup, doc = globalThis.document) {
  if (!doc) throw new Error('inlineIconSprite needs a document');
  if (!doc.getElementById(INLINE_ID) && !pending.has(doc)) {
    const host = doc.createElement('div');
    host.innerHTML = String(markup).trim();
    const svg = host.querySelector('svg');
    if (!svg) throw new Error('inlineIconSprite: the markup contains no <svg>');
    svg.id = INLINE_ID;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('data-icon-sprite', '');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('style', 'position:fixed;top:0;left:0;overflow:hidden;clip-path:inset(50%);pointer-events:none');
    // A script in <head> runs before <body> exists; the <use> references
    // resolve as soon as the sprite lands, so waiting for the body is safe.
    if (doc.body) doc.body.prepend(svg);
    else {
      pending.add(doc);
      doc.addEventListener('DOMContentLoaded', () => { doc.body.prepend(svg); pending.delete(doc); }, { once: true });
    }
  }
  const previous = sprite;
  sprite = '';
  if (previous) {
    for (const use of doc.querySelectorAll('use')) {
      const href = use.getAttribute('href');
      if (href && href.startsWith(`${previous}#`)) use.setAttribute('href', href.slice(previous.length));
    }
  }
}

/**
 * Fetch the sprite (by default, the one components currently resolve against)
 * and inline it. Resolves once it is in the document.
 */
export async function loadIconSprite(url = sprite, doc = globalThis.document) {
  if (doc && (doc.getElementById(INLINE_ID) || pending.has(doc))) return;
  // '' is what components resolve against once a sprite is inlined; fetching it
  // would fetch the page itself.
  if (!url) throw new Error('loadIconSprite needs the sprite URL');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`loadIconSprite: ${url} answered ${res.status}`);
  inlineIconSprite(await res.text(), doc);
}
