export interface ToggleProps {
  label?: string;
  help?: string;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export declare function Toggle(props: ToggleProps): JSX.Element;