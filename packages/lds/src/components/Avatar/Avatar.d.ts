export interface AvatarProps {
  /** Initials come from this — first letter of the first and last word. Also seeds the colour. */
  name?: string;
  /** Image src. Wins over initials. */
  src?: string;
  alt?: string;
  /** 24 / 32 / 40 (default) / 48 / 64 / 96px. */
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2xl';
  /** Overrides the derived hue. Use only when a colour is already assigned elsewhere. */
  hue?: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet' | 'pink' | 'gray';
  /** Adds a 2px ring in the surface colour — for overlapping stacks or busy backgrounds. */
  ring?: boolean;
  iconHref?: string;
  className?: string;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
/** The hue this name resolves to — exported so a consumer can tint a related element to match. */
export declare function hueForName(name: string): string;
export declare function initialsForName(name: string): string;