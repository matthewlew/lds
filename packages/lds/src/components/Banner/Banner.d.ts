export interface BannerProps {
  status?: 'info' | 'success' | 'warning' | 'caution' | 'error';
  /** One-token emphasis override (e.g. 'strong' for a high-emphasis error/warning). */
  emphasis?: 'plain' | 'subtle' | 'soft' | 'strong' | 'stark';
  /** System banner: full-bleed, square, bottom hairline only. Default is a content banner. */
  page?: boolean;
  title?: React.ReactNode;
  /** Overrides the automatic status icon (info/success/warning/caution/error each default to a fixed icons.svg symbol). */
  icon?: React.ReactNode;
  /** Path to the icon sprite for the default status icon. Default 'icons.svg'. */
  iconHref?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}
export declare function Banner(props: BannerProps): JSX.Element;