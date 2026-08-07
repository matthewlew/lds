import React from 'react';
import { Skeleton } from '@lew/lds';

// A loading placeholder for a card: title, two lines of body text (the last
// one shorter, via `last`), and a caption.
export const CardLoading = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" last />
    <Skeleton variant="caption" />
  </div>
);

// A row-style placeholder: circular avatar beside two stacked lines.
export const RowLoading = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Skeleton variant="circle" style={{ width: 40, height: 40 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" last style={{ width: '60%' }} />
    </div>
  </div>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="caption" />
    <Skeleton variant="circle" style={{ width: 32, height: 32 }} />
  </div>
);
