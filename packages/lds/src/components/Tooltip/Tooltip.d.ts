export interface TooltipProps {
  /**
   * The label. Short — a tooltip names a control, it does not explain one.
   * Anything a user must read belongs in visible help text, and anything
   * interactive belongs in a Menu or a Modal: a hover bubble cannot be reached
   * by a pointer, so a control inside one is unreachable for some users.
   */
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** The trigger. Receives `aria-describedby` if it is a single element. */
  children?: React.ReactNode;
  id?: string;
  className?: string;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
