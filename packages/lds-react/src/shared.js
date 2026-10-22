// What the components share: the class joiner, the one sprite reference every
// icon slot draws, and the two rules that keep a form control's markup the
// template's while staying valid React.
//
// Nothing here holds state, so every component that imports only this renders
// as a server component.

/** Joins class names, dropping the falsy ones — the templates' `cx`. */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/**
 * One decorative `<use>` into the sprite: the templates' `spriteSvg`.
 *
 * The sprite resolves in-document (`#name`) unless `iconHref` says otherwise.
 * That is the default the templates reach once `inlineIconSprite` has run, and
 * the only one that is right on a server: the masked glyphs draw nothing
 * through an external file, and a sprite URL resolved on the server (a
 * `file:` path) is not the one the browser loads. Put the sprite in the page
 * once with `<IconSprite/>`.
 */
export function SpriteIcon({ name, href = '' }) {
  return (
    <svg className="lds-icon" aria-hidden="true">
      <use href={`${href}#${name}`} />
    </svg>
  );
}

/** An icon slot: a sprite name, drawn as `SpriteIcon`, or a node used as given. */
export function iconSlot(icon, href) {
  return typeof icon === 'string' ? <SpriteIcon name={icon} href={href} /> : icon;
}

/**
 * The templates take `value` and `checked` as the control's initial state. In
 * React that is `defaultValue` / `defaultChecked` unless the caller is driving
 * the control — and a server component cannot pass the `onChange` that would
 * make it controlled. The serialised markup is the same either way.
 */
export function initialState(props) {
  if (props.onChange || props.readOnly) return props;
  const { value, checked, ...rest } = props;
  if (value !== undefined && rest.defaultValue === undefined) rest.defaultValue = value;
  if (checked !== undefined && rest.defaultChecked === undefined) rest.defaultChecked = checked;
  return rest;
}

/** `left` and `right` are what the vanilla types used to say; the stylesheet draws start and end. */
export const PLACEMENT = { left: 'start', right: 'end' };
