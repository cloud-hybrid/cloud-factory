#!/usr/bin/env node

await import("source-map-support").then(($) => $.install());

const Package = await import("./cli/interface.js");

export { Package };

export default await Package.Main();
