import React from 'react';
import { Select } from '@lew-ds/lds-react';

export const Default = () => (
  <Select
    label="Country"
    options={['United States', 'Canada', 'Mexico', 'United Kingdom']}
  />
);

export const ValueLabelPairs = () => (
  <Select
    label="Status"
    value="in_progress"
    onChange={() => {}}
    options={[
      { value: 'open', label: 'Open' },
      { value: 'in_progress', label: 'In progress' },
      { value: 'closed', label: 'Closed' },
    ]}
  />
);

// Groups — twenty countries can legitimately share the "+1" dial code, so
// values need not be unique across groups.
export const OptionGroups = () => (
  <Select
    label="Dial code"
    options={[
      { label: 'North America', options: [
        { value: '+1', label: 'United States (+1)' },
        { value: '+1-ca', label: 'Canada (+1)' },
      ] },
      { label: 'Europe', options: [
        { value: '+44', label: 'United Kingdom (+44)' },
        { value: '+49', label: 'Germany (+49)' },
      ] },
    ]}
  />
);

export const Required = () => (
  <Select label="Plan" required options={['Free', 'Pro', 'Team']} />
);

export const HelpText = () => (
  <Select
    label="Timezone"
    help="Used to schedule reminders and reports."
    options={['Pacific', 'Mountain', 'Central', 'Eastern']}
  />
);

export const ErrorState = () => (
  <Select
    label="Country"
    error="Choose a country to continue."
    options={['United States', 'Canada', 'Mexico']}
  />
);
