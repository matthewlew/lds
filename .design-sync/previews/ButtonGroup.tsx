import React from 'react';
import { ButtonGroup, Button } from '@lew-ds/lds-react';

export const Default = () => (
  <ButtonGroup>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </ButtonGroup>
);

export const Split = () => (
  <div style={{ width: 420 }}>
    <ButtonGroup align="split">
      <Button hue="red" variant="secondary">Delete</Button>
      <Button variant="primary">Save changes</Button>
    </ButtonGroup>
  </div>
);

export const Conversion = () => (
  <div style={{ width: 320 }}>
    <ButtonGroup detail="$240" detailNote="2 nights">
      <Button variant="primary">Reserve</Button>
    </ButtonGroup>
  </div>
);

export const Vertical = () => (
  <div style={{ width: 260 }}>
    <ButtonGroup orientation="vertical">
      <Button variant="secondary">Continue with Google</Button>
      <Button variant="secondary">Continue with email</Button>
      <Button variant="tertiary">Cancel</Button>
    </ButtonGroup>
  </div>
);

export const FillWidth = () => (
  <div style={{ width: 360 }}>
    <ButtonGroup width="fill">
      <Button variant="secondary">Back</Button>
      <Button variant="primary">Next</Button>
    </ButtonGroup>
  </div>
);
