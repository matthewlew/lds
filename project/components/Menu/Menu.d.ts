export interface MenuItem {
  label?: string;
  icon?: React.ReactNode;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}
export interface MenuProps {
  items: MenuItem[];
  className?: string;
}
export declare function Menu(props: MenuProps): JSX.Element;