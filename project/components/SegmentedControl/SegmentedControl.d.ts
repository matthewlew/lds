export interface SegmentedOption {
  value: string;
  label: string;
  /** Sprite name. Shown beside the label, or alone when iconsOnly. */
  icon?: string;
  disabled?: boolean;
}
export interface SegmentedControlProps {
  options?: (string | SegmentedOption)[];
  /** Controlled value. Omit and pass defaultValue for uncontrolled. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Radio group name. Generated when omitted — set it if two groups share a form. */
  name?: string;
  size?: 'sm' | 'lg';
  /** Stretch to the container and share width equally. */
  full?: boolean;
  /** Drop labels; each option becomes a square target with its label as the accessible name. */
  iconsOnly?: boolean;
  /** Accessible name for the group itself. */
  label?: string;
  iconHref?: string;
  className?: string;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;