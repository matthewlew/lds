// Types for @lew-ds/lds-react, derived from @lew-ds/lds's template types: a
// component takes its template's props, with each slot widened from text or
// raw() markup to a React node, handlers typed as handlers, and the root
// element's own attributes.
import type {
  AnchorHTMLAttributes, ButtonHTMLAttributes, ChangeEvent, ElementType,
  HTMLAttributes, InputHTMLAttributes, JSX, MouseEvent, ReactNode, SelectHTMLAttributes,
  SVGProps, TableHTMLAttributes, TextareaHTMLAttributes,
} from 'react';
import type * as T from '@lew-ds/lds/templates';

export type { Status, Emphasis, Hue, Size } from '@lew-ds/lds/templates';

/** A template's named props, without HtmlProps' catch-all index signature. */
type Known<P> = { [K in keyof P as string extends K ? never : number extends K ? never : K]: P[K] };
/** Template props with `S` widened to React nodes and the root's own attributes left to React's types. */
type From<P, S extends PropertyKey = never, Drop extends PropertyKey = never> =
  Omit<Known<P>, S | Drop | 'className' | 'id' | 'style'> & { [K in S]?: ReactNode };
/** What every component passes to its root element. */
type Root<A> = Omit<A, 'children' | 'title' | 'prefix' | 'onChange'> & { className?: string };

/** A sprite name (`'search'`), drawn from the in-document sprite, or a node used as given. */
export type IconSlot = string | ReactNode;

// ---- actions -----------------------------------------------------------------

export type ButtonProps = From<T.ButtonProps, 'subtitle' | 'children', 'iconStart' | 'iconEnd'> & {
  iconStart?: IconSlot;
  iconEnd?: IconSlot;
  /** The anchor to render with `href`, e.g. a router's Link. Defaults to `'a'`. */
  as?: ElementType;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
} & Root<ButtonHTMLAttributes<HTMLButtonElement>>;
export declare function Button(props: ButtonProps): JSX.Element;

export type ButtonGroupProps = From<T.ButtonGroupProps, 'children' | 'detail' | 'detailNote'>
  & Root<HTMLAttributes<HTMLDivElement>>;
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;

export type LinkProps = From<T.LinkProps, 'children', 'iconEnd'> & {
  /** A sprite name, a node, or `null` to suppress the standalone chevron. */
  iconEnd?: IconSlot | null;
  as?: ElementType;
} & Root<AnchorHTMLAttributes<HTMLAnchorElement>>;
export declare function Link(props: LinkProps): JSX.Element;

/** An icon-only Button named by one `label`: its aria-label and its Tooltip. */
export type IconButtonProps = {
  label: string;
  icon: IconSlot;
  placement?: TooltipProps['placement'];
} & Omit<ButtonProps, 'iconOnly' | 'iconStart' | 'iconEnd' | 'children' | 'aria-label'>;
export declare function IconButton(props: IconButtonProps): JSX.Element;

// ---- status ------------------------------------------------------------------

export type BannerProps = From<T.BannerProps, 'title' | 'children' | 'actions' | 'icon', 'onDismiss'> & {
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
} & Root<HTMLAttributes<HTMLDivElement>>;
export declare function Banner(props: BannerProps): JSX.Element;

export type InlineProps = From<T.InlineProps, 'children' | 'icon'> & Root<HTMLAttributes<HTMLSpanElement>>;
export declare function Inline(props: InlineProps): JSX.Element;

export type TagProps = From<T.TagProps, 'children' | 'icon'> & Root<HTMLAttributes<HTMLSpanElement>>;
export declare function Tag(props: TagProps): JSX.Element;

