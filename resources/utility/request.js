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
 */
import URI from "url";
import HTTPs from "https";
/*** Example Backend Module */
/***
 *
 * @param {string} uri
 * @param {{}} headers
 * @param {Function} resolve
 * @param {Function} reject
 *
 * @constructor
 *
 */
const GET = (uri, headers = {}, resolve, reject) => {
    const $ = { body: "", data: "" };
    const options = URI.urlToHttpOptions(new URL(uri));
    options.headers = { ...options.headers, ...headers };
    HTTPs.get(options, (response) => {
        /// HTTP Redirect(s)
        if (response.statusCode === 301 || response.statusCode === 302) {
            return GET(response.headers.location, headers, resolve, reject);
        }
        response.on("error", (error) => {
            reject(error);
        });
        response.on("data", (chunk) => {
            $.body += Buffer.from(chunk).toString("utf-8");
        });
        response.on("end", () => {
            resolve(JSON.parse(String($.body)));
        });
    });
};
const POST = (uri, data, headers = {}, resolve, reject) => {
    const $ = { body: [], data: "" };
    const options = {
        ...{
            protocol: "https" + ":",
            port: 443,
            rejectUnauthorized: false,
            requestCert: true,
            followAllRedirects: true,
            encoding: "utf-8",
            agent: false,
            method: "POST",
            headers: {
                ...{
                    "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data)
                }, ...headers
            }
        }, ...URI.urlToHttpOptions(new URL(uri))
    };
    const request = HTTPs.request(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
            return POST(response.headers.location, data, headers, resolve, reject);
        }
        response.on("data", (chunk) => {
            $.body?.push(Buffer.from(chunk).toString("utf-8"));
        });
        response.on("end", () => {
            try {
                $.data = JSON.parse($.body.join());
            }
            catch (e) {
                console.warn("[Warning] Unable to Parse Body");
            }
        });
    });
    request.on("error", (error) => {
        reject(error);
    });
    request.on("close", () => {
        resolve($);
    });
    request.write(data);
    request.end();
};
/***
 * @param {string} url
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */
const get = (url, headers) => {
    return new Promise((resolve, reject) => {
        GET(url, headers, resolve, reject);
    });
};
/***
 * @param {string} url
 * @param {string} data
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */
const post = (url, data, headers) => {
    return new Promise((resolve, reject) => {
        POST(url, data, headers, resolve, reject);
    });
};
export default { get, post };
//# sourceMappingURL=request.js.map