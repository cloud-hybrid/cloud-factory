/***
 * @module aws-s3
 *
 * @example
 * /// AWS S3 Module Usage
 * import { API } from "./interface.js"
 *
 * const S3 = new API();
 * await S3.get({
 *     Bucket: "development-cloud-factory-s3-bucket",
 *     Key: "node-modules.zip"
 * });
 *
 */

export { API } from "./interface.js";
