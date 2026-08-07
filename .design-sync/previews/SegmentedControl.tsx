import React from 'react';
import { SegmentedControl } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds';

ensureInlineSprite();
setIconSprite('');

// Renders a radiogroup, not tabs — it changes a property of what's already
// on screen rather than navigating to different content.
export const Default = () => {
  const [range, setRange] = React.useState('week');
  return (
    <SegmentedControl
      label="Range"
      value={range}
      onChange={setRange}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
};

export const WithIcons = () => (
  <SegmentedControl
    label="View"
    defaultValue="list"
    options={[
      { value: 'list', label: 'List', icon: 'list' },
      { value: 'grid', label: 'Grid', icon: 'grid' },
    ]}
  />
);

// Icon-only keeps the label as the accessible name and tooltip — the drawing
// is the affordance, not the label.
export const IconsOnly = () => (
  <SegmentedControl
    label="Layout"
    iconsOnly
    defaultValue="list"
    options={[
      { value: 'list', label: 'List', icon: 'list' },
      { value: 'grid', label: 'Grid', icon: 'grid' },
      { value: 'calendar', label: 'Calendar', icon: 'calendar' },
    ]}
  />
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    <SegmentedControl label="Small" size="sm" defaultValue="a" options={[
      { value: 'a', label: 'One' }, { value: 'b', label: 'Two' },
    ]} />
    <SegmentedControl label="Large" size="lg" defaultValue="a" options={[
      { value: 'a', label: 'One' }, { value: 'b', label: 'Two' },
    ]} />
  </div>
);

// Full width divides the container evenly, for a control that owns a row on
// a phone.
export const FullWidth = () => (
  <div style={{ maxWidth: 420 }}>
    <SegmentedControl label="Mode" full defaultValue="all" options={[
      { value: 'all', label: 'All' },
      { value: 'mine', label: 'Mine' },
      { value: 'shared', label: 'Shared' },
    ]} />
  </div>
);

export const DisabledOption = () => (
  <SegmentedControl label="Plan" defaultValue="free" options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team', disabled: true },
  ]} />
);
