// Shared by every preview that renders an <Icon> or a component with an icon
// slot (Button, Chip, Menu, Tag, EmptyState, Row, ...).
//
// @lew/open-icons resolves its sprite URL via `import.meta.url`, which is
// meaningless once esbuild folds every module into one IIFE — it resolves
// against the *bundle's* URL, not the package's, so the default sprite href
// is wrong wherever this bundle is hosted (confirmed broken locally: Icon
// rendered with a correct, visible box and color but an empty use target).
//
// Pointing setIconSprite at a plain relative "../../../icons.svg" path
// doesn't fully fix it either: <use href="external.svg#id"> is a
// cross-document SVG fetch, and Chromium silently no-ops it unless the host
// serves that file with an SVG content-type — something this repo's local
// static server does NOT do (application/octet-stream), and something we
// can't verify claude.ai/design's static hosting does either. Sidestep the
// whole MIME dependency: fetch the sprite as plain text (works regardless of
// Content-Type) and inline its <symbol> defs into the current document once,
// then point every <use> at a same-document "#id" fragment.
let inlined: Promise<void> | null = null;

export function ensureInlineSprite(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('__lds_sprite')) return;
  if (inlined) return;
  inlined = fetch('../../../icons.svg')
    .then((r) => r.text())
    .then((svg) => {
      const host = document.createElement('div');
      host.id = '__lds_sprite';
      host.style.display = 'none';
      host.innerHTML = svg;
      document.body.appendChild(host);
    });
}
