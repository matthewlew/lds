export interface SkeletonProps {
  variant?: 'text' | 'title' | 'caption' | 'circle';
  last?: boolean;
  style?: React.CSSProperties;
  className?: string;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;