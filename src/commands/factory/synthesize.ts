import OS from "os";
import FS from "fs";
import Path from "path";
import Process from "process";
import Utility from "util";

import Assertion from "assert";

import * as UUID from "uuid";

import { Argv } from "../../cli/arguments.js";

import { Subprocess } from "../../utilities/subprocess.js";

import { Metadata as Stack } from "../../constructs/index.js";

const Remove = Utility.promisify( FS.rm );

const TS = {
    "compilerOptions": {
        "alwaysStrict": true,
        "charset": "utf8",
        "declaration": true,
        "experimentalDecorators": true,
        "inlineSourceMap": true,
        "inlineSources": true,
        "lib": [
            "es2018"
        ],
        "module": "CommonJS",
        "noEmitOnError": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitAny": true,
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "resolveJsonModule": true,
        "strict": true,
        "strictNullChecks": true,
        "strictPropertyInitialization": true,
        "stripInternal": true,
        "target": "ES2018",
        "incremental": true
    },
    "include": [
        "**/*.ts"
    ],
    "exclude": [
        "node_modules",
        "cdktf.out"
    ]
};

const CDKTF = {
    "language": "typescript",
    "app": "node Stack.js",
    /// "output": "cdktf.out",
    "terraformProviders": [
        "aws",
        "archive",
        "external",
        "time",
        "local",
        "random",
        "null"
    ],
    "terraformModules": [],
    "context": {
        "excludeStackIdFromLogicalIds": "true",
        "allowSepCharsInLogicalIds": "true"
    }
    /// "codeMakerOutput": "@imports"
};

const Package = {
    "name": "@cloud-factory/deployable",
    "private": true,
    "version": "0.0.0",
    "main": "Main.js",
    "type": "module",
    "scripts": {
        "get": "cdktf get",
        "build": "tsc",
        "synth": "cdktf synth",
        "compile": "tsc --pretty",
        "watch": "tsc --watch",
        "upgrade": "npm i cdktf@latest cdktf-cli@latest",
        "upgrade:next": "npm i cdktf@next cdktf-cli@next"
    },
    "engines": {
        "node": ">=14"
    },
    "dependencies": {
        "cdktf": "^0.8.6",
        "cdktf-cli": "^0.8.6",
        "constructs": "^10.0.31",

        "@cdktf/provider-aws": "^3.0.1",

        "ajv": "^8.8.2",
        "ajv-formats": "^3.0.0-rc.0",

        "uuid": "^8.3.2"
    },
    "devDependencies": {
        "@types/node": "^17.0.8",
        "ts-jest": "^27.1.2",
        "ts-node": "^10.4.0",
        "typescript": "^4.5.4"
    }
};

/*** Exclusions to Avoid Recursive Parsing; i.e. libraries, lambda-layers, or otherwise bundled requirements */
const Exclusions = [ ".git", ".idea", ".vscode", "cdktf.out", "templates", "documentation", "scripts" ];

/*** Debug Console Utility String Generator */
const Input = (input: (string | number)[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",",
    ", " ).toUpperCase() + ")";

/***
 * Command Configuration, Composition
 *
 * Acquires and configures settings specific to the module's {@link Command} Function-Constant.
 *
 * @param Arguments {Argv} CLI Input Arguments for Derivative Command
 *
 * @constructor
 *
 */

function Configuration(Arguments: Argv) {
    const Syntax = (command: string) => [ command, "? [--debug] ? [--help]" ].join( " " );

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );
}

/***
 * Recursive Copy Function
 * -----------------------
 * *Note* - this will perform *actual, real copies*; symbolic links are resolved to their raw pointer location(s).
 *
 * These are important considerations especially when building for reproducible distributions.
 *
 * @param source {string} Original Source Path
 * @param target {string} Target Copy Destination
 *
 * @param debug {boolean}
 * @constructor
 *
 */

function Copy(source: string, target: string, debug: boolean = false) {
    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source,
        { withFileTypes: true } ).filter( ($) => (!Exclusions.includes( $.name )) ).forEach( ($) => {
        const Directory = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isDirectory();
        const File = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isFile();

        if ( File ) {
            try {
                FS.copyFileSync( Path.join( source, $.name ),
                    Path.join( target, $.name ),
                    FS.constants.COPYFILE_FICLONE );

                (debug) && console.debug( "[Debug]" + ":", {
                    Source: Path.join( source, $.name ), Target: Path.join( target, $.name )
                }, "\n" );
            } catch ( error ) {
                // ...
            }
        } else {
            if ( Directory ) {
                Copy( Path.join( source, $.name ), Path.join( target, $.name ) );
            }
        }
    } );
}

/***
 * Recursive Copy Function (Dry-Run)
 * ---------------------------------
 * @param source {string} Original Source Path
 * @param target {string} Target Copy Destination
 *
 * @constructor
 *
 */

