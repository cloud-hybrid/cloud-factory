#!/usr/bin/env node

const Package = await import("./cli/interface.js");

export { Package };

export default await Package.Main();
