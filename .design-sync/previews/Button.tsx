import React from 'react';
import { Button } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button variant="primary">Save</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="tertiary">Learn more</Button>
  </div>
);

export const WithIcons = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button iconStart="add">Add</Button>
    <Button iconEnd="chevron-right">Continue</Button>
    <Button iconOnly iconStart="search" aria-label="Search" />
  </div>
);

export const Subtitle = () => <Button subtitle="from $40">Book</Button>;

export const Destructive = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button hue="red" variant="secondary">Delete account</Button>
    <Button hue="red" variant="secondary" armed>Confirm delete</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const AsLink = () => <Button href="#pricing">View pricing</Button>;