function Dry(source: string, target: string) {
    FS.mkdirSync( target, { recursive: true } );
    FS.readdirSync( source,
        { withFileTypes: true } ).filter( ($) => (!Exclusions.includes( $.name )) ).forEach( ($) => {
        const Directory = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isDirectory();
        const File = FS.lstatSync( Path.join( source, $.name ), { throwIfNoEntry: true } ).isFile();

        if ( File ) {
            try {
                console.log( " - " + "Source" + ":" + " " + Path.join( source, $.name ) );
                console.log( " - " + "Target" + ":" + " " + Path.join( target, $.name ) );
            } catch ( error ) {
                // ...
            }
        } else {
            if ( Directory ) {
                Dry( Path.join( source, $.name ), Path.join( target, $.name ) );
            }
        }
    } );
}

/***
 * Module Entry-Point Command
 * ==========================
 *
 * @param $ {Argv} Commandline Arguments (Implicitly passed from cli.ts).
 *
 * @constructor
 *
 */

const Command = async ($: Argv) => {
    const Arguments: Argv = $;

    console.warn( "[Warning] The Current Command is Under Development." );
    console.warn( "... To view runtime debug logs, provide the \"--debug\" flag", "\n" );

    /*** @Task Create No-Prompt Flag to Avoid User Input */

    Configuration( Arguments );

    Arguments.check( async ($) => {
        try {
            ($?.debug) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );
            ($?.debug) && console.debug( "Current Directory" + ":", Process.cwd(), "\n" );

            console.log( "[Log] Writing File Structure ...", "\n" );

            /// --> Install Dependencies

            // ( trigger === "Y" ) && await Subprocess("npm install --global", Path.join(Process.cwd(), "factory"));
            // ( trigger === "Y" ) && await Subprocess("npm install typescript --global", Path.join(Process.cwd(), "factory"));
            // ( trigger === "Y" ) && await Subprocess("npm install cdktf@latest --global", Path.join(Process.cwd(), "factory"));
            // ( trigger === "Y" ) && Copy(Path.join(Process.cwd(), "distribution"), Path.join(Process.cwd(), "factory", "distribution"));
            // ( trigger === "Y" ) && await Subprocess("cdktf get", Path.join(Process.cwd(), "factory", "distribution"));
            // ( trigger === "Y" ) && await Subprocess("cdktf synth", Path.join(Process.cwd(), "factory", "distribution"));
            // ( trigger === "Y" ) && await Subprocess("cdktf deploy --auto-approve", Path.join(Process.cwd(), "factory", "distribution"));

            Process.chdir( Path.join( Process.cwd(), "distribution" ) );

            await Remove( Path.join( Process.cwd(), "node_modules" ), { maxRetries: 5, force: true, recursive: true } );

            await Remove( Path.join( Process.cwd(), "package.json" ), { force: true } );
            await Remove( Path.join( Process.cwd(), "package-lock.json" ), { force: true } );
            await Remove( Path.join( Process.cwd(), "cdktf.json" ), { force: true } );

            const Target = Path.join( OS.userInfo( { encoding: "utf-8" } ).homedir, ".factory", UUID.v4() );

            console.debug( "[Debug] Cloud-Factory Output Target" + ":", Target, "\n" );

            FS.writeFileSync( Path.join( Process.cwd(), "package.json" ), JSON.stringify( Package, null, 4 ) );
            FS.writeFileSync( Path.join( Process.cwd(), "cdktf.json" ), JSON.stringify( CDKTF, null, 4 ) );

            await Subprocess( "npm install --silent", Path.join( Process.cwd() ) );

            console.debug( "[Debug] Local Callable Directory" + ":", FS.existsSync( Path.join( Process.cwd(), "node_modules", ".bin" ) ) + "\n" );

            const Binaries = FS.readdirSync( Path.join( Process.cwd(), "node_modules", ".bin" ), { withFileTypes: true } )
                .map( ($) => Path.join( Process.cwd(), "node_modules", ".bin", $.name ) );

            Binaries.forEach( ($) => Process.env["PATH"] += ":" + $ );

            console.debug( "[Debug] Local Callable Path(s)" + ":", JSON.stringify( Binaries, null, 4 ), "\n" );

            const CDK = Binaries.indexOf( Path.join( Process.cwd(), "node_modules", ".bin", "cdktf" ) );

            await Subprocess( Binaries[CDK] + " " + "get", Process.cwd() );

            console.log( "[Log] Writing IaC'd Stack ...", "\n" );

            const Content = Stack?.Package?.contents() ?? null;

            Assertion.notEqual( Content, null, "Fatal Error - Stack Content(s) Read Exception: nil" );

            FS.writeFileSync( Path.join( Process.cwd(), "Stack.js" ), Content ?? "" );
            FS.writeFileSync( Path.join( Process.cwd(), "tsconfig.json" ), JSON.stringify( TS, null, 4 ) );

            await Subprocess( Binaries[CDK] + " " + "synth", Path.join( Process.cwd() ) );

            // await Subprocess( "cdktf deploy --auto-approve", Path.join( Process.cwd(), "factory", "distribution" ) );

            return true;
        } catch ( error ) {
            console.error( error );

            return false;
        }
    } ).strict();
};

export { Command as Synthesize };

export default { Command };