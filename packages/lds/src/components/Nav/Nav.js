import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

// Nav — two bars that share a name because they sit in the same slot, not
// because they do the same job.
//
//   variant="brand"  a marketing header: logo, links, one level deep.
//   variant="bar"    the chrome of a screen inside a stack.
//
// The bar is the one the system was missing. It carries `onBack`, which pops ONE
// level of a flow, and it is deliberately the same affordance as Modal's — same
// 36px round target, same chevron-left, same origin edge — because a pushed
// screen and a bottom sheet are one navigation seen from two angles, and a back
// arrow that changed shape between them would read as a different control.
export function Nav({
  variant = 'brand',
  logo, links,
  title, subtitle, onBack, backLabel = 'Back', actions,
  sticky, scrolled,
  iconHref, className = '', children, ...rest
}) {
  const spriteHref = resolveSprite(iconHref);
  const bar = variant === 'bar';
  const cls = ['lds-nav',
    bar ? 'lds-nav--bar' : '',
    sticky ? 'lds-nav--sticky' : '',
    bar && scrolled ? 'lds-nav--scrolled' : '',
    className].filter(Boolean).join(' ');

  if (!bar) {
    return React.createElement('nav', { className: cls, ...rest },
      logo && React.createElement('div', { className: 'lds-nav__logo' }, logo),
      links && React.createElement('div', { className: 'lds-nav__links lds-nav__spacer' }, links),
      children);
  }

  // aria-label rather than a heading: the bar labels the region, and promoting
  // its title to an <h1> would fight whatever heading the screen itself has.
  return React.createElement('nav', {
    className: cls,
    'aria-label': typeof title === 'string' ? title : undefined,
    ...rest,
  },
    onBack && React.createElement('button', {
      type: 'button', className: 'lds-nav__back', 'aria-label': backLabel, onClick: onBack,
    }, React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${spriteHref}#chevron-left` }))),
    (title || subtitle) && React.createElement('div', { className: 'lds-nav__titles' },
      title && React.createElement('div', { className: 'lds-nav__title' }, title),
      subtitle && React.createElement('div', { className: 'lds-nav__subtitle' }, subtitle)),
    actions && React.createElement('div', { className: 'lds-nav__actions' }, actions),
    children);
}
