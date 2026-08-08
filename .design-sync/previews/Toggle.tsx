import React from 'react';
import { Toggle } from '@lew/lds-react';

export const Default = () => (
  <div style={{ width: 320 }}>
    <Toggle label="Email notifications" help="Get a summary every Monday morning." checked onChange={() => {}} />
  </div>
);

export const OnOff = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Toggle label="Two-factor authentication" checked onChange={() => {}} />
    <Toggle label="Public profile" checked={false} onChange={() => {}} />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Toggle label="SSO enforced" help="Managed by your organization's admin." checked disabled />
    <Toggle label="Legacy export" disabled />
  </div>
);

export const LabelOnly = () => (
  <div style={{ width: 320 }}>
    <Toggle label="Auto-save drafts" checked onChange={() => {}} />
  </div>
);
