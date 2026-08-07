export type ToastStatus = 'info' | 'success' | 'warning' | 'caution' | 'error';

export interface ToastProps {
  /** Carries the shared status icon. `error` announces assertively. */
  status?: ToastStatus;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Overrides the status glyph — a sprite name or a node. */
  icon?: string | React.ReactNode;
  iconHref?: string;
  className?: string;
}
export declare function Toast(props: ToastProps): JSX.Element;

export interface ToastOptions extends ToastProps {
  /** Reuse an id to replace an existing toast rather than stack a duplicate. */
  id?: string;
  /** Milliseconds. 0 never auto-dismisses; errors default to 0. */
  duration?: number;
}

export interface ToastApi {
  /** Raise a message. Returns its id. A bare string is the body. */
  toast(options: ToastOptions | string): string;
  dismiss(id: string): void;
}

export interface ToastProviderProps {
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'top-start' | 'bottom-start';
  /** Default auto-dismiss in ms. Errors ignore this and stay until dismissed. */
  duration?: number;
  /** Queue ceiling; oldest is dropped first. */
  max?: number;
  iconHref?: string;
}
/** Owns the queue and the viewport. Mount once, near the root. */
export declare function ToastProvider(props: ToastProviderProps): JSX.Element;

export declare function useToast(): ToastApi;
