/** Markup that has already been escaped, for composing into a slot. */
export interface RawHtml {
  __html: string;
}

/** Escapes text for HTML, matching React's escaping exactly. */
export declare function escapeHtml(value: unknown): string;

/**
 * Marks a string as already-safe HTML so it can be composed into a slot.
 * An unmarked string is always treated as text and escaped, so the unsafe path
 * has to be chosen deliberately.
 */
export declare function raw(html: string): RawHtml;

/** Resolves a slot: `raw()` passes through, anything else is escaped text. */
export declare function slot(value: unknown): string;

/** A slot takes text (escaped) or `raw()` markup. */
export type Slot = string | number | RawHtml | null | undefined | false;

export interface BannerTemplateProps {
  status?: 'info' | 'success' | 'warning' | 'caution' | 'error';
  emphasis?: 'plain' | 'subtle' | 'soft' | 'strong' | 'stark' | 'media';
  /** Full-bleed square system banner, rather than the rounded content banner. */
  page?: boolean;
  title?: Slot;
  children?: Slot;
  actions?: Slot;
  /** Overrides the status glyph. `null` suppresses it. */
  icon?: Slot;
  iconHref?: string;
  dismissible?: boolean;
  /**
   * Accepted and ignored — the controller binds the handler by delegation
   * after mounting. Present so both bindings share one prop vocabulary.
   */
  onDismiss?: unknown;
  className?: string;
  [attr: string]: unknown;
}

/**
 * Banner as an HTML string. Emits markup byte-identical to the React `Banner`;
 * `npm test` asserts it across a prop matrix.
 */
export declare function banner(props?: BannerTemplateProps): string;
