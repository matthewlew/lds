export interface ChipProps {
  children?: React.ReactNode;
  selected?: boolean;
  /** 'sm' 24px (inside a field), default 36px (beside a small button), 'lg' 44px. */
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
  caret?: React.ReactNode;
  /** Adds a trailing dismiss (×) button — for input tags/autofill tokens. Renders the chip as a <span>, not a <button>. */
  onRemove?: (e: React.SyntheticEvent) => void;
  removeLabel?: string;
  iconHref?: string;
  onClick?: () => void;
  className?: string;
}
export declare function Chip(props: ChipProps): JSX.Element;