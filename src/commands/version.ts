import FS from "fs";
import Path from "path";

/*** *Current Working Directory* */
const CWD: string = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

/*** *Source Working Directory* */
const Source: string = Path.dirname(CWD);

/*** *Package Working Directory* */
const PKG: string = Path.dirname(Source);

// /*** JSON Capable Importer */
// const Import: NodeRequire = Module.createRequire( CWD );

// /*** @type {typeof import("../../package.json")} */

/// const Package: typeof import("../../package.json") = Import("../../package.json");

const Package = JSON.parse(FS.readFileSync(Path.join(CWD, "..", "..", "package.json"), { encoding: "utf-8" }));

// Package Version
const Version: [ string, string ] = [ "version", Package.version + "\n" ];

export { Version };

export default Version;
