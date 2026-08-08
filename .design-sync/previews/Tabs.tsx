import React from 'react';
import { Tabs } from '@lew/lds-react';
import { ensureInlineSprite } from './_sprite';
import { setIconSprite } from '@lew/lds-react';

ensureInlineSprite();
setIconSprite('');

export const Default = () => (
  <div style={{ width: 220 }}>
    <Tabs
      tabs={[
        { id: 'overview', label: 'Overview', icon: 'home' },
        { id: 'activity', label: 'Activity', icon: 'history' },
        { id: 'members', label: 'Members', icon: 'people' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
      ]}
      active="activity"
    />
  </div>
);

export const WithSections = () => (
  <div style={{ width: 220 }}>
    <Tabs
      tabs={[
        { section: 'Workspace' },
        { id: 'overview', label: 'Overview', icon: 'home' },
        { id: 'projects', label: 'Projects', icon: 'folder' },
        { section: 'Account' },
        { id: 'billing', label: 'Billing', icon: 'price' },
        { id: 'security', label: 'Security', icon: 'lock' },
      ]}
      active="projects"
    />
  </div>
);

export const NoIcons = () => (
  <div style={{ width: 220 }}>
    <Tabs
      tabs={[
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'closed', label: 'Closed' },
        { id: 'archived', label: 'Archived' },
      ]}
      active="open"
    />
  </div>
);

export const Featured = () => (
  <div style={{ width: 240 }}>
    <Tabs
      tabs={[
        { id: 'starred', label: 'Starred', icon: 'star' },
        { id: 'flagged', label: 'Flagged', icon: 'flag' },
        { id: 'bookmarked', label: 'Bookmarked', icon: 'bookmark' },
      ]}
      active="starred"
    />
  </div>
);
