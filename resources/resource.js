import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
const Store = TerraformOutput;
class Base extends Construct {
    static service;
    static resource;
    static identifier;
    constructor(scope, name) {
        super(scope, name);
    }
    ;
    static type;
    static mapping;
    static output;
}
export { Base, Store };
export default Base;
//# sourceMappingURL=resource.js.map