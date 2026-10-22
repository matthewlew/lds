import { codeField } from '../templates/code-field.js';

// Behaviour for the one-time-code field.
//
// The template paints the boxes; this is everything that happens after a
// keystroke — paste filling the whole code, backspace stepping back into the
// previous box, focus walking forward as digits land. None of it can be a
// string, which is exactly why it is here and not there.
//
//   const cf = mountCodeField(el, { length: 6, onChange: (code) => … })
//   cf.update({ verifying: true })
//   cf.dispose()
/**
 * What one input event in box `i` does to the code: `{ code, focus }`, or null
 * when nothing the box was given is a digit.
 *
 * Read from the event, not only from the box. Each box takes `length`
 * characters so a whole code can be pasted into one, which means a digit typed
 * into a FULL box leaves two there; the event's `data` says which one is new.
 * And a box emptied by Backspace or Delete is a deletion, not a non-digit —
 * the digits after it close up behind it.
 */
export function codeAfterInput(code, length, i, event, boxValue) {
  const kind = event.inputType || '';
  if (kind.startsWith('delete')) return { code: code.slice(0, i) + code.slice(i + 1), focus: i };
  if (kind === 'insertText' && event.data && event.data.length === 1) {
    if (!/\d/.test(event.data)) return null;
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = event.data;
    return { code: chars.join('').replace(/\D/g, '').slice(0, length), focus: i + 1 };
  }
  // A paste, or the browser filling a one-time code: every digit it brought,
  // from the first box.
  const typed = String(event.data ?? boxValue).replace(/\D/g, '');
  if (!typed) return null;
  if (typed.length === 1) {
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = typed;
    return { code: chars.join('').replace(/\D/g, '').slice(0, length), focus: i + 1 };
  }
  return { code: typed.slice(0, length), focus: typed.length };
}

export function mountCodeField(container, config = {}) {
  let cfg = { ...config };
  let code = String(cfg.value ?? '');
  const length = cfg.length ?? 6;

  const render = () => { container.innerHTML = codeField({ ...cfg, value: code }); };
  const cells = () => Array.from(container.querySelectorAll('.lds-field__code input'));

  // Writes the code back to the boxes rather than re-rendering: a re-render
  // would blow away the focused element mid-type.
  const commit = (next, focusIndex) => {
    code = String(next).replace(/\D/g, '').slice(0, length);
    const inputs = cells();
    inputs.forEach((el, i) => { el.value = code[i] || ''; });
    if (focusIndex !== undefined && inputs.length) {
      const target = inputs[Math.max(0, Math.min(focusIndex, inputs.length - 1))];
      if (target) target.focus();
    }
    if (cfg.onChange) cfg.onChange(code);
  };

  const onInput = (e) => {
    const el = e.target;
    if (!el.matches || !el.matches('.lds-field__code input')) return;
    const i = cells().indexOf(el);
    const next = codeAfterInput(code, length, i, e, el.value);
    // a non-digit was typed: put the box back rather than leaving the stray char
    if (next === null) { el.value = code[i] || ''; return; }
    commit(next.code, next.focus);
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Backspace') return;
    const el = e.target;
    if (!el.matches || !el.matches('.lds-field__code input')) return;
    const i = cells().indexOf(el);
    // backspace in an EMPTY box steps back and clears the previous one; in a
    // full box the browser's own delete runs, and onInput reads it as one.
    if (code[i] || i <= 0) return;
    e.preventDefault();
    commit(code.slice(0, i - 1), i - 1);
  };

  container.addEventListener('input', onInput);
  container.addEventListener('keydown', onKeyDown);
  render();

  return {
    /** The digits entered so far. */
    get value() { return code; },
    update(next = {}) {
      cfg = { ...cfg, ...next };
      if (next.value !== undefined) code = String(next.value);
      render();
    },
    dispose() {
      container.removeEventListener('input', onInput);
      container.removeEventListener('keydown', onKeyDown);
      container.innerHTML = '';
    },
  };
}
