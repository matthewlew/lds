export interface TabItem {
  id?: string;
  label?: string;
  /** Sprite symbol id for a leading icon (16px, --icon colour). */
  icon?: string;
  /** Sprite path for this item's icon. Default 'icons.svg'. */
  iconHref?: string;
  /** Renders a non-interactive group header instead of a tab. */
  section?: string;
}
export interface TabsProps {
  tabs: TabItem[];
  active?: string;
  onChange?: (id: string) => void;
  className?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;