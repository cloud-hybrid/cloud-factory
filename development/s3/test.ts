import FS from "fs";
import URI from "url";
import HTTPs from "https";
import Utility from "util";

const stream = ($: string) => FS.createWriteStream($);
const buffer = stream("buffer");

const Remove = Utility.promisify(FS.rm);

const Query = (configuration: string | HTTPs.RequestOptions | URI.URL) => {
    const $ = new Promise((resolve, reject) => {
        /// @ts-ignore
        const request = HTTPs.request(configuration, (response) => {
            if ( response.statusCode === 301 || response.statusCode === 302 ) {
                /// @ts-ignore
                return Query(new URL(response.headers.location), resolve, reject);
            }

            response.pipe(buffer);
        });

        buffer.on("error", (error) => {
            FS.unlink(buffer.path, () => reject(error));
        });

        buffer.on("close", () => {
            resolve(FS.readFileSync(buffer.path, { encoding: "utf-8"}).toString());
        })

        request.on("error", (error) => {
             FS.unlink(buffer.path, () => reject(error));
         });

        request.end();
    });

    return $;
};

enum Method {
    GET= "GET",
    POST = "POST",
    DELETE = "DELETE"
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

    options: URI.URLFormatOptions;

    static container = [];

    constructor(url: string, method: Methods) {
        this.url = url;
        this.method = method;

        this.abstract();

        // @ts-ignore
        this.port = ( this.protocol.match(/http?s/) ) ? 443 : 80;

        // @ts-ignore
        this.options = URI.urlToHttpOptions(this);
        // @ts-ignore
        this.options.method = this.method;
    }

    static nullify(property: any) {
        return ( property === "" ) ? null : property;
    }

    static async response(url: string, method: Methods) {
        const instance = new Endpoint(url, method);

        /// @ts-ignore
        return Query(instance.options);
    }

    abstract() {
        /// @ts-ignore
        const $ = new URL(this.url);

        const Properties = {
            origin: Endpoint.nullify($.origin),
            protocol: Endpoint.nullify($.protocol),
            username: Endpoint.nullify($.username),
            password: Endpoint.nullify($.password),
            host: Endpoint.nullify($.host),
            hostname: Endpoint.nullify($.hostname),
            port: Endpoint.nullify($.port),
            pathname: Endpoint.nullify($.pathname),
            search: Endpoint.nullify($.search),
            searchParams: Endpoint.nullify($.searchParams),
            hash: Endpoint.nullify($.hash)
        };

        Object.keys(Properties).forEach(($) => {
            Reflect.defineProperty(this, $, {
                /// @ts-ignore
                value: Properties[ $ ]
            });
        });
    }
}

const request = await Endpoint.response("https://google.com/", "GET");

console.log(request);

await Remove(buffer.path, { force: true });