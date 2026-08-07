import React from 'react';
import { Nav, Button, Row } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds';

ensureInlineSprite();
setIconSprite('');

const frame: React.CSSProperties = {
  border: '1px solid var(--gray-200)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
  background: 'var(--background)',
  maxWidth: 480,
};

// Marketing header — logo, links, one level deep. Nothing to go back to.
export const Brand = () => (
  <Nav
    logo={<span>Lew<b>.</b></span>}
    links={
      <>
        <a href="#">Work</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </>
    }
  />
);

// App bar — the chrome of a screen inside a stack. Title truncates to one
// line rather than wrap, since a wrapping title would change the height of
// the chrome and shift every screen below it.
export const Bar = () => (
  <div style={frame}>
    <Nav
      variant="bar"
      title="A title long enough that it has to truncate rather than wrap"
      actions={<Button variant="tertiary" iconOnly iconStart="more-horizontal" aria-label="More" />}
    />
    <div style={{ padding: 16, fontSize: 'var(--text-body)', color: 'var(--text-subdued)' }}>
      Screen content.
    </div>
  </div>
);

// A pushed screen mid-stack: back pops one level, subtitle names the level
// above. Deliberately the same affordance as Modal's onBack — same 36px
// round target, same chevron-left, same origin edge.
export const BackAndSubtitle = () => (
  <div style={frame}>
    <Nav
      variant="bar"
      scrolled
      title="Notifications"
      subtitle="Settings"
      onBack={() => {}}
      actions={<Button variant="tertiary" size="sm">Reset</Button>}
    />
    <div>
      <Row title="Email" chevron />
      <Row title="Push" chevron />
      <Row title="Weekly digest" chevron />
    </div>
  </div>
);

// Top of the stack: no onBack, so no back button renders — there's nowhere
// left to go.
export const TopOfStack = () => (
  <div style={frame}>
    <Nav variant="bar" title="Settings" />
    <div>
      <Row title="Account" chevron />
      <Row title="Notifications" chevron />
      <Row title="Appearance" chevron />
    </div>
  </div>
);
