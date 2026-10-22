// @lew-ds/lds-react — the Lew Design System as React components.
//
// Each component outputs exactly the markup of its @lew-ds/lds template (the
// parity test holds them byte for byte), as ordinary JSX: it renders on a
// server with every slot in the HTML, hydrates without a wrapper, and takes
// React nodes in its slots. Only the five that hold state — SegmentedControl,
// Tooltip, Textarea, CodeField and the toast queue — are client components.
//
//   import { Banner, Button } from '@lew-ds/lds-react';
//   import { IconSprite } from '@lew-ds/lds-react/icon-sprite';
//   import '@lew-ds/lds/css';
export { Button, ButtonGroup, Link } from './actions.js';
export { Banner, Chip, Inline, Tag, Toast } from './status.js';
export { Avatar, Card, EmptyState, Icon, Menu, Modal, Nav, Row, Skeleton, Table, Tabs } from './content.js';
export { Checkbox, Radio, Select, TextField, Toggle } from './fields.js';
export { IconButton } from './icon-button.js';

export { CodeField } from './code-field.js';
export { SegmentedControl } from './segmented-control.js';
export { Textarea } from './textarea.js';
export { ToastProvider, useToast } from './toast-provider.js';
export { Tooltip } from './tooltip.js';

export {
  STATUS_ICON, COMPONENT_ICONS, hueForName, initialsForName, DIAL_CODES, dialOptions,
} from '@lew-ds/lds';
