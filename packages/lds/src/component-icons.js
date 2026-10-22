import { STATUS_ICON } from './status-icons.js';

// The glyphs components draw without being asked for them by name: a dismiss
// button's close, a row's chevron and check, an avatar's fallback person, and
// the status map Banner, Inline and Toast draw from.
//
// An app that inlines only the glyphs it uses (`buildSprite` in
// @lew-ds/open-icons/sprite) needs these as well as its own, or a banner's
// error icon is a blank square. css-test holds this list to what the templates
// actually reference, so it cannot fall behind them.
export const COMPONENT_ICONS = Object.freeze([...new Set([
  'check', 'chevron-left', 'chevron-right', 'close', 'person',
  ...Object.values(STATUS_ICON),
])].sort());
