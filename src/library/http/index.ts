import FS from "fs";
import URI from "url";
import HTTP from "http";
import HTTPs from "https";
import Utility from "util";

const stream = ($: string) => FS.createWriteStream( $ );
const buffer = stream( "buffer" );

const Remove = Utility.promisify( FS.rm );

const Data = JSON.stringify( {
    Username: "Administrator",
    Password: "...",
    Grant: "Password"
} );

const Query = (configuration: string | HTTPs.RequestOptions | URI.URL) => {
    const container = {$: ""};

    return new Promise( (resolve, reject) => {
        /// @ts-ignore
        const request = HTTPs.request( configuration, (response) => {
            //@ts-ignore
            if ( response?.statusCode >= 400 && response?.statusCode < 500 ) {
                resolve( {
                    headers: response.headers,
                    method: response.method,
                    message: response.statusMessage,
                    code: response.statusCode
                } );
            } else {
                if ( response.statusCode === 301 || response.statusCode === 302 ) {
                    /// @ts-ignore
                    return Query( new URL( response.headers.location ), resolve, reject );
                }
            }

            response.pipe( buffer );

            // @ts-ignore
            (configuration?.method === "POST") && response.on("data", (data) => {
                const chunk = Buffer.from(data).toString();

                container.$ += chunk;
            });
        } );

        buffer.on( "error", (error) => {
            FS.unlink( buffer.path, () => reject( error ) );
        } );

        // @ts-ignore
        (configuration?.method === "GET") && buffer.on( "close", () => {
            resolve( FS.readFileSync( request.path, { encoding: "utf-8" } ).toString() );
        } );

        // @ts-ignore
        (configuration?.method === "POST") && request.on("close", () => {
            resolve(JSON.stringify(JSON.parse(container.$), null, 4));
        })

        request.on( "error", (error) => {
            FS.unlink( buffer.path, () => reject( error ) );
        } );

        request.write(Data);

        request.end();
    } );
};

enum Method {
    ACL = "ACL",
    BIND = "BIND",
    CHECKOUT = "CHECKOUT",
    CONNECT = "CONNECT",
    COPY = "COPY",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    LINK = "LINK",
    LOCK = "LOCK",
    M = "M",
    MERGE = "MERGE",
    MKACTIVITY = "MKACTIVITY",
    MKCALENDAR = "MKCALENDAR",
    MKCOL = "MKCOL",
    MOVE = "MOVE",
    NOTIFY = "NOTIFY",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PROPFIND = "PROPFIND",
    PROPPATCH = "PROPPATCH",
    PURGE = "PURGE",
    PUT = "PUT",
    REBIND = "REBIND",
    REPORT = "REPORT",
    SEARCH = "SEARCH",
    SUBSCRIBE = "SUBSCRIBE",
    TRACE = "TRACE",
    UNBIND = "UNBIND",
    UNLINK = "UNLINK",
    UNLOCK = "UNLOCK",
    UNSUBSCRIBE = "UNSUBSCRIBE"
}

type Methods = keyof typeof Method;

class Endpoint {
    url: string | null = null;

    origin: string | null = null;

    protocol: string | null = null;

    username: string | null = null;

    password: string | null = null;

    host: string | null = null;

    hostname: string | null = null;

    method: Methods | string | null = null;

    port: number | null = null;

    pathname: string | null = null;

    search: string | null = null;

    searchParams: string | null = null;

    hash: string | null = null;

    rejectUnauthorized: boolean | null = null;

    options: URI.URLFormatOptions;

    static container = [];

    constructor(url: string, method: Methods) {
        this.url = url;
        this.method = method;

        this.abstract();

        // @ts-ignore
        this.options = URI.urlToHttpOptions( this );
        // @ts-ignore
        this.options.method = this.method;
        // @ts-ignore
        this.options.rejectUnauthorized = false;

        // @ts-ignore
        this.options.headers = {
            "Content-Type": "Application/JSON",
            "Content-Length": Data.length
        }
    }

    static nullify(property: any) {
        return (property === "") ? null : property;
    }

    static async response(url: string, method: Methods) {
        const instance = new Endpoint( url, method );

        /// @ts-ignore
        return Query( instance.options );
    }

    abstract() {
        /// @ts-ignore
        const $ = new URL( this.url );

        const Properties = {
            origin: Endpoint.nullify( $.origin ),
            protocol: Endpoint.nullify( $.protocol ),
            username: Endpoint.nullify( $.username ),
            password: Endpoint.nullify( $.password ),
            host: Endpoint.nullify( $.host ),
            hostname: Endpoint.nullify( $.hostname ),
            port: Endpoint.nullify( $.port ),
            pathname: Endpoint.nullify( $.pathname ),
            search: Endpoint.nullify( $.search ),
            searchParams: Endpoint.nullify( $.searchParams ),
            hash: Endpoint.nullify( $.hash ),
            rejectUnauthorized: false
        };

        Object.keys( Properties ).forEach( ($) => {
            Object.defineProperty( this, $, {
                /// @ts-ignore
                value: Properties[$]
            } );
        } );
    }
}

const request = await Endpoint.response( "https://localhost:3443/v1/authorization/login", "POST" );

console.log( request );

await Remove( buffer.path, { force: true } );