// Segmented control — a value picker, not navigation.
//
// Tabs change what you are looking at; this changes a property of what you are
// already looking at. They look alike, so the distinction lives here rather than
// in the author's head: this renders a radiogroup, which gives arrow-key movement
// and one tab stop for the whole group, and reports itself correctly. A row of
// buttons would need all of that written by hand.
export function SegmentedControl({
  options = [], value, defaultValue, onChange, name,
  size, full, iconsOnly, label, iconHref = 'icons.svg', className = '', ...rest
}) {
  const auto = React.useMemo(() => 'seg-' + Math.random().toString(36).slice(2, 8), []);
  const group = name || auto;
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const current = controlled ? value : inner;
  const cls = ['lds-seg',
    size ? `lds-seg--${size}` : '',
    full ? 'lds-seg--full' : '',
    iconsOnly ? 'lds-seg--icons' : '',
    className].filter(Boolean).join(' ');
  const pick = (v) => {
    if (!controlled) setInner(v);
    if (onChange) onChange(v);
  };
  return React.createElement('div', { className: cls, role: 'radiogroup', 'aria-label': label, ...rest },
    options.map((o) => {
      const opt = typeof o === 'string' ? { value: o, label: o } : o;
      return React.createElement('label', {
        key: opt.value,
        className: 'lds-seg__option',
        title: iconsOnly ? opt.label : undefined
      },
        React.createElement('input', {
          type: 'radio', name: group, value: opt.value,
          checked: current === opt.value, disabled: opt.disabled,
          onChange: () => pick(opt.value),
          'aria-label': iconsOnly ? opt.label : undefined
        }),
        opt.icon && React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
          React.createElement('use', { href: `${iconHref}#${opt.icon}` })),
        !iconsOnly && React.createElement('span', null, opt.label));
    }));
}