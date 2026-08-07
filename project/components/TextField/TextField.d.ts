export interface TextFieldProps {
  label?: string;
  id?: string;
  help?: string;
  error?: string;
  required?: boolean;
  /** Inset leading icon — sprite name (e.g. 'mail', 'person') or a node. */
  iconStart?: string | React.ReactNode;
  /** Inset trailing icon, decorative. */
  iconEnd?: string | React.ReactNode;
  /** Interactive trailing icon: { icon, label, onClick } — reveal, clear, search. */
  endAction?: { icon: string | React.ReactNode; label: string; onClick?: () => void };
  /** A control joined into the same box — e.g. a dial-code <Select> for a phone number. */
  prefix?: React.ReactNode;
  iconHref?: string;
  type?: string;
  inputMode?: string;
  autoComplete?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export declare function TextField(props: TextFieldProps): JSX.Element;