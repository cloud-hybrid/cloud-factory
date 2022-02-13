"use strict";

console.log("Initiated Lambda Invocation ...");

/*** Handler (Async Handler(s) *should* return a non-awaited promise) */
module.exports.handler = async () => {
    console.log("[Debug] Environment Variable(s)" + ":", JSON.stringify(process.env, null, 4));

    return new Promise((resolve) => {
        resolve({
                statusCode: 200,
                body: JSON.stringify(
                    {
                        message: "Awaiting Code Deployment"
                    },
                    null, 4
                )
            }
        );
    });
};
