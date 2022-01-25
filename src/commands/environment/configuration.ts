import Assertion from "assert";
import FS from "fs";
import OS from "os";
import Path from "path";
import Process from "process";

import { Argv } from "../../cli/arguments.js";

interface Global {
    Environment: {
        "NPM-Config-Metrics-Registry": object | null | undefined; "NPM-Config-Global-Prefix": object | null | undefined; "NPM-Config-Noproxy": object | null | undefined; "NPM-Config-Local-Prefix": object | null | undefined; "NPM-Config-Globalconfig": object | null | undefined; "NPM-Execpath": object | null | undefined; "NPM-Package-Bin-Factory": object | null | undefined; "NPM-Package-Json": object | null | undefined; "NPM-Config-Userconfig": object | null | undefined; "NPM-Config-Init-Module": object | null | undefined; "NPM-Command": object | null | undefined; "NPM-Lifecycle-Event": object | null | undefined; "NPM-Package-Name": object | null | undefined; "NPM-Package-Version": object | null | undefined; "NPM-Config-Cache": object | null | undefined; "NPM-Lifecycle-Script": object | null | undefined; "NPM-Config-User-Agent": object | null | undefined; "NPM-Config-Prefix": object | null | undefined; "NPM-Config-Node-Gyp": object | null | undefined; "NPM-Node-Execpath": object | null | undefined;

        "NPM-Package-Config-Environment": object | null | undefined; "NPM-Package-Config-Organization": object | null | undefined; "NPM-Package-Config-Service": object | null | undefined; "NPM-Package-Config-Compliance": object | null | undefined; "NPM-Package-Config-Date": object | null | undefined; "NPM-Package-Config-Common-Name": object | null | undefined; "NPM-Package-Config-Tags": object | null | undefined; "NPM-Package-Config-Name": object | null | undefined;

        "NPM-Package-Config-Injection": object | null | undefined;

        "Node": string | null | undefined;
    };
}

interface Map {
    [ key: string ]: { Variable: string, Value: string };
}

interface Variable {
    Key: string;

    Value: FS.PathLike | string;

    Mapping: Map;
}

type Runtime = typeof Process.env;

interface Environment extends Runtime {
}

class Settings {
    static readonly mapping: { [ Key: string ]: Variable } = {};

    /*** Global Prefix */
    prefix: object | null | undefined;

    /*** Metrics Registry */
    metrics: object | null | undefined;

    /*** No-Proxy */
    proxy: object | null | undefined;

    /*** Local Prefix */
    local: object | null | undefined;

    /*** Global Configuration */
    configuration: object | null | undefined;

    /*** Relative `package.json` path */
    package: object | null | undefined;

    /*** User Configuration */
    user: object | null | undefined;

    /*** Initial Module */
    module: object | null | undefined;

    /*** Cache */
    cache: object | null | undefined;

    /*** User Agent */
    agent: object | null | undefined;

    /*** Configuration, Prefix */
    resolve: object | null | undefined;

    /*** GYP Compiler */
    gyp: object | null | undefined;

    /*** Node.js ABI Path */
    executable: object | null | undefined;

    /*** Node ABI */
    node: object | null | undefined;

    /*** Runtime `.env` Injection */
    injection: object | any | undefined = {
        $: null, Buffer: null, JSON: null
    };

    readonly environment: Environment;

