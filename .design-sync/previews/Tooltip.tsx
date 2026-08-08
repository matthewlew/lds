import React from 'react';
import { Tooltip, Button } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew-ds/lds-react';

ensureInlineSprite();
setIconSprite('');

// Tooltip has no controlled `open` prop — it opens on hover/focus via the
// vanilla controller's own DOM listeners. @lew-ds/lds-react's components DO
// forward refs to their real rendered root (unlike the old React version —
// see NOTES.md), so focusing the actual <Button ref> on mount is the
// component's own real open path, not a stand-in for it.
function Trigger({ icon, label }: { icon: string; label: string }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => { ref.current?.focus(); }, []);
  return <Button ref={ref} variant="secondary" iconOnly iconStart={icon} aria-label={label} />;
}

export const Default = () => (
  <div style={{ padding: 40 }}>
    <Tooltip label="Search">
      <Trigger icon="search" label="Search" />
    </Tooltip>
  </div>
);

// One trigger per cell: DOM focus is exclusive, so two Trigger mounts in the
// same tree fight over it and only the last one keeps its tooltip open.
export const PlacementTop = () => (
  <div style={{ paddingTop: 80, paddingBottom: 40, paddingLeft: 40, paddingRight: 40 }}>
    <Tooltip label="Above the trigger" placement="top">
      <Trigger icon="star-fill" label="Favorite" />
    </Tooltip>
  </div>
);

export const PlacementBottom = () => (
  <div style={{ padding: 40 }}>
    <Tooltip label="Below the trigger" placement="bottom">
      <Trigger icon="add" label="Add" />
    </Tooltip>
  </div>
);
