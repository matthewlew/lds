export interface SelectOption { value: string; label: string; }
/** An <optgroup>. Values need not be unique across groups — twenty countries share +1. */
export interface SelectGroup { label: string; options: (string | SelectOption)[]; }
export interface SelectProps {
  label?: string;
  id?: string;
  value?: string;
  options?: (string | SelectOption | SelectGroup)[];
  help?: string;
  error?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}
export declare function Select(props: SelectProps): JSX.Element;