export type ChipProps = From<T.ChipProps, 'children' | 'icon' | 'caret', 'onRemove' | 'onClick'> & {
  /** Present ⇒ a removable token: a span with a remove button. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
} & Root<HTMLAttributes<HTMLButtonElement>>;
export declare function Chip(props: ChipProps): JSX.Element;

export type ToastProps = From<T.ToastProps, 'title' | 'children' | 'actions' | 'icon', 'onDismiss'> & {
  onDismiss?: () => void;
} & Root<HTMLAttributes<HTMLDivElement>>;
/** One toast's markup. Raise toasts with `useToast()` under a `<ToastProvider>`. */
export declare function Toast(props: ToastProps): JSX.Element;

export interface ToastProviderProps {
  children?: ReactNode;
  placement?: string;
  /** Milliseconds before a toast leaves. Errors stay until dismissed. */
  duration?: number;
  /** How many show at once; the oldest is dropped first. */
  max?: number;
  iconHref?: string;
}
export declare function ToastProvider(props: ToastProviderProps): JSX.Element;
export type ToastOptions = Omit<ToastProps, 'onDismiss'> & {
  /** Re-raising an id replaces that toast rather than stacking another. */
  id?: string;
  duration?: number;
  onDismiss?: () => void;
};
export declare function useToast(): { toast(options: ToastOptions | string): string; dismiss(id: string): void };

// ---- content -----------------------------------------------------------------

export type AvatarProps = Known<T.AvatarProps> & Root<HTMLAttributes<HTMLSpanElement>>;
export declare function Avatar(props: AvatarProps): JSX.Element;

export type CardProps = From<T.CardProps, 'kicker' | 'title' | 'body' | 'meta' | 'actions' | 'children', 'onClick'>
  & Root<ButtonHTMLAttributes<HTMLButtonElement>>;
export declare function Card(props: CardProps): JSX.Element;

export type EmptyStateProps = From<T.EmptyStateProps, 'title' | 'body' | 'actions', 'icon' | 'image'> & {
  icon?: IconSlot;
  /** An image src, or a node. */
  image?: string | ReactNode;
  className?: string;
};
export declare function EmptyState(props: EmptyStateProps): JSX.Element;

export type IconProps = Known<T.IconProps> & Omit<SVGProps<SVGSVGElement>, 'name' | 'href' | 'ref'>;
/** One glyph from the in-document sprite. Decorative unless given `aria-label`, `aria-labelledby` or `role`. */
export declare function Icon(props: IconProps): JSX.Element;

export interface MenuItem {
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}
export declare function Menu(props: { items?: MenuItem[]; className?: string }): JSX.Element;

export type ModalProps = From<T.ModalProps, 'title' | 'children' | 'actions' | 'cancel', 'onClose' | 'onBack'> & {
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Present ⇒ draws the back affordance, which pops ONE level of a flow. */
  onBack?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};
export declare function Modal(props: ModalProps): JSX.Element;

export type NavProps = From<T.NavProps, 'logo' | 'links' | 'title' | 'subtitle' | 'actions' | 'children', 'onBack'> & {
  onBack?: (event: MouseEvent<HTMLButtonElement>) => void;
} & Root<HTMLAttributes<HTMLElement>>;
export declare function Nav(props: NavProps): JSX.Element;

export type RowProps = From<T.RowProps, 'lead' | 'title' | 'subtitle' | 'trail', 'chevron'> & {
  /** `true` draws chevron-right; a node is used as given. */
  chevron?: true | ReactNode;
  /** The anchor to render with `href`, e.g. a router's Link. */
  as?: ElementType;
} & Root<HTMLAttributes<HTMLElement>> & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>;
export declare function Row(props: RowProps): JSX.Element;

export type SkeletonProps = From<T.SkeletonProps> & Root<HTMLAttributes<HTMLSpanElement>>;
export declare function Skeleton(props: SkeletonProps): JSX.Element;

export interface TableColumn { key: string; label?: ReactNode; className?: string }
export type TableProps = {
  columns?: TableColumn[];
  rows?: Record<string, ReactNode>[];
  /** Composed `<thead>`/`<tbody>`, used when there are no `columns`. */
  children?: ReactNode;
} & Root<TableHTMLAttributes<HTMLTableElement>>;
export declare function Table(props: TableProps): JSX.Element;

export interface TabItem {
  id?: string;
  label?: ReactNode;
  icon?: string;
  iconHref?: string;
  /** Renders a group heading instead of a tab. */
  section?: ReactNode;
}
export declare function Tabs(props: {
  tabs?: TabItem[];
  active?: string;
  onChange?: (id: string | undefined) => void;
  className?: string;
}): JSX.Element;

// ---- fields ------------------------------------------------------------------

type Field<P, S extends PropertyKey, A, Drop extends PropertyKey = never> = From<P, S | 'label' | 'help' | 'error', Drop> & Root<A> & {
  /** Ties the label and the help/error line to the control. Generated when omitted. */
  id?: string;
};

export type TextFieldProps = Field<T.TextFieldProps, 'prefix', InputHTMLAttributes<HTMLInputElement>> & {
  iconStart?: IconSlot;
  iconEnd?: IconSlot;
  endAction?: { icon: IconSlot; label: string; onClick?: (event: MouseEvent<HTMLButtonElement>) => void };
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
export declare function TextField(props: TextFieldProps): JSX.Element;

/** An `<option>` holds only text, in HTML and in React. */
export type SelectOption = string | { value?: string; label?: string | number };
export interface SelectOptGroup { label?: string; options?: SelectOption[] }
export type SelectProps = Field<T.SelectProps, never, SelectHTMLAttributes<HTMLSelectElement>, 'options'> & {
  options?: (SelectOption | SelectOptGroup)[];
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};
export declare function Select(props: SelectProps): JSX.Element;

type Check<P> = From<P, 'label'> & Root<InputHTMLAttributes<HTMLInputElement>> & {
  id?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
export type CheckboxProps = Check<T.CheckboxProps>;
export declare function Checkbox(props: CheckboxProps): JSX.Element;
export type RadioProps = Check<T.RadioProps>;
export declare function Radio(props: RadioProps): JSX.Element;
export type ToggleProps = Check<T.ToggleProps> & { help?: ReactNode };
export declare function Toggle(props: ToggleProps): JSX.Element;

// ---- the five client components ------------------------------------------------

export type TextareaProps = Field<T.TextareaProps, never, TextareaHTMLAttributes<HTMLTextAreaElement>> & {
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};
/** Client component: the count follows what is typed. */
export declare function Textarea(props: TextareaProps): JSX.Element;

export type CodeFieldProps = From<T.CodeFieldProps, 'label' | 'help' | 'error', 'success' | 'verifying'> & {
  /** `true` renders "Verified". */
  success?: ReactNode | true;
  /** `true` renders "Checking…". */
  verifying?: ReactNode | true;
  /** The digits entered so far. */
  onChange?: (code: string) => void;
  className?: string;
};
/** Client component: typing walks focus, Backspace walks back, a paste fills every box. */
export declare function CodeField(props: CodeFieldProps): JSX.Element;

export interface SegmentedOption { value: string; label?: string; icon?: string; disabled?: boolean }
export type SegmentedControlProps = Omit<Known<T.SegmentedControlProps>, 'options' | 'className' | 'id' | 'style'> & {
  options?: (string | SegmentedOption)[];
  defaultValue?: string;
  onChange?: (value: string) => void;
} & Root<HTMLAttributes<HTMLDivElement>>;
/** Client component: a radiogroup of native radios. Controlled with `value` + `onChange`. */
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;

export type TooltipProps = From<T.TooltipProps, 'label' | 'children'> & {
  /** The bubble's id. Generated when omitted. */
  id?: string;
  ref?: import('react').Ref<HTMLSpanElement>;
} & Root<HTMLAttributes<HTMLSpanElement>>;
/** Client component: opens on hover and focus, fixed outside any clipping ancestor. */
export declare function Tooltip(props: TooltipProps): JSX.Element;

// ---- from @lew-ds/lds ----------------------------------------------------------

export { STATUS_ICON, COMPONENT_ICONS, hueForName, initialsForName, DIAL_CODES, dialOptions } from '@lew-ds/lds';
export type { DialCode, DialOption } from '@lew-ds/lds';
