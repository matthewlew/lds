// Exercises the published type surface. This file is never shipped or run — it
// exists so `npm run typecheck` fails if a .d.ts drifts from what the component
// actually accepts.
import * as React from 'react';
import {
  Button, Nav, Toast, ToastProvider, useToast, Tooltip, SegmentedControl,
  Avatar, Banner, dialOptions, setIconSprite,
} from '@lew/lds';
import { ICON_NAMES, hasIcon, useHref, spriteUrl } from '@lew/open-icons';

setIconSprite('/icons.svg');

export function Sample() {
  const { toast, dismiss } = useToast();

  const dials = dialOptions(['United States']);
  const firstDial: string = dials.top[0].label;
  const restCount: number = dials.rest.length;

  const iconOk: boolean = hasIcon('search');
  const href: string = useHref('chevron-right', spriteUrl);
  const names: readonly string[] = ICON_NAMES;

  return React.createElement(ToastProvider, { placement: 'bottom', max: 3 },
    React.createElement(Nav, {
      variant: 'bar',
      title: 'Settings',
      onBack: () => dismiss('x'),
      actions: React.createElement(Button, { variant: 'tertiary', iconOnly: true, iconStart: 'more-horizontal' }),
    }),
    React.createElement(Button, {
      variant: 'primary',
      size: 'lg',
      hue: 'red',
      subtitle: firstDial,
      onClick: () => toast({ status: 'success', title: 'Saved', duration: 4000 }),
    }, 'Save'),
    React.createElement(Button, { href: '/somewhere' }, 'Link button'),
    React.createElement(Tooltip, { label: 'Search', placement: 'end' },
      React.createElement(Button, { iconOnly: true, iconStart: 'search' })),
    React.createElement(SegmentedControl, {
      options: ['Day', { value: 'wk', label: 'Week', icon: 'calendar' }],
      defaultValue: 'Day',
      onChange: (v: string) => toast(v),
    }),
    React.createElement(Avatar, { name: 'Ada Lovelace', size: 'lg', ring: true }),
    React.createElement(Banner, { status: 'error', title: 'Failed' }, 'Try again'),
    React.createElement(Toast, { status: 'info' }, `${restCount} more · ${iconOk} · ${href} · ${names.length}`),
  );
}
