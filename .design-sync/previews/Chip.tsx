import React from 'react';
import { Chip, Icon, setIconSprite } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';

ensureInlineSprite();
setIconSprite('');

export const FilterChips = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Chip selected>Design</Chip>
    <Chip>Engineering</Chip>
    <Chip>Marketing</Chip>
    <Chip>Sales</Chip>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <Chip size="sm" selected>Small</Chip>
    <Chip selected>Default</Chip>
    <Chip size="lg" selected>Large</Chip>
  </div>
);

export const WithIconAndCaret = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Chip icon={<Icon name="calendar" size={14} />} caret={<Icon name="chevron-down" size={12} />}>
      Due date
    </Chip>
    <Chip icon={<Icon name="person" size={14} />} caret={<Icon name="chevron-down" size={12} />}>
      Assignee
    </Chip>
  </div>
);

// A `RemovableTags` (onRemove) story is intentionally not included here:
// `.lds-chip__remove` is missing a native-button reset in lds.css, which
// collapses the close icon to 0×0px in Chromium — a real upstream bug, not
// a preview issue. Showcasing it would ship a visibly-broken card. See
// .design-sync/NOTES.md and .design-sync/learnings/batch-B.md (folded) for
// the root cause and suggested one-line CSS fix.
