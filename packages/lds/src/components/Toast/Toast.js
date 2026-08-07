import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';
import { STATUS_ICON } from '../../status-icons.js';

// Toast — a transient message the system raises over the layout.
//
// The line against Banner is not visual, it is about ownership: a banner is a
// field the page contains and it stays until the condition it describes
// changes; a toast is chrome the system raises and it leaves on its own. So a
// toast is the wrong place for anything the user must act on or re-read — if
// dismissing it can lose information, it wanted to be a banner.
//
// Statuses and icons come from the shared map, so a toast error and a banner
// error cannot disagree about what red means.

/** One message. Usually raised via useToast() rather than rendered directly. */
export function Toast({
  status, title, children, actions,
  dismissible = true, onDismiss, dismissLabel = 'Dismiss',
  icon, iconHref, className = '', ...rest
}) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-toast', className].filter(Boolean).join(' ');
  const mark = icon !== undefined ? icon : (STATUS_ICON[status]
    && React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${spriteHref}#${STATUS_ICON[status]}` })));
  // An error is assertive because it interrupts a task; everything else is
  // polite and waits for a gap, rather than cutting across what is being read.
  return React.createElement('div', {
    className: cls,
    'data-status': status || undefined,
    role: status === 'error' ? 'alert' : 'status',
    'aria-live': status === 'error' ? 'assertive' : 'polite',
    ...rest,
  },
    mark,
    React.createElement('div', { className: 'lds-toast__content' },
      title && React.createElement('div', { className: 'lds-toast__title' }, title),
      children,
      actions && React.createElement('div', { className: 'lds-toast__actions' }, actions)),
    dismissible && React.createElement('button', {
      type: 'button', className: 'lds-toast__dismiss', 'aria-label': dismissLabel, onClick: onDismiss,
    }, React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${spriteHref}#close` }))));
}

const ToastContext = React.createContext(null);

let nextId = 0;

/**
 * Owns the queue and the viewport. Mount once, near the root — a toast is
 * global chrome, and two providers would give you two stacks racing for the
 * same corner.
 */
export function ToastProvider({
  children, placement = 'bottom', duration = 5000, max = 3, iconHref,
}) {
  const [toasts, setToasts] = React.useState([]);
  const timers = React.useRef(new Map());

  const dismiss = React.useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const toast = React.useCallback((opts) => {
    const options = typeof opts === 'string' ? { children: opts } : (opts || {});
    const id = options.id ?? `lds-toast-${nextId++}`;
    setToasts((list) => {
      const next = [...list.filter((t) => t.id !== id), { ...options, id }];
      // Oldest out first: the newest message is the one the user is waiting for.
      return next.length > max ? next.slice(next.length - max) : next;
    });
    // An error stays until it is dismissed. A message you have to catch inside
    // five seconds is a message some people will never read.
    const ms = options.duration ?? (options.status === 'error' ? 0 : duration);
    if (ms > 0) {
      const timer = setTimeout(() => dismiss(id), ms);
      timers.current.set(id, timer);
    }
    return id;
  }, [dismiss, duration, max]);

  // A pending timer that fires after unmount would set state on a dead tree.
  React.useEffect(() => {
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); pending.clear(); };
  }, []);

  const api = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return React.createElement(ToastContext.Provider, { value: api },
    children,
    React.createElement('div', { className: `lds-toast-viewport lds-toast-viewport--${placement}` },
      toasts.map(({ id, ...rest }) => React.createElement(Toast, {
        key: id, iconHref, ...rest, onDismiss: () => dismiss(id),
      }))));
}

/** `const { toast, dismiss } = useToast()` — raise a message from anywhere. */
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>');
  return ctx;
}
