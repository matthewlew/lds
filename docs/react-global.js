// The docs load React as a UMD global and the component bundle as an IIFE, so
// `import React from 'react'` inside the package has to resolve to that global
// rather than pull a second copy of React into the bundle. Two Reacts on one
// page means two independent hook dispatchers, and every hook throws.
export default window.React;
