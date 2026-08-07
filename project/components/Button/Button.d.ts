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
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;