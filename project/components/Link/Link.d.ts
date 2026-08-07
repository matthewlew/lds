export interface LinkProps {
  children?: React.ReactNode;
  href?: string;
  /** 'quiet' for dense chrome (inherits the text colour, keeps the underline); 'standalone' for a link on its own line, with a trailing chevron. */
  variant?: 'quiet' | 'standalone';
  /** Standalone only — sprite name for the trailing icon (default 'chevron-right'), a node, or null to omit. */
  iconEnd?: string | React.ReactNode | null;
  iconHref?: string;
  className?: string;
}
export declare function Link(props: LinkProps): JSX.Element;