export interface CardProps {
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  body?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** Resolves all seven object-colour roles at once. Default is the page's own resolution. */
  emphasis?: 'plain' | 'subtle' | 'soft' | 'strong' | 'stark';
  hue?: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet' | 'pink' | 'gray';
  /** Renders as a <button>: whole card is the target, with hover, pressed, selected and focus states. */
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;