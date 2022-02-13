interface Input {
    /*** (Optional) Description of the secret. */
    readonly description?: Configuration["description"];
    /*** (Optional) ARN or Id of the AWS KMS key to be used to encrypt the secret values in the versions stored in this secret. If you don't specify this value, then Secrets Manager defaults to using the AWS account's default KMS key (the one named aws/secretsmanager). If the default KMS key with that name doesn't yet exist, then AWS Secrets Manager creates it for you automatically the first time. */
    readonly kms_key_id?: Configuration["kmsKeyId"];
    /*** (Optional) Creates a unique name beginning with the specified prefix. Conflicts with name. */
    readonly name_prefix?: Configuration["namePrefix"];
    /*** (Optional) Friendly name of the new secret. The secret name can consist of uppercase letters, lowercase letters, digits, and any of the following characters: /_+=.@- Conflicts with name_prefix. */
    readonly name?: Configuration["name"];
    /*** (Optional) Valid JSON document representing a resource policy. For more information about building AWS IAM policy documents with Terraform, see the AWS IAM Policy Document Guide. Removing policy from your configuration or setting policy to null or an empty string (i.e., policy = "") will not delete the policy since it could have been set by aws_secretsmanager_secret_policy. To delete the policy, set it to "{}" (an empty JSON document). */
    readonly policy?: Configuration["policy"];
    /*** (Optional) Number of days that AWS Secrets Manager waits before it can delete the secret. This value can be 0 to force deletion without recovery or range from 7 to 30 days. The default value is 30. */
    readonly recovery_window_in_days?: Configuration["recoveryWindowInDays"];
    /*** (Optional) Configuration block to support secret replication. See details below. */
    readonly replica?: Configuration["replica"];
    /*** (Optional) Accepts boolean value to specify whether to overwrite a secret with the same name in the destination Region. */
    readonly force_overwrite_replica_secret?: Configuration["forceOverwriteReplicaSecret"];
}

/*** Cloud Resource Type Reference */
type Type = AWS.secretsmanager.SecretsmanagerSecret;

/*** Cloud Resource Input Configuration Reference  */
type Configuration = AWS.secretsmanager.SecretsmanagerSecretConfig;

/*** Cloud Resource Class | Constructor Alias */
const Reference = AWS.secretsmanager.SecretsmanagerSecret;

class Resource extends Construct implements Base {
    private static service = "Secrets-Manager";
    private static resource = "Secret";
    private static identifier = [ this.service, this.resource ].join( "-" );

    /*** The Globally Defined Resource Type */
    readonly instance: Type;

    constructor( scope: Construct, name: string, input: Input ) {
        super( scope, ID( [ name, Resource.identifier ].join( "-" ) ) );

        this.instance = Resource.type( scope, ID( [ name, Resource.identifier, input.name ].join( "-" ) ), input );

        Resource.output( scope, ID( [ name, Resource.identifier, "ARN" ].join( "-" ) ), {
            value: this.instance.arn,
            description: "Resource Identifier"
        } );
    }

    /***
     * Configuration Remapping Constructor
     *
     * @param {Construct} scope
     * @param {string} id
     * @param {Input} configuration
     *
     * @returns {Type}
     *
     * @private
     *
     */

    private static type( scope: Construct, id: string, configuration: Input ): Type {
        const settings = Resource.mapping( configuration );

        return new Reference( scope, id, { ... settings } );
    }

    /***
     * Input => Input-Type Mapping
     * ---
     *
     * The value of the following utility function is threefold:
     * - Overloading
     * - Opinionated Default(s)
     * - Strictly Enforced Configuration
     *
     * The structure of the return hashable should be as follows:
     *
     * 1. Strictly Enforced Configuration
     * 2. Opinionated Default(s)
     * 3. User Configuration
     * 4. Overloads
     *
     * ---
     *
     * @example
     * /// Arbitrary Cloud Resource Mapping
     * function $(configuration, parameters = {}) {
     *     return {
     *         ... {
     *             // --> Enforcement
     *             secret: true, // (Hard-Coded Assignment)
     *
     *             // --> Opinionated Default(s)
     *             notifications: configuration?.optional ?? true // (`?` Guarding)
     *
     *             // --> User Configuration
     *             identifier: configuration.id // (Object Indexing)
     *
     *             // --> Overloads, Escape Hatches
     *         }, ... parameters // (Unpacking)
     *     };
     * }
     *
     * @param {Input} configuration
     * @param {Configuration | {}} overwrites
     *
     * @returns {Configuration}
     *
     * @private
     *
     */

    private static mapping( configuration: Input, overwrites: Configuration | {} = {} ): Configuration {
//        const $: Options = {
//            application
//        }

        console.log( configuration, overwrites );

        return configuration;

        /// return {
        ///     ... {
        ///
        ///     }, ... overwrites
        /// };
    }

    /***
     * Static Utility Wrapper for CDKTF Stack Output
     *
     * @param {Construct} scope
     * @param {string} id
     * @param {Output} settings
     *
     * @returns {State}
     *
     * @private
     *
     */

    private static output( scope: Construct, id: string, settings: Output ): State {
        return new Store( scope, id, settings );
    };
}

import * as AWS from "@cdktf/provider-aws";

import { Parameter, Options } from "@cloud-technology/parameter";

import { ID }                         from "./utility";
import { Construct }                  from "constructs";
import { Base, Store, Output, State } from "./resource";

export { Resource };
export default Resource;
