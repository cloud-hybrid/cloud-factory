import Module from "./module";

import { File, Source } from "./archive";
import { Provider, Type as provider } from "./provider";

import { Metadata } from "./metadata";

import { Defaults } from "./defaults";

import { Architectures, Type as architectures } from "./architectures";
import { Mode as Tracing, Type as tracing } from "./mode";
import { Runtimes, Type as runtimes } from "./runtimes";
import { Package, Type as type } from "./package-type";

import { Environment } from "./environment";
import { Resolvable } from "./resolvable";
import { Tags } from "./tags";
import { VPC } from "./vpc";

/***
 * Lambda Configuration Option(s)
 * ---
 *
 * @property {string} filename - [...]
 * @property {string} name - [...]
 * @property {string} handler - [...]
 * @property {string} role - [...]
 * @property {number} memory - [...]
 * @property {Runtimes} runtime - [...]
 * @property {Architectures} architecture - [...]
 * @property {string} description - [...]
 * @property {string[]} layers - [...]
 * @property {Package} package - [...]
 * @property {boolean | Resolvable} publish - [...]
 * @property {Tags} tags - [...]
 * @property {Environment} environment - [...]
 * @property {number} timeout - [...]
 * @property {Tracing} tracing - [...]
 * @property {VPC} vpc - [...]
 */
interface Configuration extends Metadata {
    readonly filename?: string;
    readonly name?: string;
    readonly handler?: string;
    readonly role?: string;
    readonly memory?: number;
    readonly runtime?: Runtimes;
    readonly architecture?: Architectures;
    readonly description?: string;
    readonly layers?: string[];
    readonly package?: Package;
    readonly publish?: boolean | Resolvable;
    readonly tags?: Tags;
    readonly environment?: Environment;
    readonly timeout?: number;
    readonly tracing?: Tracing;
    readonly vpc?: VPC;
}

/***
 * Configuration --> CDKTF AWS Lambda Function Mapping
 * ---
 *
 * @type {{handler: string, tracing: string, role: string, memory: string, vpc: string, runtime: string, description: string, packageType: string, timeout: string, tags: string, environment: string, filename: string, publish: string, name: string, layers: string, architecture: string}}
 *
 */
const Mapping = {
    filename: "filename",
    name: "functionName",
    handler: "handler",
    role: "role",
    memory: "memorySize",
    runtime: "runtime",
    architecture: "architecture",
    description: "description",
    layers: "layers",
    packageType: "packageType",
    publish: "publish",
    tags: "tags",
    environment: "environment",
    timeout: "timeout",
    tracing: "tracingConfig",
    vpc: "vpcConfig"
};

const AWS: provider = Provider;

export { AWS, File, Module, Mapping, Architectures, Runtimes, Tracing, Package };

export type { Defaults, Source, Configuration, Environment, Resolvable, Tags, VPC, Metadata, provider, tracing, type, architectures, runtimes };

export default { AWS, File, Module, Mapping, Architectures, Runtimes, Tracing, Package };