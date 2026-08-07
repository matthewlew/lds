// Asserts the framework-free templates and the React components emit the same
// markup.
//
// This is the whole argument for having two bindings. Two hand-written
// implementations of one component normally drift — someone fixes a class name
// or an aria attribute in one and the other keeps shipping the old markup, and
// nothing catches it because both still "work". Here the React output is the
// spec and the template is diffed against it across a matrix of props, so a
// divergence is a failed build rather than a bug discovered in whichever app
// happened to use the stale binding.
//
// Rich slots are handled by rendering the React node to markup and handing that
// same string to the template as raw() — so composed content is compared too,
// not skipped.
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { Banner } from '@lew/lds';
import { banner } from '@lew/lds/templates';
import { raw } from '../packages/lds/src/templates/escape.js';

const el = React.createElement;
const fails = [];
let compared = 0;

function parity(label, props, templateProps = props) {
  compared++;
  const fromReact = renderToStaticMarkup(el(Banner, props));
  const fromTemplate = banner(templateProps);
  if (fromReact !== fromTemplate) {
    fails.push(`${label}\n      react:    ${fromReact}\n      template: ${fromTemplate}`);
  }
}

// --- the prop matrix -------------------------------------------------------
parity('bare', { children: 'Something happened.' });

for (const status of ['info', 'success', 'warning', 'caution', 'error']) {
  parity(`status=${status}`, { status, children: 'The condition, stated once.' });
  parity(`status=${status} + title`, { status, title: 'Heads up', children: 'Body copy.' });
  parity(`status=${status} + dismissible`, { status, dismissible: true, children: 'Body.' });
}

parity('page variant', { page: true, status: 'warning', children: 'System message.' });
parity('emphasis', { emphasis: 'strong', status: 'info', children: 'Loud.' });
parity('className', { className: 'my-own', status: 'info', children: 'Extra class.' });
parity('title only', { title: 'Just a title' });
parity('dismissible, no status', { dismissible: true, children: 'Neutral.' });
parity('icon=null suppresses the glyph', { status: 'error', icon: null, children: 'No icon.' });
parity('all at once', {
  status: 'error', title: 'Upload failed', page: true, emphasis: 'soft',
  dismissible: true, className: 'x', children: 'Three files did not transfer.',
});

// Escaping has to agree exactly, or the two bindings emit different bytes for
// the same input and every downstream diff is noise.
parity('escaping: text', { status: 'info', children: 'Tom & Jerry <b>bold</b> "quoted" \'apos\'' });
parity('escaping: title', { status: 'info', title: '5 > 3 & 2 < 4', children: 'x' });
parity('escaping: className', { className: 'a"b', children: 'x' });

// Rich slots: render the React node, hand the same markup to the template.
const actionNode = el('button', { type: 'button', className: 'lds-btn lds-btn--tertiary' }, 'Retry');
parity('actions',
  { status: 'error', children: 'Failed.', actions: actionNode },
  { status: 'error', children: 'Failed.', actions: raw(renderToStaticMarkup(actionNode)) });

const richChild = el('p', { className: 'x' }, 'A paragraph.');
parity('rich children',
  { status: 'info', children: richChild },
  { status: 'info', children: raw(renderToStaticMarkup(richChild)) });

// Passthrough attributes land the same way.
parity('passthrough attrs', { status: 'info', children: 'x', id: 'b1', 'data-testid': 'banner' });

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} of ${compared} cases diverged`);
  process.exit(1);
}
console.log(`template-parity: ${compared} cases — React and template markup identical`);
