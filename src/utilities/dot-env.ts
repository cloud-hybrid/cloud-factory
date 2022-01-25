import FS from "fs";
import Path from "path";
import Process from "process";

import Assertion from "assert";

/***
 * Environment Variable(s) File Parser
 * ---
 *
 * - Please note that the following implementation hasn't been
 * tested in significance.
 *
 * @extends {Array, Variables}
 *
 * Allows the ability to parse a dot-env of equal or similar malformations (see below)
 *
 * @example
 * ... `.env`
 *
 * /// Alpha=true
 * /// BRAVO="ABC"
 * /// charlie="brown
 * /// delta = "hello, i am spaced"
 * /// export echo="test-123"
 * /// FoXtrOT=false
 * /// GAMMA="${GLOBAL_VARIABLE}"
 * /// Hotel="heeeeelp meeeee" # Test Hello World
 *
 * const environment = new Environment(".env");
 * const dotEnv = await environment.hydrate();
 *
 * console.log(dotEnv);
 */

class Environment extends Array {
    public file: string;

    public path: string;
    public valid: boolean;

    protected cwd: string;

    public constructor(file: string | FS.PathLike, strict: boolean = true) {
        super();

        this.cwd = Process.cwd();

        this.file = String( file );
        this.path = Path.resolve( this.cwd, this.file );
        this.valid = FS.existsSync( this.path );

        (strict) && this.assert();
    }

    private assert() {
        Assertion.equal( this.valid, true, "Unable to Locate Dot-Environment File" + ":" + " " + this.path );
    }

    /***
     * String Bash Operation Symbols from Key-Value Pair
     * ---
     * @param {string} variable - The "Key" in `Key="Value"`
     *
     * @private
     *
     * @example
     *
     * /// .env
     * declare test=true
     *
     * # --> Becomes ...
     * # "test"
     *
     */

    private static key(variable: string) {
        const key = String( variable );
        const split = key.split( " " );
        const evaluation = (split.length > 1);

        const joiner = split.join( "" );

        const local = (evaluation) ? joiner.replaceAll( RegExp( ".*(local).*", "igm" ), "" ) : joiner;
        const declare = (evaluation) ? local.replaceAll( RegExp( ".*(declare).*", "igm" ), "" ) : local;

        return (evaluation) ? declare.replaceAll( RegExp( ".*(export).*", "igm" ), "" ) : declare;
    }

    /***
     * Split Key-Value Pair
     * ---
     *
     * @param {string} line
     *
     * @returns {string[]}
     *
     * @private
     *
     */

    private static split(line: string): string[] {
        return line.split( "=" );
    }

    /***
     * Strip Inline Comment
     * ---
     *
     * @param {[string, string] | [string] | string[]} array
     *
     * @returns {[string, string]}
     *
     * @private
     *
     */

    private static comment(array: [ string, string ] | [ string ] | string[]) {
        if ( array[1] && array[1].split( "#" ).length > 1 ) {
            return [ array[0], array[1].split( "#" )[0] ];
        } else {
            return array;
        }
    }

    /***
     * Compute the Key-Value(s)
     * ---
     *
     * @returns {Promise<Environment>}
     *
     */

    public async hydrate(): Promise<Environment> {
        return new Promise( (resolve, reject) => {
            if ( !FS.existsSync( this.file ) ) reject();

            FS.readFile( ".env", { encoding: "utf-8" }, (error: NodeJS.ErrnoException | null, data: string) => {
                    if ( error ) reject( error );
                    const set = data.trim().split( "\n" ).filter( ($) => {
                        return ($ !== "\n" && $ !== "");
                    } ).map( (line) => {
                        const split = Environment.split( line );
                        return Environment.comment( split );
                    } ).reduce(
                        (accumulation, [ key, value ]) => {
                            return { ... accumulation, [key]: value };
                        }, {}
                    );

                    Object.keys( set ).forEach( ($) => {
                        const value = Environment.key( $ );

                        if ( value !== "" ) {
                            const base = Reflect.get( set, String( $ ) );

                            const quote = base.replace( "\n", "" ).trim();
                            const normalize = quote.replace( "\"", "" ).replace( "\"", "" );
                            const escape = normalize.replace( "$", "" ).replace( "{", "" ).replace( "}", "" );

                            this.push( {
                                Key: value,
                                Value: escape
                            } );
                        }
                    } );

                    resolve( this );
                }
            );
        } );
    }
}

export interface Variable {
    Key: string;
    Value: string;
}

export type Variables = Variable[];

export { Environment };

export default Environment;