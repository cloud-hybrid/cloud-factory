import Terraform, { TerraformAsset as Archive } from "cdktf";

import { Construct } from "constructs";

const Stack = Terraform.TerraformStack;

interface Configuration extends Terraform.TerraformAssetConfig {
    readonly path: string;
}

class Asset extends Archive implements Configuration {
    static Type = {
        File: 0, Directory: 1, Archive: 2
    };

    constructor(identifier: string, stack: Construct, configuration: Configuration) {
        super( stack, identifier, { type: configuration.type ?? 2, path: configuration.path } );
    }
}

export { Stack, Asset };

export default { Stack, Asset };