// The prop matrix every binding is checked against.
//
// One list, used three ways: to render each component through React, to render
// it through its template, and to freeze the expected markup as a fixture. That
// is what lets the React binding be deleted without losing the guarantee it was
// providing — the fixtures it produced stay behind as the contract.
//
// Slot values are plain strings on purpose. A slot is a passthrough in both
// bindings, so composed markup adds nothing a string does not already cover,
// and strings keep the fixtures readable and framework-free.
export const CASES = [
  ['Avatar', 'initials', { name: 'Ada Lovelace' }],
  ['Avatar', 'fallback icon', {}],
  ['Avatar', 'image', { name: 'Ada', src: '/a.png' }],
  ['Avatar', 'sizes+ring', { name: 'Grace Hopper', size: 'lg', ring: true }],
  ['Avatar', 'explicit hue', { name: 'X', hue: 'violet' }],

  ['Banner', 'bare', { children: 'Something happened.' }],
  ['Banner', 'info', { status: 'info', children: 'FYI.' }],
  ['Banner', 'success', { status: 'success', children: 'Done.' }],
  ['Banner', 'warning', { status: 'warning', children: 'Careful.' }],
  ['Banner', 'caution', { status: 'caution', children: 'Softer.' }],
  ['Banner', 'error+title+dismiss', { status: 'error', title: 'Failed', dismissible: true, children: 'Retry.' }],
  ['Banner', 'page+emphasis', { page: true, emphasis: 'strong', status: 'info', children: 'System.' }],
  ['Banner', 'actions', { status: 'error', children: 'Failed.', actions: 'ACTIONS' }],
  ['Banner', 'icon suppressed', { status: 'error', icon: null, children: 'No icon.' }],
  ['Banner', 'escaping', { status: 'info', title: '5 > 3 & 2 < 4', children: `Tom & "J" <b> 'x'` }],

  ['Button', 'primary', { variant: 'primary', children: 'Save' }],
  ['Button', 'secondary sm', { variant: 'secondary', size: 'sm', children: 'Draft' }],
  ['Button', 'tertiary lg', { variant: 'tertiary', size: 'lg', children: 'Big' }],
  ['Button', 'icons', { iconStart: 'add', iconEnd: 'chevron-right', children: 'Add' }],
  ['Button', 'icon only', { iconOnly: true, iconStart: 'search' }],
  ['Button', 'subtitle', { subtitle: 'from $40', children: 'Book' }],
  ['Button', 'href', { href: '/x', children: 'Go' }],
  ['Button', 'href disabled', { href: '/x', disabled: true, children: 'Go' }],
  ['Button', 'armed hue', { hue: 'red', armed: true, children: 'Delete' }],
  ['Button', 'fab', { fab: true, iconStart: 'add' }],
  ['Button', 'fab extended', { fab: true, extended: true, iconStart: 'add', children: 'New' }],
  ['Button', 'disabled', { disabled: true, children: 'Nope' }],

  ['ButtonGroup', 'default', { children: 'KIDS' }],
  ['ButtonGroup', 'split fill', { align: 'split', width: 'fill', children: 'KIDS' }],
  ['ButtonGroup', 'vertical', { orientation: 'vertical', children: 'KIDS' }],
  ['ButtonGroup', 'conversion', { detail: '$240', detailNote: '2 nights', children: 'KIDS' }],

  ['Card', 'full', { kicker: 'K', title: 'T', body: 'B', meta: 'M', actions: 'A' }],
  ['Card', 'selectable', { selectable: true, selected: true, title: 'T' }],
  ['Card', 'selectable disabled', { selectable: true, disabled: true, title: 'T' }],
  ['Card', 'emphasis hue', { emphasis: 'soft', hue: 'green', title: 'T' }],

  ['Checkbox', 'labelled', { label: 'Yes', id: 'c1' }],
  ['Checkbox', 'checked disabled', { label: 'Y', checked: true, disabled: true, readOnly: true }],

  ['Chip', 'plain', { children: 'Filter' }],
  ['Chip', 'selected sm', { selected: true, size: 'sm', children: 'On' }],
  ['Chip', 'removable', { onRemove: () => {}, children: 'Token' }],
  ['Chip', 'lg', { size: 'lg', children: 'Big' }],

  ['EmptyState', 'icon', { icon: 'search', title: 'Nothing', body: 'Try again.', actions: 'A' }],
  ['EmptyState', 'image', { image: '/i.png', imageAlt: 'alt', title: 'T' }],
  ['EmptyState', 'expressive', { expressive: true, icon: 'star', title: 'T' }],

  ['Icon', 'basic', { name: 'search' }],
  ['Icon', 'sized', { name: 'star', size: 32 }],

  ['Inline', 'error', { status: 'error', children: 'Bad' }],
  ['Inline', 'success', { status: 'success', children: 'Good' }],
  ['Inline', 'no status', { children: 'Neutral' }],

  ['Link', 'inline', { href: '#', children: 'More' }],
  ['Link', 'quiet', { href: '#', variant: 'quiet', children: 'Quiet' }],
  ['Link', 'standalone', { href: '#', variant: 'standalone', children: 'Go' }],
  ['Link', 'standalone custom icon', { href: '#', variant: 'standalone', iconEnd: 'arrow-right', children: 'Go' }],

  ['Menu', 'items', { items: [{ label: 'Open' }, { separator: true }, { label: 'Delete', danger: true }, { label: 'Off', disabled: true }] }],
  ['Menu', 'hints', { items: [{ label: 'Copy', hint: 'C' }] }],

  ['Modal', 'dialog', { title: 'T', children: 'Body' }],
  ['Modal', 'back+actions', { title: 'T', onBack: () => {}, actions: 'A', cancel: 'C', children: 'B' }],
  ['Modal', 'sheet', { title: 'T', sheet: true, children: 'B' }],
  ['Modal', 'side', { title: 'T', side: true, children: 'B' }],
  ['Modal', 'no large title', { title: 'T', largeTitle: false, children: 'B' }],

  ['Nav', 'brand', { logo: 'Lew', links: 'LINKS' }],
  ['Nav', 'bar', { variant: 'bar', title: 'Settings', subtitle: 'Sub', onBack: () => {}, actions: 'A' }],
  ['Nav', 'bar sticky scrolled', { variant: 'bar', title: 'T', sticky: true, scrolled: true }],

  ['Radio', 'grouped', { label: 'One', name: 'g', id: 'r1' }],
  ['Radio', 'checked', { label: 'One', name: 'g', checked: true, readOnly: true }],

  ['Row', 'full', { title: 'T', subtitle: 'S', lead: 'L', trail: 'R', chevron: true }],
  ['Row', 'compact selected', { title: 'T', compact: true, selected: true }],
  ['Row', 'roomy link', { title: 'T', roomy: true, href: '/x' }],

  ['Select', 'options', { label: 'L', id: 's1', options: ['a', 'b'], help: 'h' }],
  ['Select', 'optgroups', { options: [{ label: 'G', options: ['x', { value: 'y', label: 'Y' }] }] }],
  ['Select', 'error required', { label: 'L', required: true, error: 'Bad', options: ['a'] }],

  ['Skeleton', 'text', { variant: 'text' }],
  ['Skeleton', 'title', { variant: 'title' }],
  ['Skeleton', 'circle last', { variant: 'circle', last: true }],

  ['Table', 'basic', { columns: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }], rows: [{ a: '1', b: '2' }] }],

  ['Tabs', 'active+icon', { tabs: [{ id: 'x', label: 'X', icon: 'star' }, { id: 'y', label: 'Y' }], active: 'x' }],
  ['Tabs', 'section', { tabs: [{ section: 'Group' }, { id: 'a', label: 'A' }], active: 'a' }],

  ['Tag', 'hue dot', { hue: 'green', dot: true, children: 'Live' }],
  ['Tag', 'sm gray', { hue: 'gray', size: 'sm', children: 'v1' }],
  ['Tag', 'status', { status: 'error', children: 'Down' }],
  ['Tag', 'interactive inactive', { interactive: true, inactive: true, children: 'X' }],

  ['TextField', 'basic', { label: 'Email', id: 't1', help: 'h' }],
  ['TextField', 'icons', { label: 'L', iconStart: 'mail', iconEnd: 'check' }],
  ['TextField', 'error required', { label: 'L', required: true, error: 'Bad' }],
  ['TextField', 'prefix', { label: 'Phone', prefix: 'PREFIX' }],

  ['Toggle', 'labelled', { label: 'On', help: 'h', id: 'g1' }],
  ['Toggle', 'checked', { label: 'On', checked: true, readOnly: true }],
];
