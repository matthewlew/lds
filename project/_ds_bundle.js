/* @ds-bundle: {"format":4,"namespace":"LDSLewDesignSystem_1b8684","components":[{"name":"Avatar","sourcePath":"components/Avatar/Avatar.jsx"},{"name":"Banner","sourcePath":"components/Banner/Banner.jsx"},{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"ButtonGroup","sourcePath":"components/ButtonGroup/ButtonGroup.jsx"},{"name":"Card","sourcePath":"components/Card/Card.jsx"},{"name":"Checkbox","sourcePath":"components/Checkbox/Checkbox.jsx"},{"name":"Chip","sourcePath":"components/Chip/Chip.jsx"},{"name":"CodeField","sourcePath":"components/CodeField/CodeField.jsx"},{"name":"EmptyState","sourcePath":"components/EmptyState/EmptyState.jsx"},{"name":"Icon","sourcePath":"components/Icon/Icon.jsx"},{"name":"Inline","sourcePath":"components/Inline/Inline.jsx"},{"name":"Link","sourcePath":"components/Link/Link.jsx"},{"name":"Menu","sourcePath":"components/Menu/Menu.jsx"},{"name":"Modal","sourcePath":"components/Modal/Modal.jsx"},{"name":"Radio","sourcePath":"components/Radio/Radio.jsx"},{"name":"Row","sourcePath":"components/Row/Row.jsx"},{"name":"Select","sourcePath":"components/Select/Select.jsx"},{"name":"Skeleton","sourcePath":"components/Skeleton/Skeleton.jsx"},{"name":"Table","sourcePath":"components/Table/Table.jsx"},{"name":"Tabs","sourcePath":"components/Tabs/Tabs.jsx"},{"name":"Tag","sourcePath":"components/Tag/Tag.jsx"},{"name":"TextField","sourcePath":"components/TextField/TextField.jsx"},{"name":"DIAL_CODES","sourcePath":"components/TextField/dial-codes.js"},{"name":"Textarea","sourcePath":"components/Textarea/Textarea.jsx"},{"name":"Toggle","sourcePath":"components/Toggle/Toggle.jsx"}],"sourceHashes":{"components/Avatar/Avatar.jsx":"6489f0ecac1c","components/Banner/Banner.jsx":"44ee93ecb334","components/Button/Button.jsx":"ab0d5894c843","components/ButtonGroup/ButtonGroup.jsx":"1fb3f337ba39","components/Card/Card.jsx":"47b05696b1df","components/Checkbox/Checkbox.jsx":"2078b8bddeec","components/Chip/Chip.jsx":"aaf5aafb67e1","components/CodeField/CodeField.jsx":"0180d22f9fb4","components/EmptyState/EmptyState.jsx":"262253e0b862","components/Icon/Icon.jsx":"33ad28b15b04","components/Inline/Inline.jsx":"10d7f0495620","components/Link/Link.jsx":"4786478fb101","components/Menu/Menu.jsx":"20e2468db2fd","components/Modal/Modal.jsx":"4fab958306a0","components/Radio/Radio.jsx":"56fa1672a960","components/Row/Row.jsx":"eaa3830c747a","components/Select/Select.jsx":"c44e0ac8013c","components/Skeleton/Skeleton.jsx":"b6c3484373cf","components/Table/Table.jsx":"aa6f68302f4e","components/Tabs/Tabs.jsx":"7fa6901b67ac","components/Tag/Tag.jsx":"7ee5cb4b0987","components/TextField/TextField.jsx":"e2d16fc75f2c","components/TextField/dial-codes.js":"c422eba01ca6","components/Textarea/Textarea.jsx":"f34325d0c297","components/Toggle/Toggle.jsx":"c16ad535832e"},"inlinedExternals":[],"unexposedExports":[{"name":"dialOptions","sourcePath":"components/TextField/dial-codes.js"},{"name":"hueForName","sourcePath":"components/Avatar/Avatar.jsx"},{"name":"initialsForName","sourcePath":"components/Avatar/Avatar.jsx"}]} */

