export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'lg';
  iconOnly?: boolean;
  /** Leading icon — sprite name (e.g. 'add') or a node. Sized in em, so it tracks the button's step. */
  iconStart?: string | React.ReactNode;
  /** Trailing icon — sprite name or node. */
  iconEnd?: string | React.ReactNode;
  /** Second line under the label, at 0.85em and a tint of the label colour. Left-aligns the button and grows it to 48px. */
  subtitle?: React.ReactNode;
  iconHref?: string;
  /** One-token emphasis override. */
  emphasis?: 'plain' | 'subtle' | 'soft' | 'strong' | 'stark' | 'media';
  /** Repoints the brand ramp — 'red' for destructive. */
  hue?: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet' | 'pink' | 'gray';
  /** Second step of a two-step destructive action. */
  armed?: boolean;
  /**
   * Renders an `<a>` instead of a `<button>`. A link that must look like a
   * button IS this button — same sizes, same paint. Disabled becomes
   * `aria-disabled`, which an anchor supports and `disabled` does not.
   */
  href?: string;
  /** Round, elevated, 56px. One per screen; still painted by its variant. */
  fab?: boolean;
  /** A FAB that keeps its label rather than collapsing to the icon. */
  extended?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}
/**
 * Extra props pass through to the underlying `<button>` (or `<a>`, when `href`
 * is set), so `type`, `aria-*`, `form` and the rest are all available.
 */
export declare function Button(
  props: ButtonProps
    & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>
    & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonProps>,
): JSX.Element;