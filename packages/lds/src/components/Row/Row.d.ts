export interface RowProps {
  lead?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  trail?: React.ReactNode;
  /** true draws Open Icons' chevron-right; a node is rendered as given. */
  chevron?: boolean | React.ReactNode;
  /** Draws a bare checkmark and sets aria-selected. For row-is-the-selection pickers; use Checkbox when the multi-select affordance must be visible before clicking. */
  selected?: boolean;
  iconHref?: string;
  compact?: boolean;
  roomy?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}
export declare function Row(props: RowProps): JSX.Element;