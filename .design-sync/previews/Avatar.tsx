import React from 'react';
import { Avatar } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

// A tiny inline photo placeholder — no network dependency for the "image" story.
const PHOTO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>" +
  "<rect width='96' height='96' fill='%23E08E45'/>" +
  "<circle cx='48' cy='36' r='18' fill='%23FCEEDD'/>" +
  "<ellipse cx='48' cy='92' rx='32' ry='26' fill='%23FCEEDD'/></svg>";

export const Initials = () => <Avatar name="Ada Lovelace" />;

export const Fallback = () => <Avatar />;

export const Image = () => <Avatar name="Ada Lovelace" src={PHOTO} />;

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Avatar name="Grace Hopper" size="xs" />
    <Avatar name="Grace Hopper" size="sm" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Grace Hopper" size="lg" />
    <Avatar name="Grace Hopper" size="xl" />
    <Avatar name="Grace Hopper" size="2xl" />
  </div>
);

export const HueOverride = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Avatar name="Alan Turing" hue="blue" />
    <Avatar name="Alan Turing" hue="violet" />
    <Avatar name="Alan Turing" hue="green" />
  </div>
);

export const Ring = () => (
  <div style={{ display: 'flex', gap: -8, padding: 12, background: 'var(--surface-secondary, #1d1d1d)', borderRadius: 8 }}>
    <Avatar name="Katherine Johnson" ring style={{ marginRight: -8 }} />
    <Avatar name="Dorothy Vaughan" ring style={{ marginRight: -8 }} />
    <Avatar name="Mary Jackson" ring />
  </div>
);
