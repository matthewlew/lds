import React from 'react';
import { Icon, setIconSprite } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';

// See _sprite.ts for why this is inlined rather than a plain URL.
ensureInlineSprite();
setIconSprite('');

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Icon name="star-fill" size={16} />
    <Icon name="star-fill" size={24} />
    <Icon name="star-fill" size={32} />
  </div>
);

export const Gallery = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Icon name="add" size={24} />
    <Icon name="search" size={24} />
    <Icon name="warning-fill" size={24} />
    <Icon name="checkbox-on-fill" size={24} />
    <Icon name="close" size={24} />
  </div>
);
