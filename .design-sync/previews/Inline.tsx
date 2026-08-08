import React from 'react';
import { Inline, setIconSprite } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';

ensureInlineSprite();
setIconSprite('');

export const Statuses = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
    <Inline status="info">Changes save automatically.</Inline>
    <Inline status="success">Your changes have been saved.</Inline>
    <Inline status="warning">Careful — this can't be undone.</Inline>
    <Inline status="caution">This will notify every member of the team.</Inline>
    <Inline status="error">Something went wrong. Please try again.</Inline>
  </div>
);

export const NoStatus = () => <Inline>Optional — leave blank to use the default.</Inline>;

export const InsideAField = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontWeight: 600 }}>Password</label>
    <input
      type="password"
      value="hunter2"
      readOnly
      style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6 }}
    />
    <Inline status="error">Password must be at least 12 characters.</Inline>
  </div>
);

export const SuppressedIcon = () => (
  <Inline status="warning" icon={null}>
    Warning text without the leading icon.
  </Inline>
);
