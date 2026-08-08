import React from 'react';
import { Tag, Icon } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

export const Hues = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 420 }}>
    <Tag hue="red">Critical</Tag>
    <Tag hue="orange">High</Tag>
    <Tag hue="yellow">Medium</Tag>
    <Tag hue="green" dot>Live</Tag>
    <Tag hue="cyan">Beta</Tag>
    <Tag hue="blue">v2.1.0</Tag>
    <Tag hue="violet">Internal</Tag>
    <Tag hue="pink">New</Tag>
    <Tag hue="gray">Archived</Tag>
  </div>
);

export const Emphasis = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Tag hue="blue" emphasis="plain">Plain</Tag>
    <Tag hue="blue" emphasis="subtle">Subtle</Tag>
    <Tag hue="blue" emphasis="soft">Soft</Tag>
    <Tag hue="blue" emphasis="strong">Strong</Tag>
    <Tag hue="blue" emphasis="stark">Stark</Tag>
  </div>
);

export const Statuses = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag status="info">Info</Tag>
    <Tag status="success" dot>Success</Tag>
    <Tag status="warning">Warning</Tag>
    <Tag status="caution">Caution</Tag>
    <Tag status="error">Error</Tag>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag hue="green" icon={<Icon name="check" />}>Verified</Tag>
    <Tag hue="yellow" size="sm">v1.4.2</Tag>
    <Tag hue="gray" size="sm">42 items</Tag>
  </div>
);

export const InteractiveAndInactive = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Tag hue="blue" interactive>Frontend</Tag>
    <Tag hue="blue" interactive>Backend</Tag>
    <Tag hue="gray" inactive>Deprecated</Tag>
  </div>
);