(() => {

const __ds_ns = (window.LDSLewDesignSystem_1b8684 = window.LDSLewDesignSystem_1b8684 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Avatar/Avatar.jsx
try { (() => {
// Avatar — initials, an image, or a person icon.
//
// The hue is DERIVED from the name, not passed in, so the same person is the
// same colour in every surface of every app without anyone storing a colour.
// It resolves to one of the palette's nine hues and paints emph-soft on it, so
// contrast is guaranteed by the ramp rather than checked per colour.
const HUES = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet', 'pink', 'gray'];
function hueForName(name) {
  const s = String(name || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003;
  return HUES[h % HUES.length];
}
function initialsForName(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const letters = words.map(w => (w.match(/\p{L}|\d/u) || [''])[0]);
  const picked = words.length === 1 ? letters[0] : letters[0] + letters[letters.length - 1];
  return picked.toUpperCase();
}
function Avatar({
  name,
  src,
  alt,
  size,
  hue,
  ring,
  iconHref = 'icons.svg',
  className = '',
  ...rest
}) {
  const initials = initialsForName(name);
  const resolvedHue = hue || hueForName(name || 'anon');
  const cls = ['lds-avatar', size ? `lds-avatar--${size}` : '', `hue-${resolvedHue}`, ring ? 'lds-avatar--ring' : '', className].filter(Boolean).join(' ');
  const label = alt || name || 'Person';
  let inner;
  if (src) inner = React.createElement('img', {
    src,
    alt: label
  });else if (initials) inner = initials;
  // no name to draw from — a person icon, never a random letter or an empty disc
  else inner = React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#person`
  }));
  return React.createElement('span', {
    className: cls,
    role: 'img',
    'aria-label': label,
    title: name || undefined,
    ...rest
  }, inner);
}
Object.assign(__ds_scope, { hueForName, initialsForName, Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Avatar/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/Banner/Banner.jsx
try { (() => {
// same status vocabulary as Tag/Inline: each status carries a fixed meaning icon
// from Open Icons, shown automatically unless the caller overrides with `icon`.
// The blocking statuses take the FILLED glyph: at 16-20px a filled triangle or
// disc reads as a stop signal at a glance, where the line version reads as
// another outline in a form full of outlines. Success and info stay line — they
// are confirmations, and a filled tick shouts louder than the news deserves.
const STATUS_ICON = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning-fill',
  caution: 'warning-fill',
  error: 'close-circle-fill'
};
function Banner({
  status,
  emphasis,
  page,
  title,
  icon,
  iconHref = 'icons.svg',
  children,
  actions,
  dismissible,
  onDismiss,
  className = '',
  ...rest
}) {
  const cls = ['lds-banner', status ? `lds-banner--${status}` : '', page ? 'lds-banner--page' : '', emphasis ? `emph-${emphasis}` : '', className].filter(Boolean).join(' ');
  const statusIcon = icon !== undefined ? icon : STATUS_ICON[status] && React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${STATUS_ICON[status]}`
  }));
  return React.createElement('div', {
    className: cls,
    'data-status': status || undefined,
    ...rest
  }, statusIcon, React.createElement('div', null, title && React.createElement('div', {
    className: 'lds-banner__title'
  }, title), children, actions && React.createElement('div', {
    className: 'lds-banner__actions'
  }, actions)), dismissible && React.createElement('button', {
    type: 'button',
    className: 'lds-banner__dismiss',
    'aria-label': 'Dismiss',
    onClick: onDismiss
  }, React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#close`
  }))));
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Banner/Banner.jsx", error: String((e && e.message) || e) }); }

// components/Button/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size,
  iconOnly,
  fab,
  extended,
  emphasis,
  hue,
  armed,
  iconStart,
  iconEnd,
  subtitle,
  iconHref = 'icons.svg',
  href,
  disabled,
  className = '',
  children,
  ...rest
}) {
  const stacked = subtitle !== undefined;
  const cls = ['lds-btn', variant ? `lds-btn--${variant}` : '', size === 'sm' ? 'lds-btn--sm' : size === 'lg' ? 'lds-btn--lg' : '', iconOnly || fab && !extended ? 'lds-btn--icon' : '', fab ? 'lds-btn--fab' : '', fab && extended ? 'lds-btn--extended' : '', stacked ? 'lds-btn--stacked' : '', emphasis ? `emph-${emphasis}` : '', hue ? `hue-${hue}` : '', armed ? 'is-armed' : '', className].filter(Boolean).join(' ');
  // an icon prop takes a sprite name or a node
  const mark = icon => icon === undefined || icon === null ? null : React.createElement('span', {
    className: 'lds-btn__icon'
  }, typeof icon === 'string' ? React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${icon}`
  })) : icon);
  const label = children === undefined ? null : React.createElement('span', {
    className: 'lds-btn__label'
  }, children);
  const body = [mark(iconStart), stacked ? React.createElement('span', {
    className: 'lds-btn__text'
  }, label, React.createElement('span', {
    className: 'lds-btn__subtitle'
  }, subtitle)) : label, mark(iconEnd)];
  // A link that must look like a button IS this button, rendered as an anchor —
  // same sizes, same paint. aria-disabled rather than disabled, which an <a>
  // does not support.
  if (href !== undefined) {
    return React.createElement('a', {
      className: cls,
      href: disabled ? undefined : href,
      role: 'button',
      'aria-disabled': disabled ? 'true' : undefined,
      'data-armed': armed ? '' : undefined,
      ...rest
    }, body);
  }
  return React.createElement('button', {
    className: cls,
    disabled,
    'data-armed': armed ? '' : undefined,
    ...rest
  }, body);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/ButtonGroup/ButtonGroup.jsx
try { (() => {
// The sanctioned action row. Three decisions, one place: direction, hug vs fill,
// and what happens on a phone. Order is meaningful — put the confirming action
// LAST; align="split" sends the first child (cancel / exit) to the opposite end.
//
// `detail` turns it into a conversion bar: the supporting text lives outside the
// button so the label stays a single verb.
function ButtonGroup({
  children,
  detail,
  detailNote,
  orientation = 'horizontal',
  width = 'hug',
  align = 'end',
  stackOnMobile = true,
  className = '',
  ...rest
}) {
  const conversion = detail !== undefined || detailNote !== undefined;
  const cls = ['lds-btn-group', orientation === 'vertical' ? 'lds-btn-group--vertical' : '', width === 'fill' ? 'lds-btn-group--fill' : '', conversion ? 'lds-btn-group--conversion' : `lds-btn-group--${align}`, !conversion && stackOnMobile && orientation !== 'vertical' ? 'lds-btn-group--stack' : '', className].filter(Boolean).join(' ');
  return React.createElement('div', {
    className: cls,
    role: 'group',
    ...rest
  }, conversion && React.createElement('div', {
    className: 'lds-btn-group__detail'
  }, detail && React.createElement('span', {
    className: 'lds-btn-group__detail-title'
  }, detail), detailNote && React.createElement('span', {
    className: 'lds-btn-group__detail-note'
  }, detailNote)), children);
}
Object.assign(__ds_scope, { ButtonGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ButtonGroup/ButtonGroup.jsx", error: String((e && e.message) || e) }); }

// components/Card/Card.jsx
try { (() => {
function Card({
  kicker,
  title,
  body,
  meta,
  actions,
  emphasis,
  hue,
  selectable,
  selected,
  disabled,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const cls = ['lds-card', selectable ? 'lds-card--selectable' : '', emphasis ? `emph-${emphasis}` : '', hue ? `hue-${hue}` : '', className].filter(Boolean).join(' ');
  const content = [kicker && React.createElement('div', {
    className: 'lds-card__kicker',
    key: 'k'
  }, kicker), title && React.createElement('div', {
    className: 'lds-card__title',
    key: 't'
  }, title), body && React.createElement('p', {
    className: 'lds-card__body',
    key: 'b'
  }, body), children, meta && React.createElement('div', {
    className: 'lds-card__divider lds-card__divider--meta',
    key: 'd'
  }), meta && React.createElement('div', {
    className: 'lds-card__meta',
    key: 'm'
  }, meta), actions && React.createElement('div', {
    className: 'lds-card__actions',
    key: 'a'
  }, actions)];
  // A selectable card is a real button, not a div with a click handler: that is
  // what gives it Space/Enter, a focus ring and a reported pressed state for
  // free. aria-pressed rather than aria-checked — the card is a toggle, and a
  // group of them is not necessarily exclusive.
  if (selectable) {
    return React.createElement('button', {
      type: 'button',
      className: cls,
      'aria-pressed': selected ? 'true' : 'false',
      'aria-disabled': disabled ? 'true' : undefined,
      disabled,
      onClick,
      ...rest
    }, content);
  }
  return React.createElement('div', {
    className: cls,
    ...rest
  }, content);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Card/Card.jsx", error: String((e && e.message) || e) }); }

// components/Checkbox/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  id,
  className = '',
  ...rest
}) {
  return React.createElement('label', {
    className: ['lds-check', className].filter(Boolean).join(' ')
  }, React.createElement('input', {
    type: 'checkbox',
    id,
    ...rest
  }), React.createElement('span', {
    className: 'lds-check__box'
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Checkbox/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/Chip/Chip.jsx
try { (() => {
function Chip({
  children,
  selected,
  size,
  icon,
  caret,
  onRemove,
  removeLabel = 'Remove',
  iconHref = 'icons.svg',
  onClick,
  className = '',
  ...rest
}) {
  const cls = ['lds-chip', size === 'sm' ? 'lds-chip--sm' : size === 'lg' ? 'lds-chip--lg' : '', selected ? 'lds-chip--selected' : '', className].filter(Boolean).join(' ');
  const content = [icon && React.createElement('span', {
    key: 'i',
    className: 'lds-chip__icon'
  }, icon), children, caret && React.createElement('span', {
    key: 'c',
    className: 'lds-chip__caret'
  }, caret), onRemove && React.createElement('button', {
    key: 'r',
    type: 'button',
    className: 'lds-chip__remove',
    'aria-label': removeLabel,
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#close`
  })))];
  // a removable chip is a static tag (e.g. an input's autofill token), not a
  // toggle: the remove button can't nest inside another <button>, so it
  // renders as a span. Pass onClick if the label itself is still actionable.
  if (onRemove) {
    return React.createElement('span', {
      className: cls,
      onClick,
      role: onClick ? 'button' : undefined,
      tabIndex: onClick ? 0 : undefined,
      'aria-pressed': selected !== undefined ? !!selected : undefined,
      ...rest
    }, content);
  }
  return React.createElement('button', {
    type: 'button',
    className: cls,
    'aria-pressed': !!selected,
    onClick,
    ...rest
  }, content);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Chip/Chip.jsx", error: String((e && e.message) || e) }); }

