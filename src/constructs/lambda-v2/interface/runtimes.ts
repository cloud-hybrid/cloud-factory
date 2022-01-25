/***
 * Lambda Function Runtime
 * ---
 *
 * Lambda Runtime
 *
 * @property {string} node12 - Node.js 12
 * @property {string} node14 - Node.js 14
 * @property {string} python38 - Python3.8
 *
 * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function#runtime Lambda-Function, Runtimes}
 *
 */

enum Runtimes {
    node12 = "nodejs12.x",
    node14 = "nodejs14.x",
    /// node16 = "nodejs16.x",
    python38 = "python3.8"
}

type Type = keyof typeof Runtimes

export { Runtimes };

export type { Type };

export default Runtimes;

