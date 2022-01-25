import { Architectures, Package, Runtimes, Tracing } from "./../interface";

/*** Default Settings Type-Interface */
interface Defaults {
    handler: string;
    tracing: Tracing;
    package: Package;
    filename: string;
    memory: number;
    publish: boolean;
    runtime: Runtimes;
    description: string;
    timeout: number;
    architecture: Architectures;
}

export type { Defaults };