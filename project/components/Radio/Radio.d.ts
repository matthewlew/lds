export interface RadioProps {
  label?: React.ReactNode;
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;