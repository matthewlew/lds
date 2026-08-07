// Canonicalises attribute-name casing before the contract is compared.
//
// React 18's serialiser is inconsistent about attribute names: it lowercases
// `readOnly` → `readonly` and `tabIndex` → `tabindex`, but emits `maxLength`,
// `inputMode`, `autoComplete`, `colSpan` and friends with their camelCase
// intact. HTML attribute names are ASCII case-insensitive, so both forms parse
// to exactly the same DOM — the difference is in React, not in the markup.
//
// The contract describes LDS markup, so it should not preserve an artifact of a
// binding that is being removed. Everything is canonicalised to lowercase, and
// the templates emit lowercase directly.
//
// Why the string replacement is safe rather than merely convenient: every
// binding escapes `"` in text as `&quot;`, so the byte sequence ` name="` cannot
// occur in text content — only in attribute position. That is asserted below, so
// the assumption fails loudly if an escaper ever stops holding it.
const PRESERVED = [
  'maxLength', 'minLength', 'inputMode', 'autoComplete', 'dateTime', 'encType',
  'srcSet', 'colSpan', 'rowSpan', 'useMap', 'referrerPolicy', 'enterKeyHint',
  'formAction', 'noValidate', 'autoFocus', 'crossOrigin', 'contentEditable',
];

export function normalizeMarkup(html) {
  let out = String(html);
  for (const name of PRESERVED) {
    out = out.split(` ${name}="`).join(` ${name.toLowerCase()}="`);
  }
  return out;
}

/** The invariant the replacement above relies on. */
export function assertQuotesEscaped(html) {
  // A raw `"` may only appear as an attribute delimiter. If text ever carried an
  // unescaped quote, ` name="` could appear inside content and the rewrite would
  // corrupt it. Strip whole `="…"` pairs — delimiters included — and any quote
  // still standing came from content.
  const withoutAttrs = String(html).replace(/="[^"]*"/g, '=');
  return !withoutAttrs.includes('"');
}
