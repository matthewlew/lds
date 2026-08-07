export interface NavProps {
  /**
   * `brand` — a marketing header: logo, links, one level deep.
   * `bar` — the chrome of a screen inside a stack, with a back affordance.
   */
  variant?: 'brand' | 'bar';
  /** brand only. */
  logo?: React.ReactNode;
  /** brand only. */
  links?: React.ReactNode;
  /** bar only. Truncates to one line — chrome must not change height. */
  title?: React.ReactNode;
  /** bar only. */
  subtitle?: React.ReactNode;
  /** bar only. Pops ONE level of the flow. Same affordance as Modal's onBack. */
  onBack?: () => void;
  backLabel?: string;
  /** bar only. Trailing actions. */
  actions?: React.ReactNode;
  sticky?: boolean;
  /** Draws the divider — set once content has scrolled under the bar. */
  scrolled?: boolean;
  iconHref?: string;
  className?: string;
  children?: React.ReactNode;
}
export declare function Nav(props: NavProps): JSX.Element;
