import * as SDK from "@aws-sdk/client-s3";

import { Payload } from "./presigned-url.js";

/***
 *  AWS S3 API Interface
 *
 *  @alias Object => S3 (Object)
 *
 *  @example
 * /// Display with Progress Bar
 * import { API } from "./index.js"
 *
 * const Interactive = new API();
 * await Interactive.get({
 *     Bucket: "development-cloud-factory-s3-bucket",
 *     Key: "node-modules.zip"
 * }, true);
 *
 * /// Display without Progress Bar
 * await S3.get({
 *     Bucket: "development-cloud-factory-s3-bucket",
 *     Key: "node-modules.zip"
 * }, false);
 *
 */

class API extends Payload {
    /***
     *
     * @param expiration {number}
     *
     */

    constructor(expiration = 300) {
        super(expiration);
    }

    /***
     * GET an AWS S3 Object via Pre-Signed URL
     *
     * @returns {Promise<void>}
     *
     * @param settings { SDK.GetObjectCommandInput }
     * @param progress {boolean}
     * @param local {PathLike | string}
     *
     * @param debug {boolean}
     */

    async get(settings, progress = false, local = null, debug = false) {
        const command = new SDK.GetObjectCommand(settings);

        await this.generate(command);

        const descriptor = (progress) ? await this.progress(local ?? settings["Key"])
            : await this.download(local ?? settings["Key"]);

        (debug) && console.debug("[Debug] Response", descriptor);

        return descriptor;
    }

    /***
     * PUT an AWS S3 Object via Pre-Signed URL
     *
     * @returns {Promise<void>}
     *
     * @param settings { SDK.PutObjectCommandInput }
     * @param remote {PathLike | string}
     *
     * @param debug {boolean}
     *
     */

    async put(settings, remote = null, debug = false) {
        const command = new SDK.PutObjectCommand(settings);

        await this.generate(command);

        const descriptor = this.download(remote ?? settings["Key"]);

        (debug) && console.debug("[Debug] Response", descriptor);

        return descriptor;
    }
}

export { API };

export default API;
