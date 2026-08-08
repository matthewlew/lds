import React from 'react';
import { Radio } from '@lew/lds-react';

// Radio has no RadioGroup parent — a real group is composed by hand, several
// <Radio> siblings sharing one `name` so only one can be checked at a time.

export const Group = () => {
  const [plan, setPlan] = React.useState('pro');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio label="Free" name="plan" checked={plan === 'free'} onChange={() => setPlan('free')} />
      <Radio label="Pro" name="plan" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
      <Radio label="Team" name="plan" checked={plan === 'team'} onChange={() => setPlan('team')} />
    </div>
  );
};

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Radio label="Available" name="disabled-group" checked onChange={() => {}} />
    <Radio label="Unavailable" name="disabled-group" disabled />
  </div>
);

export const Unlabeled = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Radio name="rating" aria-label="1 star" />
    <Radio name="rating" aria-label="2 stars" checked onChange={() => {}} />
    <Radio name="rating" aria-label="3 stars" />
  </div>
);
