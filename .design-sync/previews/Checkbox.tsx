import React from 'react';
import { Checkbox } from '@lew-ds/lds-react';

export const Default = () => <Checkbox label="Email me about product updates" />;

export const Checked = () => <Checkbox label="I agree to the Terms of Service" checked onChange={() => {}} />;

export const Group = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Checkbox label="Push notifications" checked onChange={() => {}} />
    <Checkbox label="SMS notifications" onChange={() => {}} />
    <Checkbox label="Marketing emails" onChange={() => {}} />
  </div>
);

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Checkbox label="Managed by your admin" disabled />
    <Checkbox label="Required by your plan" checked disabled onChange={() => {}} />
  </div>
);
