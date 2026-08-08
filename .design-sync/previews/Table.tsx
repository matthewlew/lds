import React from 'react';
import { Table, Tag } from '@lew-ds/lds-react';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const rows = [
  { name: 'Ada Lovelace', role: 'Engineering', status: <Tag hue="green" dot>Active</Tag> },
  { name: 'Grace Hopper', role: 'Product', status: <Tag hue="green" dot>Active</Tag> },
  { name: 'Alan Turing', role: 'Research', status: <Tag hue="gray">Invited</Tag> },
];

export const Default = () => <Table columns={columns} rows={rows} />;

export const Empty = () => <Table columns={columns} rows={[]} />;
