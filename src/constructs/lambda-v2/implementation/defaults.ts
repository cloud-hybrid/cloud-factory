import { Defaults as Default } from "./../interface";

import { Architectures, Package, Runtimes, Tracing } from "./../interface";

/***
 * Default Settings
 *
 * @type {Type}
 *
 */

const Defaults: Default = {
    architecture: Architectures.x86,
    runtime: Runtimes.node14,
    tracing: Tracing.active,
    package: Package.zip,

    description: "Node.js Lambda Function",
    filename: "Distribution.zip",
    handler: "index.handler",

    publish: false,

    memory: 128,
    timeout: 15
};

type Type = keyof typeof Defaults;

export default Defaults;

export type { Type, Default };

export { Defaults };
