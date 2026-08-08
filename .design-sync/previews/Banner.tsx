import React from 'react';
import { Banner, Button } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

export const StatusSweep = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 420 }}>
    <Banner status="info" title="New pricing takes effect Sept 1">
      Review your plan to avoid surprises on your next invoice.
    </Banner>
    <Banner status="success" title="Backup complete">
      Your data was saved to the cloud just now.
    </Banner>
    <Banner status="warning" title="Storage almost full">
      You've used 92% of your quota.
    </Banner>
    <Banner status="caution" title="Unverified sender">
      This message failed SPF and DKIM checks.
    </Banner>
    <Banner status="error" title="Payment failed">
      We couldn't charge your card ending in 4242.
    </Banner>
  </div>
);

export const EmphasisStrong = () => (
  <div style={{ width: 420 }}>
    <Banner
      status="error"
      emphasis="strong"
      title="Account suspended"
      actions={<Button hue="red" variant="secondary" size="sm">Contact support</Button>}
    >
      Repeated failed payments have paused your subscription.
    </Banner>
  </div>
);

export const Page = () => (
  <Banner status="warning" page title="Scheduled maintenance">
    Search will be intermittently unavailable tonight, 11pm–1am PT.
  </Banner>
);

export const DismissibleWithActions = () => (
  <div style={{ width: 420 }}>
    <Banner
      status="success"
      title="Changes saved"
      dismissible
      onDismiss={() => {}}
      actions={<Button variant="tertiary" size="sm">View history</Button>}
    >
      Your profile updates are live.
    </Banner>
  </div>
);
