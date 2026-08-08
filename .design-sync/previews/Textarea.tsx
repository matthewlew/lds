import React from 'react';
import { Textarea } from '@lew/lds-react';

export const WithCount = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Bio" maxLength={140} defaultValue="Product designer working on the checkout team." />
  </div>
);

export const HelpAndRequired = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Description" required help="Shown on the public listing page." />
  </div>
);

export const Error = () => (
  <div style={{ width: 320 }}>
    <Textarea
      label="Reason for cancellation"
      required
      error="Tell us a bit more before you continue."
    />
  </div>
);

export const NearLimit = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Tweet" maxLength={80} defaultValue="Shipping the new toast queue today — three max, oldest drops first." />
  </div>
);

export const ShowCount = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Notes" showCount defaultValue="Follow up after the design review on Thursday." />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Internal comment" defaultValue="Locked while the request is under review." disabled />
  </div>
);
