/*** Cloud Resource Class | Constructor Alias */
const Reference = AWS.secretsmanager.SecretsmanagerSecret;
class Resource extends Construct {
    static service = "Secrets-Manager";
    static resource = "Secret";
    static identifier = [this.service, this.resource].join("-");
    /*** The Globally Defined Resource Type */
    instance;
    constructor(scope, name, input) {
        super(scope, ID([name, Resource.identifier].join("-")));
        this.instance = Resource.type(scope, ID([name, Resource.identifier, input.name].join("-")), input);
        Resource.output(scope, ID([name, Resource.identifier, "ARN"].join("-")), {
            value: this.instance.arn,
            description: "Resource Identifier"
        });
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
    static type(scope, id, configuration) {
        const settings = Resource.mapping(configuration);
        return new Reference(scope, id, { ...settings });
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
    static mapping(configuration, overwrites = {}) {
        //        const $: Options = {
        //            application
        //        }
        console.log(configuration, overwrites);
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
    static output(scope, id, settings) {
        return new Store(scope, id, settings);
    }
    ;
}
import * as AWS from "@cdktf/provider-aws";
import { ID } from "./utility";
import { Construct } from "constructs";
import { Store } from "./resource";
export { Resource };
export default Resource;
//# sourceMappingURL=secrets.js.map