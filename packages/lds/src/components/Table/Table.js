import React from 'react';

export function Table({ columns = [], rows = [], className = '' }) {
  return React.createElement('table', { className: ['lds-table', className].filter(Boolean).join(' ') },
    React.createElement('thead', null, React.createElement('tr', null,
      columns.map((c) => React.createElement('th', { key: c.key }, c.label)))),
    React.createElement('tbody', null,
      rows.map((r, i) => React.createElement('tr', { key: i },
        columns.map((c) => React.createElement('td', { key: c.key }, r[c.key]))))));
}