// components/CodeField/CodeField.jsx
try { (() => {
// One-time code (2FA). One box per digit, because the boxes are what tell the
// user how many to expect. Paste fills the whole code; backspace steps back.
function CodeField({
  label,
  help,
  error,
  success,
  verifying,
  length = 6,
  groupAfter,
  size,
  value,
  onChange,
  iconHref = 'icons.svg',
  className = '',
  ...rest
}) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', success ? 'lds-field--success' : '', className].filter(Boolean).join(' ');
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState('');
  const code = (controlled ? value : inner) || '';
  const refs = React.useRef([]);
  const commit = next => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    if (!controlled) setInner(clean);
    if (onChange) onChange(clean);
    return clean;
  };
  const onCell = i => e => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) {
      // paste
      const clean = commit(typed);
      const focus = Math.min(clean.length, length - 1);
      refs.current[focus] && refs.current[focus].focus();
      return;
    }
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = typed;
    commit(chars.join('').trimEnd());
    refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const onKey = i => e => {
    if (e.key === 'Backspace' && !code[i]) {
      const prev = refs.current[i - 1];
      if (prev) {
        prev.focus();
        commit(code.slice(0, i - 1));
      }
    }
  };
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (groupAfter && i === groupAfter) cells.push(React.createElement('span', {
      key: `g${i}`,
      className: 'lds-field__code-gap'
    }));
    cells.push(React.createElement('input', {
      key: i,
      ref: el => {
        refs.current[i] = el;
      },
      type: 'text',
      inputMode: 'numeric',
      autoComplete: i === 0 ? 'one-time-code' : 'off',
      maxLength: length,
      'aria-label': `Digit ${i + 1}`,
      // A verified or in-flight code is read-only rather than disabled: disabled
      // would drop the digits out of the tab order and stop a screen reader
      // announcing what was actually entered.
      readOnly: !!(success || verifying),
      value: code[i] || '',
      onChange: onCell(i),
      onKeyDown: onKey(i),
      ...rest
    }));
  }
  const mark = name => React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${name}`
  }));
  // role=status, so the verdict is announced when it arrives rather than only
  // being visible. This is the one field the user cannot self-check.
  const note = error ? React.createElement('span', {
    className: 'lds-field__error',
    role: 'alert'
  }, mark('close-circle-fill'), error) : success ? React.createElement('span', {
    className: 'lds-field__success',
    role: 'status'
  }, mark('check-circle'), success === true ? 'Verified' : success) : verifying ? React.createElement('span', {
    className: 'lds-field__help',
    role: 'status'
  }, verifying === true ? 'Checking\u2026' : verifying) : help ? React.createElement('span', {
    className: 'lds-field__help'
  }, help) : null;
  return React.createElement('div', {
    className: cls,
    'data-status': error ? 'error' : undefined
  }, label && React.createElement('label', null, label), React.createElement('div', {
    className: 'lds-field__code' + (size === 'sm' ? ' lds-field__code--sm' : '')
  }, cells), note);
}
Object.assign(__ds_scope, { CodeField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/CodeField/CodeField.jsx", error: String((e && e.message) || e) }); }

// components/EmptyState/EmptyState.jsx
try { (() => {
function EmptyState({
  icon,
  image,
  imageAlt = '',
  expressive,
  iconHref = 'icons.svg',
  title,
  body,
  actions,
  className = ''
}) {
  const cls = ['lds-empty', expressive ? 'lds-empty--expressive' : '', className].filter(Boolean).join(' ');
  // icon takes a sprite name or a node; image takes a src or a node. Either one
  // is the branding slot — an empty state has room for expression, so it is the
  // one place the system invites a real asset instead of a utility glyph.
  const mark = typeof icon === 'string' ? React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${icon}`
  })) : icon;
  const media = typeof image === 'string' ? React.createElement('img', {
    className: 'lds-empty__media',
    src: image,
    alt: imageAlt
  }) : image;
  return React.createElement('div', {
    className: cls
  }, media || mark, title && React.createElement('div', {
    className: 'lds-empty__title'
  }, title), body && React.createElement('p', {
    className: 'lds-empty__body'
  }, body), actions && React.createElement('div', {
    className: 'lds-empty__actions'
  }, actions));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/EmptyState/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/Icon/Icon.jsx
