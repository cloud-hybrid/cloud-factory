/***
 * Lambda Function VPC Configuration
 * ---
 *
 * @property
 * @property
 *
 * @see {@link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#vpc_config| Lambda-Function, VPC Configuration}
 *
 */
interface VPC {
    /***
     * Security Group ID(s)
     * ---
     *
     * @type {string[]}
     */
    readonly groups: string[];
    /***
     * Subnet ID(s)
     * ---
     *
     * @type {string[]}
     */
    readonly subnets: string[];
}

export type { VPC };