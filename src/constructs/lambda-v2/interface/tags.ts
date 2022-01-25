import { IResolvable as Resolvable } from "cdktf";

/***
 * Lambda Function Tags
 * ---
 *
 * Map of Key-Value Pair(s) to Describe the Function
 *
 * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function Lambda-Function, Tagging}
 *
 */

type Tags = { [key: string]: string } | Resolvable;

export type { Tags };