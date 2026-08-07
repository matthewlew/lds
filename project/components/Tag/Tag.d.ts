export interface TagProps {
  children?: React.ReactNode;
  hue?: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet' | 'pink' | 'gray';
  emphasis?: 'plain' | 'subtle' | 'soft' | 'strong' | 'stark';
  /** Fixed meaning — sets the hue and, in Banner/Inline, the icon. */
  status?: 'info' | 'success' | 'warning' | 'caution' | 'error';
  /** 'sm' for a version string, a count, or a tag inside a dense row — the job the old Badge did. */
  size?: 'sm';
  interactive?: boolean;
  inactive?: boolean;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}
export declare function Tag(props: TagProps): JSX.Element;