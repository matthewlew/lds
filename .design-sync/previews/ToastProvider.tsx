import React from 'react';
import { ToastProvider, useToast, Button } from '@lew/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds-react';

ensureInlineSprite();
setIconSprite('');

// ToastProvider owns the queue and the viewport but has no visual output of
// its own until something raises a toast through useToast() — and that hook
// only works from a component mounted *inside* the provider. This small
// child does exactly what a real page does: call toast() from a descendant
// (here, on mount, standing in for a click handler) so the card shows the
// provider actually doing its job, not an empty wrapper.
function RaiseOnMount({ build }: { build: (toast: ReturnType<typeof useToast>['toast']) => void }) {
  const { toast } = useToast();
  React.useEffect(() => { build(toast); }, []);
  return null;
}

// The card harness mounts each story inside a `transform:translateZ(0)`
// wrapper (its zoom/isolation boundary), which — per ordinary CSS — makes
// that wrapper the containing block for any `position:fixed` descendant.
// A fixed toast doesn't contribute to that wrapper's normal-flow height, so
// without this the wrapper collapses to the ~100px-tall Panel and the
// viewport's `bottom:16px` resolves against that sliver, clipping the toast
// above the visible capture. Giving the story's own root a real minHeight
// keeps the containing block tall enough that "bottom" lands where a real
// page (full viewport height) would put it.
function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: 620, position: 'relative' }}>{children}</div>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 360 }}>
      <div
        style={{
          fontFamily: 'var(--th-ui)',
          fontSize: 'var(--text-control)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--text)',
          marginBottom: 10,
        }}
      >
        Workspace settings
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" size="sm">Save changes</Button>
        <Button variant="secondary" size="sm">Cancel</Button>
      </div>
      {children}
    </div>
  );
}

export const Default = () => (
  <Frame>
    <ToastProvider placement="bottom">
      <Panel>
        <RaiseOnMount
          build={(toast) => toast({ status: 'success', title: 'Saved', children: 'Your changes were saved to the workspace.' })}
        />
      </Panel>
    </ToastProvider>
  </Frame>
);

export const TopStart = () => (
  <Frame>
    <ToastProvider placement="top-start">
      {/* Extra top clearance: a top-start toast lands in the same corner as
          the panel heading, so a real page would reserve space (a header
          bar, page margin) above its content — mirrored here with padding
          rather than letting the toast overlap the "Workspace settings"
          heading. */}
      <div style={{ paddingTop: 140 }}>
        <Panel>
          <RaiseOnMount
            build={(toast) => toast({ status: 'info', title: 'Syncing', children: 'Pulling the latest data from your integrations.' })}
          />
        </Panel>
      </div>
    </ToastProvider>
  </Frame>
);

export const WithAction = () => (
  <Frame>
    <ToastProvider placement="bottom">
      <Panel>
        <RaiseOnMount
          build={(toast) => toast({
            status: 'success',
            title: 'Archived',
            children: '3 items moved out of your inbox.',
            actions: <Button variant="tertiary" size="sm">Undo</Button>,
          })}
        />
      </Panel>
    </ToastProvider>
  </Frame>
);

// max defaults to 3 — the oldest drops first so the newest message (the one
// being waited for) always survives. Raising four on mount leaves three.
export const Queue = () => (
  <Frame>
    <ToastProvider placement="bottom-start">
      <Panel>
        <RaiseOnMount
          build={(toast) => {
            toast({ status: 'info', title: 'Uploading', children: 'cover.png' });
            toast({ status: 'info', title: 'Uploading', children: 'hero.png' });
            toast({ status: 'success', title: 'Uploaded', children: 'logo.svg' });
            toast({ status: 'success', title: 'Uploaded', children: 'favicon.svg' });
          }}
        />
      </Panel>
    </ToastProvider>
  </Frame>
);
