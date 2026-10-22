'use client';
// Toasts are chrome the system raises, not components a page places: one
// <ToastProvider> near the root holds the queue and the viewport, and
// `useToast()` raises a message from anywhere beneath it. It keeps
// `mountToasts`'s rules — `max` on screen with the oldest dropped first, a
// timeout per message, errors staying until dismissed, and re-raising an id
// replacing the message rather than stacking it.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from './status.js';

const ToastContext = createContext(null);
let seq = 0;

export function ToastProvider({ children, placement = 'bottom', duration = 5000, max = 3, iconHref }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const clearTimer = (id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  };
  const dismiss = useCallback((id) => {
    clearTimer(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);
  const toast = useCallback((opts) => {
    const options = typeof opts === 'string' ? { children: opts } : (opts || {});
    const id = options.id ?? `lds-toast-${seq++}`;
    clearTimer(id);
    setToasts((list) => {
      const next = [...list.filter((t) => t.id !== id), { ...options, id }];
      for (const dropped of next.slice(0, Math.max(0, next.length - max))) clearTimer(dropped.id);
      return next.slice(-max);
    });
    const ms = options.duration ?? (options.status === 'error' ? 0 : duration);
    if (ms > 0) timers.current.set(id, setTimeout(() => dismiss(id), ms));
    return id;
  }, [duration, max, dismiss]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={`lds-toast-viewport lds-toast-viewport--${placement}`}>
        {toasts.map(({ id, duration: _duration, ...t }) => (
          <Toast key={id} iconHref={iconHref} {...t} onDismiss={() => { t.onDismiss?.(); dismiss(id); }} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** `{ toast(options) → id, dismiss(id) }` from the nearest <ToastProvider>. */
export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() needs a <ToastProvider> above it');
  return api;
}
