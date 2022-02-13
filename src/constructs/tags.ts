import { AwsProviderDefaultTags } from "@cdktf/provider-aws";

type Tagging = AwsProviderDefaultTags;

enum Environment {
    Development = "Development",
    QA = "QA",
    Staging = "Staging",
    UAT = "UAT",
    Production = "Production"
}

type Environments = keyof typeof Environment;

interface Input {
    tf: "True";
    cfn: "False";
    cloud: "AWS";

    creator: string;
    service: string;
    organization: string;

    environment: Environments;
}

class Default {
    environment: Environments;

    organization: string;
    service: string;
    creator: string;

    cloud: "AWS";
    cfn: "False";
    tf: "True";

    constructor(input: Input) {
        this.organization = input.organization;
        this.environment = input.environment;
        this.service = input.service;
        this.creator = input.creator;
        this.cloud = input.cloud;
        this.cfn = input.cfn;
        this.tf = input.tf;
    }

    map() {
        return {
            Organization: String(this.organization ?? "N/A"),
            Environment: String(this.environment ?? "N/A"),
            Service: String(this.service ?? "N/A"),
            Creator: String(this.creator ?? "N/A"),
            Cloud: String(this.cloud ?? "N/A"),
            CFN: String(this.cfn ?? "N/A"),
            TF: String(this.tf ?? "N/A"),
        };
    }
}

class Defaults implements Tagging {
    tags?: {[$: string]: string}

    constructor(configuration: {[$: string]: string}) {
        this.tags = configuration;
    }

    public static initialize(input: Input) {
        const $ = new Default(input);

        return new Defaults( { ... $.map() } );
    }
}

const Tags = (input: Input) => Defaults.initialize(input);

const Settings = Tags;

export { Settings, Tags, Defaults };

export default { Settings, Tags, Defaults };

export type { Environments, Input, Tagging };
