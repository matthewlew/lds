import React from 'react';
import { CodeField, setIconSprite } from '@lew/lds';
import { ensureInlineSprite } from './_sprite';

ensureInlineSprite();
setIconSprite('');

export const Default = () => <CodeField label="Enter the 6-digit code" length={6} />;

export const Grouped = () => (
  <CodeField label="Confirmation code" length={6} groupAfter={3} help="Sent to you by text message." />
);

export const Verifying = () => <CodeField label="Enter the 6-digit code" length={6} value="482" verifying />;

export const Verified = () => <CodeField label="Enter the 6-digit code" length={6} value="482913" success />;

export const ErrorState = () => (
  <CodeField label="Enter the 6-digit code" length={6} value="482910" error="That code didn't match. Try again." />
);

export const SmallFourDigit = () => <CodeField label="PIN" length={4} size="sm" />;
