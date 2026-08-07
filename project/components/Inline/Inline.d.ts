export interface InlineProps {
  status?: 'info' | 'success' | 'warning' | 'caution' | 'error';
  /** Overrides the automatic status icon. Pass null to suppress it. */
  icon?: React.ReactNode;
  /** Path to the icon sprite. Default 'icons.svg'. */
  iconHref?: string;
  children?: React.ReactNode;
  className?: string;
}
export declare function Inline(props: InlineProps): JSX.Element;