import React from 'react';
import { Toast, Button } from '@lew/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds-react';

ensureInlineSprite();
setIconSprite('');

// Statuses read from the same shared map Banner/Inline use — the blocking
// ones (warning, caution, error) take the filled glyph, success/info stay
// line. `error` also flips role="alert"/aria-live="assertive" internally.
export const Statuses = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 380 }}>
    <Toast status="info" title="Info" dismissible>
      A new version of this page is available.
    </Toast>
    <Toast status="success" title="Saved" dismissible>
      Your changes were saved to the workspace.
    </Toast>
    <Toast status="warning" title="Warning" dismissible>
      This will affect 12 downstream automations.
    </Toast>
    <Toast status="caution" title="Caution" dismissible>
      You're editing a shared template.
    </Toast>
    <Toast status="error" title="Error">
      This one stays until you dismiss it.
    </Toast>
  </div>
);

export const WithAction = () => (
  <div style={{ width: 380 }}>
    <Toast
      status="success"
      title="Moved to archive"
      dismissible
      actions={<Button variant="tertiary" size="sm">Undo</Button>}
    >
      3 items moved out of your inbox.
    </Toast>
  </div>
);

export const Plain = () => (
  <div style={{ width: 380 }}>
    <Toast dismissible>No status. Just a note that something happened.</Toast>
  </div>
);
