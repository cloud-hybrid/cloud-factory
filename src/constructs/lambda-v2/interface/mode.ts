/***
 * Lambda Function Tracing Configuration
 * ---
 *
 * Whether to to sample and trace a subset of incoming requests with AWS X-Ray.
 *
 * Valid values are `PassThrough` and `Active`. If `PassThrough`, Lambda will only trace the
 * request from an upstream service if it contains a tracing header with "`sampled = 1"`.
 * If `Active`, Lambda will respect any tracing header it receives from an upstream
 * service. If no tracing header is received, Lambda will call X-Ray for a tracing
 * decision.
 *
 * @property {string} pass
 * @property {string} active
 *
 * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function#architectures Lambda-Function, Architectures}
 *
 */

enum Mode {
    pass = "PassThrough",
    active = "Active"
}

type Type = keyof typeof Mode;

export { Mode };
export type { Type };
export default Mode;