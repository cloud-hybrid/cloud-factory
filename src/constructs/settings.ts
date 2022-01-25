/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     ESM Exportable Module
 *
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";

import * as UUID from "uuid";

/*** ESM Resolver for *Current-Working-Directory* */
const CWD: string = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

/*** ESM Resolve for Package Directory relative to Current Working Directory */
const PKG: string = Path.dirname( CWD );

/// Destination Root
const Target: string = Path.join( PKG, ".." );

/*** Distribution Folder */
const Distribution: string = Target;

/*** ESM Compatability & JSON Importer */
const Import: NodeRequire = Module.createRequire( import.meta.url );

/***
 * JSON Configuration
 * ==================
 *
 *  @type {typeof await import("../configuration/settings.json")}
 *
 */

const Settings: typeof import("../schema/settings.schema.json") = Import(
    Path.join(
        Distribution,
        "src", "schema", "settings.json"
    )
) ?? null;

interface Distributable {
    name?: string;
    organization?: string;
    environment?: string;
}

const Factory: Distributable = Import(Path.join( Process.cwd(), "factory.json" ));

/***
 * Deployment Configuration & Settings
 * -----------------------------------
 *
 * @externs {{@link Settings}}
 *
 */

class Configuration {
    readonly name: string = Factory?.name ?? UUID.v4();

    readonly environment: string = Factory?.environment ?? "Development";

    readonly organization: string = Factory?.organization ?? "Factory";

    constructor(settings?: Distributable) {
        this.name = settings?.name ?? this.name;
        this.environment = settings?.environment ?? this.environment;
        this.organization = settings?.organization ?? this.organization;
    }
}

export { CWD, PKG, Distribution, Settings, Configuration };

export default { CWD, PKG, Distribution, Settings, Configuration };
