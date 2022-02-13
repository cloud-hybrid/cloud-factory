import { AWS, Construct, ID, Store } from "..";
/*** Cloud Resource Class | Constructor Alias */
const Reference = AWS.ssm.SsmParameter;
class Resource extends Construct {
    static service = "SSM";
    static resource = "Parameter";
    static identifier = [this.service, this.resource].join("-");
    /*** The Globally Defined Resource Type */
    instance;
    constructor(scope, name, input) {
        super(scope, ID([name, Resource.identifier].join("-")));
        this.instance = Resource.type(scope, ID([name, Resource.identifier, input.id].join("-")), input);
        Resource.output(scope, ID([name, Resource.identifier, "ARN"].join("-")), {
            value: this.instance.arn,
            description: "Resource Identifier"
        });
        Resource.output(scope, ID([name, Resource.identifier, "Name"].join("-")), {
            value: this.instance.name,
            description: "Resource Name"
        });
        Resource.output(scope, ID([name, Resource.identifier, "Value"].join("-")), {
            value: this.instance.value,
            description: "Resource Value(s)",
            sensitive: true
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
     * @param {Configuration | {}} parameters
     *
     * @returns {Configuration}
     *
     * @private
     *
     */
    static mapping(configuration, parameters = {}) {
        return {
            ...{
                dataType: "text",
                overwrite: configuration?.force ?? false,
                name: configuration.name,
                type: configuration.type,
                value: configuration.value
            }, ...parameters
        };
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
export { Resource };
export default Resource;
//# sourceMappingURL=definition.js.map