export interface CodeFieldProps {
  label?: string;
  help?: string;
  error?: string;
  /** Verified. `true` shows "Verified"; a string replaces the message. Makes the boxes read-only. */
  success?: string | boolean;
  /** In flight. `true` shows "Checking…". Read-only, no verdict yet. */
  verifying?: string | boolean;
  /** Number of digit boxes. Default 6. */
  length?: number;
  /** Insert a visual gap after this many digits (e.g. 3 for 123 456). */
  groupAfter?: number;
  /** 'sm' uses 36px boxes instead of 44px. */
  size?: 'sm';
  value?: string;
  iconHref?: string;
  onChange?: (code: string) => void;
  className?: string;
}
export declare function CodeField(props: CodeFieldProps): JSX.Element;