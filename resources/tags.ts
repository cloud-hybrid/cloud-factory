import FS from "fs";

import { AwsProviderDefaultTags } from "@cdktf/provider-aws";
import Path                       from "path";
import Process                    from "process";

import Prompt, { Question, Validation, Selectable } from "./utility/question";

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

    constructor(configuration?: {[$: string]: string}) {
        this.tags = configuration;
    }

    public static initialize(input: Input) {
        const $ = new Default(input);

        return new Defaults( { ... $.map() } );
    }

    public static async prompt() {
        const $: Input = (FS.existsSync(Path.join(Process.cwd(), "configuration.json"))) ? (await import(Path.join(Process.cwd(), "configuration.json"))).default : null;

        console.log($);

        const Organization = await Question.prompt([Prompt.Input.initialize("Organization", "Organization", $.organization ?? null, Validation.valid)]).then(($) => $);
        const Environment = await Question.prompt([Prompt.Selectable.initialize("Environment", "Environment", ["Development", "QA", "Staging", "UAT", "Production"])]).then(($) => $);
        const Service = await Question.prompt([Prompt.Input.initialize("Service", "Service", $.service ?? null, Validation.characters)]).then(($) => $);
        const Creator = await Question.prompt([Prompt.Input.initialize("Creator", "Creator", $.creator ?? null, Validation.name)]).then(($) => $);
        const Cloud = await Question.prompt([Prompt.Input.initialize("Cloud", "Cloud", $.cloud ?? null, Validation.characters)]).then(($) => $);

        const CFN = await Question.prompt([Prompt.Selectable.initialize("Cloudformation", "CFN", ["False"])]).then(($) => $);
        const TF = await Question.prompt([Prompt.Selectable.initialize("Terraform", "TF", ["True"])]).then(($) => $);

        const instance = new Default({
            environment: Environment,
            organization: Organization,
            service: Service,
            creator: Creator,
            cloud: Cloud,
            cfn: CFN,
            tf: TF,
        });

        const defaults = new Defaults();

        defaults.tags = { ... instance };

        return defaults;
    }
}

const Tags = (input: Input) => Defaults.initialize(input);

const Settings = Tags;

export { Settings, Tags, Defaults };

export default { Settings, Tags, Defaults };

export type { Environments, Input, Tagging };
