/***
 * Standard Node.js Library -- GET & POST
 *
 * @example
 * import * as HTTPs from "...";
 *
 * const postable = await HTTPs.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify({
 *     title: "Test-Title",
 *     body: "Content",
 *     userId: 0
 * }), {});
 *
 * console.log("[Log] POST Request", postable);
 *
 * const gettable = await HTTPs.get("https://jsonplaceholder.typicode.com/posts/1", {});
 *
 * console.log("[Log] GET Request", gettable);
 *
 * /// @ ts-node
 *
 */

import URI from "url";

import HTTPs from "https";

const GET = (uri: string, headers = {}, resolve: Function, reject: Function) => {
    const $: { body: string[], data: string } = { body: [], data: "" };

    const options = URI.urlToHttpOptions( new URL( uri ) );

    options.headers = { ... options.headers, ... headers };

    HTTPs.get( options, (response) => {
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return GET( response.headers.location as string, headers, resolve, reject );
        }

        response.on("error", (error) => {
            reject(error);
        });

        response.on( "data", (chunk) => {
            $.body.push( chunk );
        } );

        response.on( "end", () => {
            try {
                $.data = JSON.parse( $.body.join() );
            } catch ( e ) {
                $.data = JSON.parse( "" );
            } finally {
                resolve( $ );
            }
        } );
    } );
};

const POST = (uri: string, data: string, headers = {}, resolve: Function, reject: Function) => {
    const $: { body: string[], data: string } = { body: [], data: "" };

    const options = {
        ... {
            protocol: "https:",
            port: 443,
            rejectUnauthorized: false,
            requestCert: true,
            followAllRedirects: true,
            encoding: "utf-8",
            agent: false,
            method: "POST",
            headers: {
                ... {
                    "Content-Type": "application/json", "Content-Length": Buffer.byteLength( data )
                }, ... headers
            }
        }, ... URI.urlToHttpOptions( new URL( uri ) )
    };

    const request = HTTPs.request( options, (response) => {
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return POST( response.headers.location as string, data, headers, resolve, reject );
        }

        response.on( "data", (chunk) => {
            $.body?.push( Buffer.from( chunk ).toString( "utf-8" ) );
        } );

        response.on( "end", () => {
            try {
                $.data = JSON.parse( $.body.join() );
            } catch ( e ) {
                console.warn("[Warning] Unable to Parse Body");
            }
        } );
    } );

    request.on("error", (error) => {
        reject(error);
    });

    request.on( "close", () => {
        resolve( $ );
    } );

    request.write( data );

    request.end();
};

const get = async (url: string, headers: any) => new Promise( (resolve, reject) => GET( url, headers, resolve, reject ) );
const post = async (url: string, data: any, headers: any) => new Promise( (resolve, reject) => POST( url, data, headers, resolve, reject ) );

export default { get, post };