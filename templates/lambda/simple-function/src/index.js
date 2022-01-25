/***
 * @tutorial
 *
 * Example Proof of Concept
 * ---
 *
 * The following variable cannot be initialized and stored in the
 * global namespace due to race conditions associated with importing
 * "../configuration/index.js".
 *
 * @task Implement Lambda Layer for Standard Library Import(s) and Global Callable(s)
 *
 * @example
 * /// Incorrect
 * const Debug = (process.env["NODE_ENV"] !== "production");
 *
 * module.exports.handler = async function () {
 *      (Debug) && console.log("...");
 * }
 *
 * /// Correct
 * module.exports.handler = async function () {
 *      const Debug = (process.env["NODE_ENV"] !== "production");
 *
 *      (Debug) && console.log("...");
 * }
 *
 */

/*** @type {import("tty")} */
const TTY = require("tty");

/*** Local Systems Variable for Debugging Runtime(s)
 * @audience Developers
 * @type {import("tty").isatty}
 */

const Local = (TTY.isatty(process.stdout.fd));

module.require("../configuration/index.js");
module.exports.handler = async function () {
    console.log("[Main][Log][Handler]" + "\t", "Environment" + ":", process.env["ENVIRONMENT"]);

    const Data = JSON.stringify({
        "Environment-Configuration": {
            "Database-Name": process.env["HOST"],
            "Database-Username": process.env["USERNAME"],
            "Database-Password": process.env["PASSWORD"]
        }
    }, null, 4);

    (Local) && console.debug("[Main][Debug][Handler]" + "\t", "Generated Data", Data);

    return new Promise((resolve) => {
        resolve({
            statusCode: 200,
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({
                Message: Data
            }, null, 4)
        });
    });
};