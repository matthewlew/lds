export interface ModalProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Confirming actions, in order — the committing one LAST. Rendered in a ButtonGroup. */
  actions?: React.ReactNode;
  /** Cancel / exit. Placed at the opposite end of the footer from the actions. */
  cancel?: React.ReactNode;
  onClose?: () => void;
  /** Shows the back affordance at the header's origin edge. Pops one level of a stacked flow; close dismisses the whole stack. */
  onBack?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Large title at the top of the scroll region, above the body — the bar title and its divider then appear only once content scrolls under the header. Default true. */
  largeTitle?: boolean;
  /** Bottom sheet under 560px; a centred dialog above it. */
  sheet?: boolean;
  /** Side sheet at 768px and up; a bottom sheet below it. */
  side?: boolean;
  iconHref?: string;
  className?: string;
}
export declare function Modal(props: ModalProps): JSX.Element;