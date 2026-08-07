export interface TextareaProps {
  label?: string;
  id?: string;
  help?: string;
  error?: string;
  required?: boolean;
  /** Caps input and shows a "count / limit" readout that turns red at the limit. */
  maxLength?: number;
  /** Shows a plain character count when there is no limit. */
  showCount?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}
export declare function Textarea(props: TextareaProps): JSX.Element;