    constructor(dynamic: boolean = false, $?: Global) {
        Settings.initialize();

        this.prefix =
            $?.Environment[ "NPM-Config-Global-Prefix" ] ?? Settings?.mapping[ "NPM-Config-Global-Prefix" ] ?? null;

        this.metrics =
            $?.Environment[ "NPM-Config-Metrics-Registry" ] ?? Settings?.mapping[ "NPM-Config-Metrics-Registry" ] ?? null;

        this.proxy = $?.Environment[ "NPM-Config-Noproxy" ] ?? Settings?.mapping[ "NPM-Config-Noproxy" ] ?? null;

        this.local = $?.Environment[ "NPM-Config-Local-Prefix" ] ?? Settings?.mapping[ "NPM-Config-Local-Prefix" ] ?? null;

        this.package = $?.Environment[ "NPM-Package-Json" ] ?? Settings?.mapping[ "NPM-Package-Json" ] ?? null;

        this.configuration =
            $?.Environment[ "NPM-Config-Globalconfig" ] ?? Settings?.mapping[ "NPM-Config-Globalconfig" ] ?? null;

        this.user = $?.Environment[ "NPM-Config-Userconfig" ] ?? Settings?.mapping[ "NPM-Config-Userconfig" ] ?? null;

        this.module = $?.Environment[ "NPM-Config-Init-Module" ] ?? Settings?.mapping[ "NPM-Config-Init-Module" ] ?? null;

        this.cache = $?.Environment[ "NPM-Config-Cache" ] ?? Settings?.mapping[ "NPM-Config-Cache" ] ?? null;

        this.agent = $?.Environment[ "NPM-Config-User-Agent" ] ?? Settings?.mapping[ "NPM-Config-User-Agent" ] ?? null;

        this.resolve = $?.Environment[ "NPM-Config-Init-Module" ] ?? Settings?.mapping[ "NPM-Config-Init-Module" ] ?? null;

        this.gyp = $?.Environment[ "NPM-Config-Node-Gyp" ] ?? Settings?.mapping[ "NPM-Config-Node-Gyp" ] ?? null;

        this.executable = $?.Environment[ "NPM-Node-Execpath" ] ?? Settings?.mapping[ "NPM-Node-Execpath" ] ?? null;

        this.injection.$ =
            $?.Environment[ "NPM-Package-Config-Injection" ] ?? Settings?.mapping[ "NPM-Package-Config-Injection" ] ?? null;

        this.environment = Process.env;

        ( dynamic ) && Object.keys( this.environment ).forEach( ($) => {
            Object.defineProperty( this, Settings.normalize( $ ), {
                configurable: true, enumerable: true, writable: true, value: this.environment[ $ ]
            } );
        } );

        ( this.injection[ "$" ] !== null ) && this.inject();
    }

    private static initialize() {
        const Environment = JSON.parse( JSON.stringify( Process.env, null, 4 ) );
        Object.keys( Environment ).forEach( ($) => {
            const Container: Map = {};

            const Normalization = Settings.normalize( $ );

            Settings.mapping[ Normalization ] = { Key: "", Mapping: {}, Value: "" };

            Container[ Normalization ] = {
                Variable: $, Value: Environment[ $ ]
            };

            Settings.mapping[ Normalization ][ "Key" ] = $;
            Settings.mapping[ Normalization ][ "Value" ] = Environment[ $ ];
            Settings.mapping[ Normalization ][ "Mapping" ] = Container;
        } );
    }

    private static normalize(input: string) {
        const $: string = input.toLowerCase().replace( "npm", "NPM" );
        return [ $.split( " " ).map( ($) => {
            return $.toString()[ 0 ]?.toUpperCase() + $.toString()?.slice( 1 ) ?? "";
        } ).join( "-" ).split( "_" ).map( ($) => {
            return $.toString()[ 0 ]?.toUpperCase() + $.toString()?.slice( 1 ) ?? "";
        } ).join( "-" ).split( "-" ).map( ($) => {
            return $.toString()[ 0 ]?.toUpperCase() + $.toString()?.slice( 1 ) ?? "";
        } ).join( "-" ) ].join( "-" );
    }

