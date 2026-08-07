export interface CheckboxProps {
  label?: React.ReactNode;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;