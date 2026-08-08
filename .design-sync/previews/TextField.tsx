import React from 'react';
import { TextField } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

export const Basic = () => (
  <div style={{ width: 280 }}>
    <TextField label="Email" iconStart="mail" placeholder="you@example.com" />
  </div>
);

export const HelpAndRequired = () => (
  <div style={{ width: 280 }}>
    <TextField label="Full name" required help="As it appears on your ID" />
  </div>
);

export const Error = () => (
  <div style={{ width: 280 }}>
    <TextField label="Email" error="That doesn't look like an email address" defaultValue="not-an-email" />
  </div>
);

export const EndAction = () => (
  <div style={{ width: 280 }}>
    <TextField
      label="Password"
      type="password"
      endAction={{ icon: 'eye', label: 'Show password' }}
      defaultValue="hunter2"
    />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 280 }}>
    <TextField label="Workspace" defaultValue="Acme Inc" disabled />
  </div>
);
