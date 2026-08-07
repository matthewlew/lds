// Framework-free bindings: pure functions returning HTML strings.
//
// Same class names, same status map, same sprite resolver as the React
// components — and `npm test` asserts the two emit identical markup, so an app
// with no build step gets the same component rather than a lookalike.
export { banner } from './banner.js';
export { escapeHtml, raw, slot } from './escape.js';
