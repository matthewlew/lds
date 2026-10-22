import { attrs, cx } from './attrs.js';
import { slot } from './escape.js';

// Two ways in. `columns` and `rows` cover a plain grid of data. Anything more —
// a `<th scope="row">` naming its row, an attribute on a row, a struck-through
// row — is composed markup: pass `<thead>`/`<tbody>` as `children` and the
// table paints it by the same descendant selectors.
export function table({ columns, rows = [], children, className = '', ...rest } = {}) {
  const inner = columns
    ? `<thead><tr>${columns.map((c) => `<th${attrs({ scope: 'col', className: c.className })}>${slot(c.label)}</th>`).join('')}</tr></thead>`
      + `<tbody>${rows.map((r) => `<tr>${columns.map((c) => `<td${attrs({ className: c.className })}>${slot(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody>`
    : children !== undefined ? slot(children)
      : '<thead><tr></tr></thead><tbody></tbody>';
  return `<table${attrs({ className: cx('lds-table', className), ...rest })}>${inner}</table>`;
}
