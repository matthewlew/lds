// IconButton: an icon-only Button, named twice the way LDS asks — `aria-label`
// for assistive technology and a Tooltip for everyone else — from one `label`,
// so the two cannot disagree. Tooltip sees the bubble repeat the label and
// leaves the button undescribed, so it is read out once.
//
// A row action, not a form's submit: `type="button"` unless the caller says
// otherwise, so one inside a <form> does not submit it.
//
// The pattern for every composition in this package: a component built out of
// the others, with no markup of its own. It renders on a server; the Tooltip
// inside it is the only part that runs in the browser.
import { Button } from './actions.js';
import { Tooltip } from './tooltip.js';

export function IconButton({ label, icon, placement, size = 'sm', ...button }) {
  return (
    <Tooltip label={label} placement={placement}>
      <Button size={size} type="button" {...button} iconOnly iconStart={icon} aria-label={label} />
    </Tooltip>
  );
}
