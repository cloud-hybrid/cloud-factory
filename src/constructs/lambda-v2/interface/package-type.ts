/***
 * Lambda Function Package Type
 * ---
 *
 * Lambda deployment package type
 *
 * @property {string} image
 * @property {string} zip
 *
 * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function#package_type Lambda-Function, Package Type}
 *
 */

enum Package {
    image = "Image",
    zip = "Zip"
}

type Type = keyof typeof Package;

export { Package };
export type { Type };
export default Package;