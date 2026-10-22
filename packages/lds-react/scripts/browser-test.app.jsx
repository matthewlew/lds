// The page browser-test.mjs renders on the server and hydrates in Chromium:
// the stateful components, handlers on stateless ones used from a client
// component, and a tooltip inside a clipping panel.
import { useState } from 'react';
import {
  Banner, Button, Chip, CodeField, IconButton, SegmentedControl, Table, Textarea, TextField,
  ToastProvider, Tooltip, useToast,
} from '../src/index.js';
import { IconSprite } from '../src/icon-sprite.js';

function Raise() {
  const { toast } = useToast();
  return (
    <>
      <Button id="raise" onClick={() => toast({ status: 'success', children: 'Saved.', duration: 0 })}>Raise</Button>
      <Button id="raise-many" onClick={() => { for (let i = 0; i < 5; i++) toast({ children: `#${i}`, duration: 0 }); }}>Many</Button>
    </>
  );
}

export function App() {
  const [clicks, setClicks] = useState(0);
  const [view, setView] = useState('grid');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [chip, setChip] = useState({ clicked: 0, removed: 0 });
  const [submits, setSubmits] = useState(0);
  const [editing, setEditing] = useState(false);
  return (
    <ToastProvider>
      <IconSprite icons={['search', 'edit', 'grid', 'list']} />
      <output id="state">{JSON.stringify({ clicks, view, code, name, chip, submits })}</output>

      <Button id="count" onClick={() => setClicks((n) => n + 1)}>Count</Button>
      <Banner status="warning" title="Heads up" dismissible onDismiss={() => setClicks((n) => n + 100)}>Body</Banner>

      <SegmentedControl
        id="seg" label="View" value={view} onChange={setView}
        options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
      />
      <div id="notes"><Textarea label="Notes" maxLength={10} defaultValue="hi" /></div>
      <div id="otp"><CodeField length={4} onChange={setCode} /></div>
      <div id="name"><TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} help="As on the card." /></div>
      <Chip id="chip" onClick={() => setChip((c) => ({ ...c, clicked: c.clicked + 1 }))}
        onRemove={() => setChip((c) => ({ ...c, removed: c.removed + 1 }))}>Token</Chip>
      <Raise />

      <div id="clip" style={{ overflow: 'hidden', width: 200, height: 48, marginTop: 80, marginLeft: 120 }}>
        <IconButton id="edit-card" label="Edit card" icon="edit" />
        <Tooltip label="Searches every card"><Button id="search-cards" iconOnly iconStart="search" aria-label="Search" /></Tooltip>
      </div>

      <form id="filters" onSubmit={(e) => { e.preventDefault(); setSubmits((n) => n + 1); }}>
        <IconButton id="row-action" label="Edit row" icon="edit" />
      </form>

      <Button id="toggle-editing" onClick={() => setEditing((on) => !on)}>Toggle</Button>
      <div id="swap">
        <Tooltip label="Changes are saved as you type">
          {editing
            ? <Button key="save" id="swap-save" iconOnly iconStart="check" aria-label="Done" />
            : <Button key="edit" id="swap-edit" iconOnly iconStart="edit" aria-label="Edit" />}
        </Tooltip>
      </div>

      <Table aria-label="Cards">
        <thead><tr><th scope="col">Card</th><th scope="col">Due</th></tr></thead>
        <tbody><tr data-card="visa"><th scope="row">Visa</th><td>Oct 30</td></tr></tbody>
      </Table>
    </ToastProvider>
  );
}
