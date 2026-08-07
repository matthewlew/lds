export interface IconProps {
  /** A symbol id from the Open Icons sprite, e.g. 'chevron-right'. */
  name: string;
  /** Overrides the CSS size. Otherwise the icon takes `--icon-size`. */
  size?: number | string;
  /** The sprite to resolve against. Defaults to the configured sprite. */
  href?: string;
  style?: React.CSSProperties;
  className?: string;
}
/** Extra props pass through to the `<svg>`. */
export declare function Icon(
  props: IconProps & Omit<React.SVGAttributes<SVGSVGElement>, keyof IconProps>,
): JSX.Element;
