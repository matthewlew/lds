import React from 'react';
import { Row, Avatar } from '@lew/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds-react';

ensureInlineSprite();
setIconSprite('');

export const Default = () => (
  <div style={{ width: 320, border: '1px solid var(--border)', borderRadius: 8 }}>
    <Row title="Notifications" subtitle="Email and push" chevron />
    <Row title="Privacy" subtitle="Who can see your profile" chevron />
  </div>
);

export const WithLead = () => (
  <div style={{ width: 320, border: '1px solid var(--border)', borderRadius: 8 }}>
    <Row lead={<Avatar name="Ada Lovelace" />} title="Ada Lovelace" subtitle="ada@example.com" chevron />
  </div>
);

export const Selected = () => (
  <div style={{ width: 320, border: '1px solid var(--border)', borderRadius: 8 }}>
    <Row title="Compact" selected />
    <Row title="Comfortable" />
  </div>
);
