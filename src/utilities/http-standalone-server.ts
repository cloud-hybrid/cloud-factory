import FS from "fs";
import OS from "os";
import HTTP from "http";
import Process from "process";
import Cluster from "cluster";

import Threads from "worker_threads"

import { Readable } from "stream";

type Generic = any;
type Asynchronous = (route: URL, request: HTTP.IncomingMessage, response: Outbound) => Promise<Generic>;
type Request = HTTP.IncomingMessage;
type Response = HTTP.ServerResponse;

type Listener = HTTP.RequestListener;

export interface Inbound extends HTTP.ClientRequest {}

export interface Outbound extends Response, HTTP.OutgoingMessage {}

/***
 * A mapping of header names to string values.
 *
 * Keys should be considered case insensitive, even if this is not enforced by a
 * particular implementation.
 *
 */
export interface Headers {
    [header: string]: string;
}

/***
 * Represents an HTTP message with headers and an optional static or streaming.
 *
 * @param headers { Headers }
 * @param body {ArrayBuffer | ArrayBufferView | string | Uint8Array | Readable | ReadableStream}
 *
 */
export interface Message {
    headers: Headers;
    body?: ArrayBuffer | ArrayBufferView | string | Uint8Array | FS.ReadStream | ReadableStream | Buffer | Readable;
}

/***
 * A mapping of query parameter names to strings or arrays of strings, with the
 * second being used when a parameter contains a list of values.
 *
 * Value is to default to `null` when `Parameters` shape isn't required.
 *
 */
export interface Parameters {
    [parameter: string]: string | Array<string> | null;
}

export interface Endpoint {
    protocol: string;
    hostname: string;
    port?: number;
    path: string;
    query?: Parameters;
}

class Handler extends HTTP.Server {
    /*** Can be used for debugging child processes (Actual HTTP Server(s) responding to /api-endpoint requests) */
    static Base: Handler = new Handler();

    initialize = (options: Listener) => HTTP.createServer(options);

    constructor() {
        super();
    }

    static async handle(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        response.writeHead(200);

        /// console.log(request, response, url, handler ?? null);

        response.end((handler) ? await handler(url, request, response) : () => null);
    }

    async default(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        response.writeHead(200);

        /// console.log(request, response, url, handler ?? null);

        response.end((handler) ? await handler(url, request, response) : () => null);
    }

    async get(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        (request.method !== "GET") && response.writeHead(405);
        (request.method !== "GET") && response.end();

        if (request.method === "GET") {
            await Handler.handle(request, response, url, handler)
        }
    }

    async post(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        (request.method !== "POST") && response.writeHead(405);
        (request.method !== "POST") && response.end();

        if (request.method === "POST") {
            await Handler.handle(request, response, url, handler)
        }
    }

    async update(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        (request.method !== "UPDATE") && response.writeHead(405);
        (request.method !== "UPDATE") && response.end();

        if (request.method === "UPDATE") {
            await Handler.handle(request, response, url, handler)
        }
    }

    async delete(request: Request, response: Outbound, url: URL, handler?: Asynchronous) {
        (request.method !== "DELETE") && response.writeHead(405);
        (request.method !== "DELETE") && response.end();

        if (request.method === "DELETE") {
            await Handler.handle(request, response, url, handler)
        }
    }
}

const Server = new Handler();

/// After ... Some confusion, it was found that Node.js does not allow TCP-sharing between the Master --> Child processes
///
/// Academically, I believe parent-child process IPC can be shared; certainly, however, port access permissions
/// ... *are not shared amongst all processes*. Which makes sense due to security concerns, potential DDoS if `ioperm`
/// ... bits are enabled to both/multiple processes.
///
/// Note, and I believe this holds true on most unix-based systems, multi-threaded-capable application worker's
/// ... must only make asynchronous syscalls. But node.js's runtime is inherently asynchronous... Lucky catch,
/// ... especially when the context comes down to clustering intra-system...ly.

if (Cluster.isPrimary && Threads.isMainThread) { /// Parent Process
    console.log("Main Event Loop", Process.pid);

    OS.cpus().forEach(() => {
        Cluster.fork();
        /// --> new Worker(import.meta.url.replace("file://", ""));
    });

    // --> Track Total HTTP Requests
    let $ = 0;
    // <-- Count HTTP Requests
    const receiver = (message: Generic) => {
        $ += (message?.cmd && message?.cmd === "reception") ? 1 : 0;

        (message?.cmd && message?.cmd === "reception") && console.log( "Request Closure" + " " + "(" + $ + ")" + "\t", message?.id[0], message?.id[1] );

        /// ... Very interesting Effects on Cluster := `for (let n = 0; n < 1e10; n++)`
        /// --> Blocks given that communication through process.stdout requires a momentarily blocking state
    }


    Cluster.on("exit", (worker, code, signal) => {
        if (signal) {
            console.log("Worker (SIGKILL)" + ":", worker);
        } else if (code) {
            console.log("Worker (Error)" + ":", code);
        } else {
            console.log("Successful Termination", worker);
        }

        console.log("Worker" + ":", "(" + worker + ")", "Code" + ":", "(" + code + ")", "Signal" + ":", "(" + signal + ")");
    });

    for (const $ in Cluster.workers) {
        // @ts-ignore
        Cluster?.workers[$].on("message", receiver);
    }

    console.log( "  - HTTP Endpoint: http://127.0.0.1:8080/api-endpoint" );
} else { /// Child Process(es)
    console.log("Worker Process" + ":", Process.pid);

    Server.initialize( async (request: Request, response: Response) => {
        console.log( "Request Initialization", "\t", Process.ppid, Process.pid);
        /***
         * Force a Heavy Computation
         * ---
         *
         * @summary
         *
         * In retrospect, forcing a synchronous event in replacement of an actual, CPU-expensive task wasn't a great example.
         * Because Node.js is single-threaded, calling `Wait` simply locks up the thread, rather than allow other processes
         * to progress any mutexes further.
         *
         * However, I won't be spending additional efforts writing anything intensive as the following example does
         * successfully show that all process(es) do resolve HTTP requests through concurrency.
         *
         * Apache Load Testing (Default on MacOS)
         * $ ab -n 1000 -c 100 http://localhost:8080/api-endpoint
         *
         * Via NPM Package: "loadtest" (Seems ... oddly similar)
         * $ npm install --global loadtest
         * $ loadtest http://localhost:8080/api-endpoint -n 1000 -c 100
         *
         * @note
         * Execution via Windows is unknown, and will not be supported regardless
         *
         */

        /// await Wait(10000);
        /// function Wait(time: number) {
        ///     return new Promise((resolve) => {
        ///         setTimeout(resolve.bind(null), time)
        ///     })
        /// }

        // ... Well, here would be a decent example ... but boring
        for (let n = 0; n < 1e7; n++) { /*** */ }

        const Implementation = {
            Default: Server.get
        };

        const Options = new URL( String( request.url ), "http://127.0.0.1/" );

        /// --> For Use in any Real Context other than Research & Testing := `console.log( "Request Data" + ":", { ... Options, ... { worker: Process.pid } } );`

        /// console.debug( "[Debug]", (Utility.inspect( Server )) );

        (Options.pathname === "/api-endpoint") && await Implementation.Default( request, response, Options);

        (Options.pathname === "/api-endpoint") || response.writeHead( 404 );
        (Options.pathname === "/api-endpoint") || response.end();

        // @ts-ignore
        Process?.send({ cmd: "reception", id: [Process.ppid, Process.pid] });

        response.end();
    } ).listen( 8080, () => {
        Server.timeout = 1000 * 15;
    } );
}

export {}