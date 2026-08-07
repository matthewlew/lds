export interface EmptyStateProps {
  /** Sprite name (e.g. 'search') or a node. The utility option. */
  icon?: string | React.ReactNode;
  /** Image src or node — brand illustration or product shot. Bounded to 280×160 and object-fit: contain. Wins over icon. */
  image?: string | React.ReactNode;
  imageAlt?: string;
  /** Renders the icon at 48px in the accent colour, for a branded empty state. */
  expressive?: boolean;
  iconHref?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;