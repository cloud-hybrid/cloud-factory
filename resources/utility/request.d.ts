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
declare const _default: {
    get: (url: string, headers: any) => Promise<unknown>;
    post: (url: string, data: any, headers: any) => Promise<unknown>;
};
export default _default;
