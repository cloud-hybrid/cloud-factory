import { Construct } from "constructs";

import { TerraformOutput, TerraformOutputConfig } from "cdktf";

const Store = TerraformOutput;

class Base extends Construct {
    private static service: string;
    private static resource: string;
    private static identifier: string;

    private constructor(scope: Construct, name: string) {
        super(scope, name)
    };

    private static type: Function;
    private static mapping: Function;
    private static output: Function;
}

type State = TerraformOutput;
type Output = TerraformOutputConfig;

export { Base, Store };

export default Base;

export type { Output, State };
