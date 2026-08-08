import React from 'react';
import { Modal, Button, ButtonGroup } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

// Modal's `.lds-modal-scrim` has no `position` set (checked packages/lds/css/lds.css)
// — it's a static flex container that centers its child and hugs content
// height by design. There's no fixed/portal overlay to manage here (unlike
// Toast/ToastProvider, which genuinely use position:fixed) — a real app
// places the scrim inside its own fixed-position modal root; this preview
// renders it exactly as the component actually behaves, unwrapped.

export const Default = () => (
  <Modal
    title="Delete workspace?"
    onClose={() => {}}
    actions={
      <ButtonGroup>
        <Button variant="secondary">Cancel</Button>
        <Button hue="red">Delete</Button>
      </ButtonGroup>
    }
  >
    This removes every project and can't be undone.
  </Modal>
);

export const WithBack = () => (
  <Modal title="Payment method" onBack={() => {}} onClose={() => {}}>
    Choose how you'd like to pay.
  </Modal>
);

export const Sheet = () => (
  <Modal title="Filters" sheet onClose={() => {}}>
    Narrow results by category, price, and availability.
  </Modal>
);
