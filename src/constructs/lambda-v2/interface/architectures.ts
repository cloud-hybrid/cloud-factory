/***
 * Lambda Function Instruction Set(s)
 * ---
 *
 * Instruction Set Architecture
 *
 * @property {string} x86
 * @property {string} arm
 *
 * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function#architectures Lambda-Function, Architectures}
 *
 */

enum Architectures {
    x86 = "x86_64",
    arm = "arm64"
}

type Type = keyof typeof Architectures;

export { Architectures };
export type { Type };
export default Architectures;