try { (() => {
function Icon({
  name,
  size,
  className = '',
  href = 'icons.svg',
  style,
  ...rest
}) {
  const s = size ? {
    width: size,
    height: size,
    ...style
  } : style;
  return React.createElement('svg', {
    className: `lds-icon ${className}`,
    style: s,
    ...rest
  }, React.createElement('use', {
    href: `${href}#${name}`
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/Inline/Inline.jsx
try { (() => {
// Status carries a fixed meaning icon from Open Icons — the same map Banner uses,
// with the blocking statuses on the FILLED glyph so they read as a stop signal,
// so an inline error and a banner error never disagree about what red means.
// Colour alone is not an accessible carrier, so the icon is shown by default.
const STATUS_ICON = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning-fill',
  caution: 'warning-fill',
  error: 'close-circle-fill'
};
function Inline({
  status,
  icon,
  iconHref = 'icons.svg',
  children,
  className = '',
  ...rest
}) {
  const cls = ['lds-inline', status ? `lds-inline--${status}` : '', className].filter(Boolean).join(' ');
  const mark = icon !== undefined ? icon : STATUS_ICON[status] && React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${STATUS_ICON[status]}`
  }));
  return React.createElement('span', {
    className: cls,
    'data-status': status || undefined,
    ...rest
  }, mark && React.createElement('span', {
    className: 'lds-inline__icon'
  }, mark), children);
}
Object.assign(__ds_scope, { Inline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Inline/Inline.jsx", error: String((e && e.message) || e) }); }

// components/Link/Link.jsx
try { (() => {
function Link({
  children,
  href,
  variant,
  iconEnd,
  iconHref = 'icons.svg',
  className = '',
  ...rest
}) {
  const cls = ['lds-link', variant === 'quiet' ? 'lds-link--quiet' : '', variant === 'standalone' ? 'lds-link--standalone' : '', className].filter(Boolean).join(' ');
  // a standalone link gets a trailing chevron by default — it is the affordance
  // that replaces the underline it drops.
  const mark = variant === 'standalone' && iconEnd !== null ? typeof iconEnd === 'string' || iconEnd === undefined ? React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${iconEnd || 'chevron-right'}`
  })) : iconEnd : null;
  return React.createElement('a', {
    className: cls,
    href,
    ...rest
  }, children, mark);
}
Object.assign(__ds_scope, { Link });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Link/Link.jsx", error: String((e && e.message) || e) }); }

// components/Menu/Menu.jsx
try { (() => {
function Menu({
  items = [],
  className = ''
}) {
  return React.createElement('div', {
    className: ['lds-menu', className].filter(Boolean).join(' ')
  }, items.map((it, i) => it.separator ? React.createElement('hr', {
    key: i,
    className: 'lds-menu__separator'
  }) : React.createElement('button', {
    key: i,
    type: 'button',
    className: 'lds-menu__item' + (it.danger ? ' lds-menu__item--danger' : ''),
    disabled: it.disabled,
    onClick: it.onClick
  }, it.icon, React.createElement('span', {
    className: 'lds-menu__label'
  }, it.label), it.hint && React.createElement('span', {
    className: 'lds-menu__hint'
  }, it.hint))));
}
Object.assign(__ds_scope, { Menu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Menu/Menu.jsx", error: String((e && e.message) || e) }); }

// components/Modal/Modal.jsx
try { (() => {
function Modal({
  title,
  children,
  actions,
  cancel,
  onClose,
  onBack,
  size,
  sheet,
  side,
  largeTitle = true,
  iconHref = 'icons.svg',
  className = ''
}) {
  const cls = ['lds-modal', size ? `lds-modal--${size}` : '', sheet ? 'lds-modal--sheet' : '', side ? 'lds-modal--side' : '', className].filter(Boolean).join(' ');
  const sprite = name => React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${name}`
  }));
  // The footer is a button group, not a bespoke flex row. With a cancel present
  // it splits: cancel to the opposite end, confirm last in source and so at the
  // end of the reading direction — and on a phone the group stacks, confirm on
  // top. Cancel is never a peer sitting next to confirm.
  const groupCls = ['lds-btn-group', 'lds-btn-group--stack', cancel ? 'lds-btn-group--split' : 'lds-btn-group--end'].join(' ');
  const footer = (cancel || actions) && React.createElement('div', {
    className: 'lds-modal__actions'
  }, React.createElement('div', {
    className: groupCls,
    role: 'group'
  }, cancel, actions));
  return React.createElement('div', {
    className: 'lds-modal-scrim'
  }, React.createElement('div', {
    className: cls
  }, (sheet || side) && React.createElement('div', {
    className: 'lds-modal__handle'
  }), React.createElement('div', {
    className: 'lds-modal__header'
  },
  // back pops ONE level of a stacked flow; close dismisses the whole stack.
  onBack && React.createElement('button', {
    type: 'button',
    className: 'lds-modal__back',
    'aria-label': 'Back',
    onClick: onBack
  }, sprite('chevron-left')), title && React.createElement('div', {
    className: 'lds-modal__title'
  }, title), React.createElement('button', {
    type: 'button',
    className: 'lds-modal__close',
    'aria-label': 'Close',
    onClick: onClose
  }, sprite('close'))), React.createElement('div', {
    className: 'lds-modal__body'
  },
  // The large title sits at the TOP OF THE SCROLL REGION, directly above the
  // body copy, so title and content read as one block. It leaves on its own
  // as the body scrolls; the bar title fades in behind it and the header's
  // divider appears only once content has passed under the bar.
  largeTitle && title && React.createElement('h2', {
    className: 'lds-modal__title lds-modal__title--large'
  }, title), children), footer));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Modal/Modal.jsx", error: String((e && e.message) || e) }); }

// components/Radio/Radio.jsx
try { (() => {
function Radio({
  label,
  id,
  name,
  className = '',
  ...rest
}) {
  return React.createElement('label', {
    className: ['lds-check', 'lds-check--radio', className].filter(Boolean).join(' ')
  }, React.createElement('input', {
    type: 'radio',
    id,
    name,
    ...rest
  }), React.createElement('span', {
    className: 'lds-check__box'
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Radio/Radio.jsx", error: String((e && e.message) || e) }); }

// components/Row/Row.jsx
try { (() => {
function Row({
  lead,
  title,
  subtitle,
  trail,
  chevron,
  selected,
  iconHref = 'icons.svg',
  compact,
  roomy,
  className = '',
  ...rest
}) {
  const cls = ['lds-row', compact ? 'lds-row--compact' : '', roomy ? 'lds-row--roomy' : '', rest.href || rest.onClick ? 'lds-row--interactive' : '', className].filter(Boolean).join(' ');
  const Tag = rest.href ? 'a' : 'div';
  const sprite = name => React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${name}`
  }));
  // chevron={true} draws Open Icons' chevron-right; a node is used as given.
  const mark = chevron === true ? sprite('chevron-right') : chevron;
  return React.createElement(Tag, {
    className: cls,
    'aria-selected': selected !== undefined ? String(!!selected) : undefined,
    ...rest
  }, lead && React.createElement('div', {
    className: 'lds-row__lead'
  }, lead), React.createElement('div', {
    className: 'lds-row__content'
  }, React.createElement('div', {
    className: 'lds-row__title'
  }, title), subtitle && React.createElement('div', {
    className: 'lds-row__subtitle'
  }, subtitle)), trail && React.createElement('div', {
    className: 'lds-row__trail'
  }, trail), selected && React.createElement('div', {
    className: 'lds-row__check'
  }, sprite('check')), mark && React.createElement('div', {
    className: 'lds-row__chevron'
  }, mark));
}
Object.assign(__ds_scope, { Row });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Row/Row.jsx", error: String((e && e.message) || e) }); }

// components/Select/Select.jsx
try { (() => {
function Select({
  label,
  id,
  help,
  error,
  required,
  options = [],
  className = '',
  ...rest
}) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', className].filter(Boolean).join(' ');
  return React.createElement('div', {
    className: cls,
    'data-status': error ? 'error' : undefined
  }, label && React.createElement('label', {
    htmlFor: id,
    className: required ? 'lds-field__req' : ''
  }, label), React.createElement('select', {
    id,
    ...rest
  },
  // Keyed by index, not by value: a dial-code list has twenty entries whose
  // value is "+1", and they are all legitimate.
  options.map((o, i) => {
    if (o && o.options) {
      return React.createElement('optgroup', {
        key: 'g' + i,
        label: o.label
      }, o.options.map((c, k) => {
        const opt = typeof c === 'string' ? {
          value: c,
          label: c
        } : c;
        return React.createElement('option', {
          key: k,
          value: opt.value
        }, opt.label);
      }));
    }
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return React.createElement('option', {
      key: i,
      value: opt.value
    }, opt.label);
  })), error ? React.createElement('span', {
    className: 'lds-field__error'
  }, error) : help ? React.createElement('span', {
    className: 'lds-field__help'
  }, help) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Select/Select.jsx", error: String((e && e.message) || e) }); }

// components/Skeleton/Skeleton.jsx
try { (() => {
function Skeleton({
  variant = 'text',
  last,
  className = '',
  style,
  ...rest
}) {
  const cls = ['lds-skeleton', `lds-skeleton--${variant}`, last ? 'lds-skeleton--last' : '', className].filter(Boolean).join(' ');
  return React.createElement('span', {
    className: cls,
    style,
    ...rest
  });
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Skeleton/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/Table/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = [],
  className = ''
}) {
  return React.createElement('table', {
    className: ['lds-table', className].filter(Boolean).join(' ')
  }, React.createElement('thead', null, React.createElement('tr', null, columns.map(c => React.createElement('th', {
    key: c.key
  }, c.label)))), React.createElement('tbody', null, rows.map((r, i) => React.createElement('tr', {
    key: i
  }, columns.map(c => React.createElement('td', {
    key: c.key
  }, r[c.key]))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Table/Table.jsx", error: String((e && e.message) || e) }); }

// components/Tabs/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange,
  className = ''
}) {
  return React.createElement('div', {
    className: ['lds-tabs', className].filter(Boolean).join(' ')
  }, tabs.map((t, i) => t.section ? React.createElement('div', {
    key: `s${i}`,
    className: 'lds-tabs__section'
  }, t.section) : React.createElement('button', {
    key: t.id,
    type: 'button',
    className: 'lds-tabs__tab' + (t.id === active ? ' lds-tabs__tab--active' : ''),
    onClick: () => onChange && onChange(t.id)
  }, t.icon && React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${t.iconHref || 'icons.svg'}#${t.icon}`
  })), React.createElement('span', null, t.label))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Tabs/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/Tag/Tag.jsx
try { (() => {
function Tag({
  children,
  hue,
  status,
  emphasis,
  size,
  interactive,
  inactive,
  icon,
  dot,
  className = '',
  ...rest
}) {
  const cls = ['lds-tag', hue ? `hue-${hue}` : '', size === 'sm' ? 'lds-tag--sm' : '', status ? `lds-tag--${status}` : '', emphasis ? `emph-${emphasis}` : '', interactive ? 'lds-tag--interactive' : '', inactive ? 'lds-tag--inactive' : '', className].filter(Boolean).join(' ');
  return React.createElement('span', {
    className: cls,
    'data-status': status || undefined,
    ...rest
  }, icon && React.createElement('span', {
    className: 'lds-tag__icon'
  }, icon), dot && React.createElement('span', {
    className: 'lds-tag__dot'
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Tag/Tag.jsx", error: String((e && e.message) || e) }); }

// components/TextField/TextField.jsx
try { (() => {
function TextField({
  label,
  id,
  help,
  error,
  required,
  iconStart,
  iconEnd,
  endAction,
  prefix,
  iconHref = 'icons.svg',
  className = '',
  ...rest
}) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', iconStart ? 'lds-field--has-start' : '', iconEnd || endAction ? 'lds-field--has-end' : '', className].filter(Boolean).join(' ');
  const sprite = icon => typeof icon === 'string' ? React.createElement('svg', {
    className: 'lds-icon',
    'aria-hidden': 'true'
  }, React.createElement('use', {
    href: `${iconHref}#${icon}`
  })) : icon;
  const input = React.createElement('input', {
    id,
    type: 'text',
    ...rest
  });
  // prefix is a whole control (a dial-code select) joined into one box; icons are
  // inset over the input's own padding so the field stays a single target.
  const control = prefix ? React.createElement('div', {
    className: 'lds-field__group'
  }, React.createElement('div', {
    className: 'lds-field__dial'
  }, prefix), React.createElement('div', {
    className: 'lds-field__number'
  }, input)) : React.createElement('div', {
    className: 'lds-field__wrap'
  }, iconStart && React.createElement('span', {
    className: 'lds-field__adorn lds-field__adorn--start'
  }, sprite(iconStart)), input, endAction ? React.createElement('button', {
    type: 'button',
    className: 'lds-field__adorn lds-field__adorn--end lds-field__adorn--action',
    'aria-label': endAction.label,
    onClick: endAction.onClick
  }, sprite(endAction.icon)) : iconEnd && React.createElement('span', {
    className: 'lds-field__adorn lds-field__adorn--end'
  }, sprite(iconEnd)));
  return React.createElement('div', {
    className: cls,
    'data-status': error ? 'error' : undefined
  }, label && React.createElement('label', {
    htmlFor: id,
    className: required ? 'lds-field__req' : ''
  }, label), control, error ? React.createElement('span', {
    className: 'lds-field__error'
  }, error) : help ? React.createElement('span', {
    className: 'lds-field__help'
  }, help) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/TextField/TextField.jsx", error: String((e && e.message) || e) }); }

// components/TextField/dial-codes.js
try { (() => {
// Every ITU dial code, because a short list is not a shortcut — it is a wall.
// A user whose country is missing cannot enter their number at all, and there is
// no error message that helps them.
//
// [name, dial code, ISO 3166-1 alpha-2]. The ISO code is what makes this usable
// in a native <select>: a closed select is exactly as wide as its widest option,
// so labelling options "+1  United States" makes the code box swallow the field
// the phone number needs. "+1 US" reads the same, disambiguates the twenty
// countries that share +1, and keeps the box at the width of its own content.
const DIAL_CODES = [['Afghanistan', '+93', 'AF'], ['Albania', '+355', 'AL'], ['Algeria', '+213', 'DZ'], ['Andorra', '+376', 'AD'], ['Angola', '+244', 'AO'], ['Argentina', '+54', 'AR'], ['Armenia', '+374', 'AM'], ['Aruba', '+297', 'AW'], ['Australia', '+61', 'AU'], ['Austria', '+43', 'AT'], ['Azerbaijan', '+994', 'AZ'], ['Bahamas', '+1', 'BS'], ['Bahrain', '+973', 'BH'], ['Bangladesh', '+880', 'BD'], ['Barbados', '+1', 'BB'], ['Belarus', '+375', 'BY'], ['Belgium', '+32', 'BE'], ['Belize', '+501', 'BZ'], ['Benin', '+229', 'BJ'], ['Bermuda', '+1', 'BM'], ['Bhutan', '+975', 'BT'], ['Bolivia', '+591', 'BO'], ['Bosnia and Herzegovina', '+387', 'BA'], ['Botswana', '+267', 'BW'], ['Brazil', '+55', 'BR'], ['Brunei', '+673', 'BN'], ['Bulgaria', '+359', 'BG'], ['Burkina Faso', '+226', 'BF'], ['Burundi', '+257', 'BI'], ['Cambodia', '+855', 'KH'], ['Cameroon', '+237', 'CM'], ['Canada', '+1', 'CA'], ['Cape Verde', '+238', 'CV'], ['Cayman Islands', '+1', 'KY'], ['Central African Republic', '+236', 'CF'], ['Chad', '+235', 'TD'], ['Chile', '+56', 'CL'], ['China', '+86', 'CN'], ['Colombia', '+57', 'CO'], ['Comoros', '+269', 'KM'], ['Congo', '+242', 'CG'], ['Congo (DRC)', '+243', 'CD'], ['Costa Rica', '+506', 'CR'], ['Côte d’Ivoire', '+225', 'CI'], ['Croatia', '+385', 'HR'], ['Cuba', '+53', 'CU'], ['Curaçao', '+599', 'CW'], ['Cyprus', '+357', 'CY'], ['Czechia', '+420', 'CZ'], ['Denmark', '+45', 'DK'], ['Djibouti', '+253', 'DJ'], ['Dominica', '+1', 'DM'], ['Dominican Republic', '+1', 'DO'], ['Ecuador', '+593', 'EC'], ['Egypt', '+20', 'EG'], ['El Salvador', '+503', 'SV'], ['Equatorial Guinea', '+240', 'GQ'], ['Eritrea', '+291', 'ER'], ['Estonia', '+372', 'EE'], ['Eswatini', '+268', 'SZ'], ['Ethiopia', '+251', 'ET'], ['Fiji', '+679', 'FJ'], ['Finland', '+358', 'FI'], ['France', '+33', 'FR'], ['French Guiana', '+594', 'GF'], ['French Polynesia', '+689', 'PF'], ['Gabon', '+241', 'GA'], ['Gambia', '+220', 'GM'], ['Georgia', '+995', 'GE'], ['Germany', '+49', 'DE'], ['Ghana', '+233', 'GH'], ['Gibraltar', '+350', 'GI'], ['Greece', '+30', 'GR'], ['Greenland', '+299', 'GL'], ['Grenada', '+1', 'GD'], ['Guadeloupe', '+590', 'GP'], ['Guam', '+1', 'GU'], ['Guatemala', '+502', 'GT'], ['Guinea', '+224', 'GN'], ['Guinea-Bissau', '+245', 'GW'], ['Guyana', '+592', 'GY'], ['Haiti', '+509', 'HT'], ['Honduras', '+504', 'HN'], ['Hong Kong', '+852', 'HK'], ['Hungary', '+36', 'HU'], ['Iceland', '+354', 'IS'], ['India', '+91', 'IN'], ['Indonesia', '+62', 'ID'], ['Iran', '+98', 'IR'], ['Iraq', '+964', 'IQ'], ['Ireland', '+353', 'IE'], ['Israel', '+972', 'IL'], ['Italy', '+39', 'IT'], ['Jamaica', '+1', 'JM'], ['Japan', '+81', 'JP'], ['Jordan', '+962', 'JO'], ['Kazakhstan', '+7', 'KZ'], ['Kenya', '+254', 'KE'], ['Kiribati', '+686', 'KI'], ['Kosovo', '+383', 'XK'], ['Kuwait', '+965', 'KW'], ['Kyrgyzstan', '+996', 'KG'], ['Laos', '+856', 'LA'], ['Latvia', '+371', 'LV'], ['Lebanon', '+961', 'LB'], ['Lesotho', '+266', 'LS'], ['Liberia', '+231', 'LR'], ['Libya', '+218', 'LY'], ['Liechtenstein', '+423', 'LI'], ['Lithuania', '+370', 'LT'], ['Luxembourg', '+352', 'LU'], ['Macau', '+853', 'MO'], ['Madagascar', '+261', 'MG'], ['Malawi', '+265', 'MW'], ['Malaysia', '+60', 'MY'], ['Maldives', '+960', 'MV'], ['Mali', '+223', 'ML'], ['Malta', '+356', 'MT'], ['Marshall Islands', '+692', 'MH'], ['Martinique', '+596', 'MQ'], ['Mauritania', '+222', 'MR'], ['Mauritius', '+230', 'MU'], ['Mexico', '+52', 'MX'], ['Micronesia', '+691', 'FM'], ['Moldova', '+373', 'MD'], ['Monaco', '+377', 'MC'], ['Mongolia', '+976', 'MN'], ['Montenegro', '+382', 'ME'], ['Morocco', '+212', 'MA'], ['Mozambique', '+258', 'MZ'], ['Myanmar', '+95', 'MM'], ['Namibia', '+264', 'NA'], ['Nauru', '+674', 'NR'], ['Nepal', '+977', 'NP'], ['Netherlands', '+31', 'NL'], ['New Caledonia', '+687', 'NC'], ['New Zealand', '+64', 'NZ'], ['Nicaragua', '+505', 'NI'], ['Niger', '+227', 'NE'], ['Nigeria', '+234', 'NG'], ['North Korea', '+850', 'KP'], ['North Macedonia', '+389', 'MK'], ['Norway', '+47', 'NO'], ['Oman', '+968', 'OM'], ['Pakistan', '+92', 'PK'], ['Palau', '+680', 'PW'], ['Palestine', '+970', 'PS'], ['Panama', '+507', 'PA'], ['Papua New Guinea', '+675', 'PG'], ['Paraguay', '+595', 'PY'], ['Peru', '+51', 'PE'], ['Philippines', '+63', 'PH'], ['Poland', '+48', 'PL'], ['Portugal', '+351', 'PT'], ['Puerto Rico', '+1', 'PR'], ['Qatar', '+974', 'QA'], ['Réunion', '+262', 'RE'], ['Romania', '+40', 'RO'], ['Russia', '+7', 'RU'], ['Rwanda', '+250', 'RW'], ['Samoa', '+685', 'WS'], ['San Marino', '+378', 'SM'], ['São Tomé and Príncipe', '+239', 'ST'], ['Saudi Arabia', '+966', 'SA'], ['Senegal', '+221', 'SN'], ['Serbia', '+381', 'RS'], ['Seychelles', '+248', 'SC'], ['Sierra Leone', '+232', 'SL'], ['Singapore', '+65', 'SG'], ['Sint Maarten', '+1', 'SX'], ['Slovakia', '+421', 'SK'], ['Slovenia', '+386', 'SI'], ['Solomon Islands', '+677', 'SB'], ['Somalia', '+252', 'SO'], ['South Africa', '+27', 'ZA'], ['South Korea', '+82', 'KR'], ['South Sudan', '+211', 'SS'], ['Spain', '+34', 'ES'], ['Sri Lanka', '+94', 'LK'], ['Sudan', '+249', 'SD'], ['Suriname', '+597', 'SR'], ['Sweden', '+46', 'SE'], ['Switzerland', '+41', 'CH'], ['Syria', '+963', 'SY'], ['Taiwan', '+886', 'TW'], ['Tajikistan', '+992', 'TJ'], ['Tanzania', '+255', 'TZ'], ['Thailand', '+66', 'TH'], ['Timor-Leste', '+670', 'TL'], ['Togo', '+228', 'TG'], ['Tonga', '+676', 'TO'], ['Trinidad and Tobago', '+1', 'TT'], ['Tunisia', '+216', 'TN'], ['Türkiye', '+90', 'TR'], ['Turkmenistan', '+993', 'TM'], ['Tuvalu', '+688', 'TV'], ['Uganda', '+256', 'UG'], ['Ukraine', '+380', 'UA'], ['United Arab Emirates', '+971', 'AE'], ['United Kingdom', '+44', 'GB'], ['United States', '+1', 'US'], ['Uruguay', '+598', 'UY'], ['Uzbekistan', '+998', 'UZ'], ['Vanuatu', '+678', 'VU'], ['Vatican City', '+39', 'VA'], ['Venezuela', '+58', 'VE'], ['Vietnam', '+84', 'VN'], ['Yemen', '+967', 'YE'], ['Zambia', '+260', 'ZM'], ['Zimbabwe', '+263', 'ZW']];

// The country name goes in the OPTGROUP, not the option. A native select shows
// group labels in the open list and never in the closed control, so the list is
// still browsable by country while the box itself stays at "+49 DE" wide.
function dialOptions(priority = ['United States', 'United Kingdom', 'Canada', 'Australia']) {
  const fmt = ([name, code, iso]) => ({
    value: code,
    label: `${code} ${iso}`,
    name
  });
  const top = priority.map(n => DIAL_CODES.find(c => c[0] === n)).filter(Boolean);
  const rest = DIAL_CODES.filter(c => !priority.includes(c[0]));
  return {
    top: top.map(fmt),
    rest: rest.map(fmt)
  };
}
Object.assign(__ds_scope, { DIAL_CODES, dialOptions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/TextField/dial-codes.js", error: String((e && e.message) || e) }); }

// components/Textarea/Textarea.jsx
try { (() => {
function Textarea({
  label,
  id,
  help,
  error,
  required,
  maxLength,
  showCount,
  value,
  defaultValue,
  onChange,
  className = '',
  ...rest
}) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', className].filter(Boolean).join(' ');
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const text = controlled ? value : inner;
  const count = String(text ?? '').length;
  const over = maxLength !== undefined && count >= maxLength;
  const handle = e => {
    if (!controlled) setInner(e.target.value);
    if (onChange) onChange(e);
  };
  const showFooter = showCount || maxLength !== undefined || !!help || !!error;
  return React.createElement('div', {
    className: cls,
    'data-status': error ? 'error' : undefined
  }, label && React.createElement('label', {
    htmlFor: id,
    className: required ? 'lds-field__req' : ''
  }, label), React.createElement('textarea', {
    id,
    maxLength,
    value: text,
    onChange: handle,
    ...rest
  }), showFooter && React.createElement('div', {
    className: 'lds-field__footer'
  }, error ? React.createElement('span', {
    className: 'lds-field__error'
  }, error) : help ? React.createElement('span', {
    className: 'lds-field__help'
  }, help) : React.createElement('span', {
    className: 'lds-field__help'
  }), (showCount || maxLength !== undefined) && React.createElement('span', {
    className: 'lds-field__count' + (over ? ' lds-field__count--over' : '')
  }, maxLength !== undefined ? `${count} / ${maxLength}` : String(count))));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Textarea/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/Toggle/Toggle.jsx
try { (() => {
function Toggle({
  label,
  help,
  id,
  className = '',
  ...rest
}) {
  return React.createElement('div', {
    className: ['lds-toggle', className].filter(Boolean).join(' ')
  }, (label || help) && React.createElement('div', {
    className: 'lds-toggle__text'
  }, label && React.createElement('span', {
    className: 'lds-toggle__label'
  }, label), help && React.createElement('span', {
    className: 'lds-toggle__help'
  }, help)), React.createElement('label', {
    className: 'lds-toggle__switch'
  }, React.createElement('input', {
    type: 'checkbox',
    id,
    ...rest
  }), React.createElement('span', {
    className: 'lds-toggle__track'
  })));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Toggle/Toggle.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ButtonGroup = __ds_scope.ButtonGroup;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.CodeField = __ds_scope.CodeField;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Inline = __ds_scope.Inline;

__ds_ns.Link = __ds_scope.Link;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Row = __ds_scope.Row;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.DIAL_CODES = __ds_scope.DIAL_CODES;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Toggle = __ds_scope.Toggle;

})();
