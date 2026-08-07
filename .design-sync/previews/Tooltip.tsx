import React from 'react';
import { Tooltip, Icon } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds';

ensureInlineSprite();
setIconSprite('');

// Tooltip has no controlled `open` prop — it opens on hover/focus via its own
// internal state (packages/lds/src/components/Tooltip/Tooltip.js), and none
// of the LDS components use forwardRef, so a ref can't reach the real <Button>
// DOM node. Use a native <button> carrying the exact classes Button emits for
// variant="secondary" iconOnly (real DS class vocabulary, just ref-able), and
// focus it on mount — that's the component's own real open path, not a
// fake stand-in for it.
function Trigger({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => { ref.current?.focus(); }, []);
  return (
    <button ref={ref} type="button" className="lds-btn lds-btn--secondary lds-btn--icon">
      {children}
    </button>
  );
}

export const Default = () => (
  <div style={{ padding: 40 }}>
    <Tooltip label="Search">
      <Trigger>
        <span className="lds-btn__icon"><Icon name="search" /></span>
      </Trigger>
    </Tooltip>
  </div>
);

// One trigger per cell: DOM focus is exclusive, so two Trigger mounts in the
// same tree fight over it and only the last one keeps its tooltip open.
export const PlacementTop = () => (
  <div style={{ paddingTop: 80, paddingBottom: 40, paddingLeft: 40, paddingRight: 40 }}>
    <Tooltip label="Above the trigger" placement="top">
      <Trigger>
        <span className="lds-btn__icon"><Icon name="star-fill" /></span>
      </Trigger>
    </Tooltip>
  </div>
);

export const PlacementBottom = () => (
  <div style={{ padding: 40 }}>
    <Tooltip label="Below the trigger" placement="bottom">
      <Trigger>
        <span className="lds-btn__icon"><Icon name="add" /></span>
      </Trigger>
    </Tooltip>
  </div>
);