    private inject() {
        const Target = Path.resolve( this.injection.$?.Value );
        if ( FS.existsSync( Target ) ) {
            try {
                this.injection.JSON = JSON.parse( FS.readFileSync( Target, { encoding: "utf-8" } ) );
            } catch ( e ) {
                /// ... Unable to Serialize Environment File
            } finally {
                this.injection.$ = Object.create( {} );
            }

            this.injection.Buffer = FS.readFileSync( Target, { encoding: "utf-8" } );
            this.injection.Buffer.split( "\n" ).forEach( ($: string) => {
                if ( $.split( "=" ).length === 2 ) {
                    const Enumeration = $.split( "=" );
                    const Value = Enumeration[ 1 ].trim().replace( "\"", "" ).replace( "'", "" );

                    Object.defineProperty( this.injection.$, Enumeration[ 0 ], {
                        configurable: true, enumerable: true, writable: true, value: Value
                    } );

                    if ( Object.keys( this.injection.JSON ).length === 0 ) {
                        Object.defineProperty( this.injection.JSON, Enumeration[ 0 ], {
                            configurable: true, enumerable: true, writable: true, value: Value
                        } );
                    }
                }
            } );
        } else {
            Process.stderr.write( "[Error] Specified Configuration for Injection Not Found" + "\n" + "\n" );
            Process.stderr.write( " - Please either create an injection file, or remove" + "\n" );
            Process.stderr.write( "   the \"injection\" key from the \"package.json\" File's" + "\n" );
            Process.stderr.write( "   \"config\" Section." + "\n" + "\n" );

            Process.exit( OS.constants.errno.EIO );
        }

        Object.freeze( this.injection );
    }
}

/*** Debug Console Utility String Generator */
const Input = (input: ( string | number )[]) => "[Debug] CLI Input" + " " + "(" + input.toString().replace( ",",
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
    // const Syntax = (command: string) => [command, "? [--json] ? [--file \"FILE\"] ? [--debug] ? [--help]"].join(" ");

    Arguments.hide( "version" );
    Arguments.help( "help", "Display Usage Guide" ).default( "help", false );

    Arguments.option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false );
    Arguments.describe( "debug", "Enable Debug Logging" );

    Arguments.option( "file", { type: "string" } ).alias( "file", "f" ).default( "file", null );
    Arguments.describe( "file", "Write Current-Working-Directory to [FILE]" );
}

/***
 * Command Extension, Composition
 *
 * Writes data output to a user-provided local file.
 *
 * @param data {string | FS.PathLike} File Content(s)
 * @param target {string | FS.PathLike} Target File-Name
 * @param debug {Boolean | false} Enable Debug Logging
 *
 * @constructor
 *
 */

function Write(data: Settings, target: string, debug = false) {
    ( debug ) && console.debug( "[Debug] (Serialize) Input", JSON.stringify( {
        Data: JSON.stringify( data, null, 4 ), Target: target, Debug: debug
    }, null, 4 ), "\n" );

    const CWD = Process.cwd();
    const Target = Path.relative( CWD, target );

    Assertion.notStrictEqual( target, "" );

    FS.writeFileSync( Target, JSON.stringify( data, null, 4 ) );

    return { Target, data, debug };
}

/***
 * Command Extension, Composition
 *
 * Writes data output to TTY Stream
 *
 * @param data {Object | String | Any} Output Data
 * @param serialize {Boolean | true}
 * @param debug {Boolean | false} Enable Debug Logging
 *
 * @constructor
 *
 */

function Output(data: Settings, debug = false) {
    ( debug ) && console.debug( "[Debug] (Output) Input", JSON.stringify( {
        Data: data, Debug: debug
    }, null, 4 ), "\n" );

    Process.stdout.write( "[Log] Environment Configuration" + ":" + " " + JSON.stringify( data,
        null,
        4 ) + "\n" + "\n" );

    return { data, debug };
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

    Configuration( Arguments );

    Arguments.check( async ($) => {
        ( $?.debug ) && console.log( Input( $._ ), JSON.stringify( $, null, 4 ), "\n" );

        const Instance = new Settings();

        ( $?.file ) || Output( Instance, !!( $?.debug ) );
        ( $?.file ) && Write( Instance,
            String( $?.file ?? Path.join( Process.cwd(), "Configuration.json" ) ),
            !!( $?.debug ) );

        ( Instance.package === null ) && console.warn( "[Warning] NPM-Configuration is being ran from a global context." );
        ( Instance.package === null ) && console.warn( "[Warning] ... Output will not reflect accurate NPM runtime" );
        ( Instance.package === null ) && console.warn( "[Warning] ... configuration(s) or environment." );
        ( Instance.package === null ) && console.warn( "" );

        return true;
    } ).strict();
};

export { Command as Configuration };

export default { Command };