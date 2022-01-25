import { Resolvable } from "./resolvable";

interface Environment {
    /***
     * Lambda Function Environment Variables
     * ---
     *
     * Map of Key-Value Pair(s)
     *
     * @see {@link https://www.terraform.io/docs/providers/aws/r/lambda_function#variables Lambda-Function, Variables}
     *
     */
    readonly variables?: { [key: string]: string } | Resolvable;
}

export type { Environment };