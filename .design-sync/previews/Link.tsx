import React from 'react';
import { Link, setIconSprite } from '@lew-ds/lds-react';
import { ensureInlineSprite } from './_sprite';

ensureInlineSprite();
setIconSprite('');

export const WithinText = () => (
  <p style={{ maxWidth: 420 }}>
    By continuing, you agree to our <Link href="#">Terms of Service</Link> and{' '}
    <Link href="#">Privacy Policy</Link>.
  </p>
);

export const Quiet = () => (
  <nav style={{ display: 'flex', gap: 16, color: 'var(--text-subdued)' }}>
    <Link href="#" variant="quiet">Overview</Link>
    <Link href="#" variant="quiet">Billing</Link>
    <Link href="#" variant="quiet">Settings</Link>
  </nav>
);

export const Standalone = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
    <Link href="#" variant="standalone">See all plans</Link>
    <Link href="#" variant="standalone">Read the changelog</Link>
  </div>
);

export const StandaloneNoIcon = () => (
  <Link href="#" variant="standalone" iconEnd={null}>
    View documentation
  </Link>
);
