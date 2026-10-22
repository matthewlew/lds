// Exercises the published types against real usage. Never run — `tsc` fails if
// a declaration drifts from what a component accepts.
import { useRef, type ComponentProps } from 'react';
import {
  Avatar, Banner, Button, ButtonGroup, Card, Checkbox, Chip, CodeField, EmptyState, Icon, IconButton,
  Inline, Link, Menu, Modal, Nav, Radio, Row, SegmentedControl, Select, Skeleton, Table, Tabs, Tag,
  TextField, Textarea, Toast, ToastProvider, Toggle, Tooltip, useToast, COMPONENT_ICONS, STATUS_ICON,
} from '@lew-ds/lds-react';
import { IconSprite } from '@lew-ds/lds-react/icon-sprite';

const RouterLink = (props: ComponentProps<'a'>) => <a {...props} />;

export function Page() {
  const { toast, dismiss } = useToast();
  const tip = useRef<HTMLSpanElement>(null);
  const names: readonly string[] = COMPONENT_ICONS;
  const glyph: string | undefined = STATUS_ICON.error;
  return (
    <ToastProvider max={3} duration={4000}>
      <IconSprite icons={['search', ...names]} />
      <Button emphasis="strong" hue="red" iconStart="add" onClick={() => toast({ status: 'success', children: 'Saved' })}>Add</Button>
      <Button href="/cards" as={RouterLink} iconEnd={<Icon name="external" />} target="_blank">Open</Button>
      <IconButton label="Edit" icon="edit" placement="end" onClick={() => dismiss('x')} />
      <ButtonGroup align="split" detail={<b>Total</b>}><Button variant="secondary">Cancel</Button></ButtonGroup>
      <Link href="/x" variant="standalone" iconEnd={null}>Docs</Link>
      <Banner status="error" title={<strong>Failed</strong>} dismissible onDismiss={(e) => e.currentTarget.blur()} actions={<Button size="sm">Retry</Button>}>
        Try again.
      </Banner>
      <Inline status="warning" role="alert">Check this.</Inline>
      <Tag hue="green" dot icon={<Icon name="clock" />}>Live</Tag>
      <Chip selected onRemove={() => {}} onClick={() => {}} icon={<Icon name="star" />}>Token</Chip>
      <Toast status="info" dismissible={false}>{glyph}</Toast>
      <Avatar name="Ada Lovelace" size="lg" ring />
      <Card selectable selected title={<span>Plan</span>} onClick={() => {}} />
      <EmptyState icon="search" title="Nothing yet" actions={<Button>Add</Button>} />
      <Icon name="warning-fill" size={16} aria-label="Warning" role="img" />
      <Menu items={[{ label: 'Open', onClick: () => {} }, { separator: true }]} />
      <Modal title="Confirm" onClose={() => {}} onBack={() => {}} actions={<Button>OK</Button>} size="sm">Body</Modal>
      <Nav variant="bar" title="Settings" onBack={() => {}} sticky />
      <Row href="/c/1" as={RouterLink} title="Visa" subtitle="•••• 4242" chevron trail={<Tag>Due</Tag>} />
      <Skeleton variant="title" last style={{ width: 120 }} />
      <Table aria-label="Fees" columns={[{ key: 'a', label: <abbr>A</abbr>, className: 'num' }]} rows={[{ a: <Tag>1</Tag> }]} />
      <Table aria-label="Cards"><tbody><tr><th scope="row">Visa</th></tr></tbody></Table>
      <Tabs tabs={[{ id: 'a', label: 'A', icon: 'star' }, { section: 'More' }]} active="a" onChange={(id) => id} />
      <TextField label="Amount" error="Enter an amount." inputMode="decimal" aria-describedby="hint"
        endAction={{ icon: 'close', label: 'Clear', onClick: () => {} }} onChange={(e) => e.target.value} />
      <Select label="Card" options={['Visa', { value: 'mc', label: 'Mastercard' }, { label: 'More', options: ['x'] }]} defaultValue="mc" />
      <Checkbox label="Autopay" defaultChecked onChange={(e) => e.target.checked} />
      <Radio label="Monthly" name="f" value="m" />
      <Toggle label="Alerts" help="Email me" checked readOnly />
      <Textarea label="Notes" maxLength={200} showCount defaultValue="" onChange={(e) => e.target.value} />
      <CodeField length={6} groupAfter={3} success onChange={(code: string) => code} />
      <SegmentedControl label="View" options={['Day', { value: 'week', label: 'Week', icon: 'calendar' }]} value="Day" onChange={(v: string) => v} />
      <Tooltip label="Search" placement="start" ref={tip}><Button iconOnly iconStart="search" aria-label="Search" /></Tooltip>
    </ToastProvider>
  );
}

// The template vocabularies still constrain: these must not type-check.
export const rejected = [
  // @ts-expect-error — not a Button variant
  <Button variant="ghostly" />,
  // @ts-expect-error — not a status
  <Banner status="fatal" />,
  // @ts-expect-error — not a placement
  <Tooltip label="x" placement="middle">T</Tooltip>,
  // @ts-expect-error — Select's required is a boolean
  <Select required="yes" />,
  // @ts-expect-error — an <option> holds only text
  <Select options={[{ value: 'a', label: <b>A</b> }]} />,
  // @ts-expect-error — CodeField's onChange receives the code, not an event
  <CodeField onChange={(e: { target: unknown }) => e} />,
];
