import React from 'react';
import { Card, Button } from '@lew/lds-react';

export const Default = () => (
  <div style={{ width: 320 }}>
    <Card
      kicker="Design systems"
      title="Design tokens 101"
      body="A primer on why tokens replace hardcoded values across every surface."
    />
  </div>
);

export const WithMetaActions = () => (
  <div style={{ width: 320 }}>
    <Card
      kicker="Engineering"
      title="Shipping the new grid"
      body="How we rebuilt layout primitives without breaking a single page."
      meta="12 min read · Aug 2026"
      actions={<Button variant="tertiary" size="sm">Read more</Button>}
    />
  </div>
);

export const Selectable = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Card
      selectable
      title="Starter"
      body="For individuals trying things out."
    />
    <Card
      selectable
      selected
      title="Pro"
      body="For teams that need more seats and history."
    />
  </div>
);

export const HueEmphasis = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Card hue="blue" emphasis="soft" kicker="Tip" title="Keyboard shortcuts" body="Press ? anywhere to see the full list." />
    <Card hue="red" emphasis="strong" kicker="Alert" title="Trial ending" body="Your workspace trial ends in 2 days." />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 260 }}>
    <Card
      selectable
      disabled
      title="Enterprise"
      body="Contact sales to unlock this plan."
    />
  </div>
);
