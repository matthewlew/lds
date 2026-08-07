import React from 'react';
import { EmptyState, Button } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds';

ensureInlineSprite();
setIconSprite('');

export const Default = () => (
  <div style={{ width: 320 }}>
    <EmptyState icon="search" title="No results" body="Try a different search term." />
  </div>
);

export const WithAction = () => (
  <div style={{ width: 320 }}>
    <EmptyState
      icon="folder"
      title="No projects yet"
      body="Create your first project to get started."
      actions={<Button variant="primary">New project</Button>}
    />
  </div>
);

export const Expressive = () => (
  <div style={{ width: 320 }}>
    <EmptyState icon="star-fill" expressive title="Welcome" body="Your dashboard will populate as you go." />
  </div>
);
