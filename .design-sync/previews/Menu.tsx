import React from 'react';
import { Menu, Icon, setIconSprite } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';

ensureInlineSprite();
setIconSprite('');

export const FileActions = () => (
  <Menu
    items={[
      { label: 'Rename', icon: <Icon name="edit" size={16} /> },
      { label: 'Duplicate', icon: <Icon name="copy" size={16} /> },
      { label: 'Download', icon: <Icon name="download" size={16} /> },
      { separator: true },
      { label: 'Delete', icon: <Icon name="trash" size={16} />, danger: true },
    ]}
  />
);

export const KeyboardHints = () => (
  <Menu
    items={[
      { label: 'Cut', hint: '⌘X' },
      { label: 'Copy', hint: '⌘C' },
      { label: 'Paste', hint: '⌘V' },
      { separator: true },
      { label: 'Select all', hint: '⌘A' },
    ]}
  />
);

export const AccountMenu = () => (
  <Menu
    items={[
      { label: 'Profile' },
      { label: 'Billing' },
      { label: 'Settings', disabled: true, hint: 'Admin only' },
      { separator: true },
      { label: 'Log out', danger: true },
    ]}
  />
);
