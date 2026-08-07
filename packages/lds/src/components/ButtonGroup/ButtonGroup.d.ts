export interface ButtonGroupProps {
  children?: React.ReactNode;
  /** Conversion bar: the headline detail beside the button (a price, a total). Keeps the button label a single verb. */
  detail?: React.ReactNode;
  /** Second line of the conversion detail — the qualifier (nights, fees, cadence). */
  detailNote?: React.ReactNode;
  /** Row (default) or column. A column never stacks — it already is one. */
  orientation?: 'horizontal' | 'vertical';
  /** 'hug' sizes to the labels; 'fill' divides the available width equally. */
  width?: 'hug' | 'fill';
  /** 'split' sends the FIRST child (cancel / exit) to the opposite end. Ignored when detail is set. */
  align?: 'start' | 'center' | 'end' | 'split';
  /** Under 560px, stack and fill, reversed so the confirming action is on top. Default true. */
  stackOnMobile?: boolean;
  className?: string;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;