import FS from "fs";
import Path from "path";
import Process from "process";
import Prompt, { Question, Validation } from "./utility/question";
var Environment;
(function (Environment) {
    Environment["Development"] = "Development";
    Environment["QA"] = "QA";
    Environment["Staging"] = "Staging";
    Environment["UAT"] = "UAT";
    Environment["Production"] = "Production";
})(Environment || (Environment = {}));
class Default {
    environment;
    organization;
    service;
    creator;
    cloud;
    cfn;
    tf;
    constructor(input) {
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
class Defaults {
    tags;
    constructor(configuration) {
        this.tags = configuration;
    }
    static initialize(input) {
        const $ = new Default(input);
        return new Defaults({ ...$.map() });
    }
    static async prompt() {
        const $ = (FS.existsSync(Path.join(Process.cwd(), "configuration.json"))) ? (await import(Path.join(Process.cwd(), "configuration.json"))).default : null;
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
        defaults.tags = { ...instance };
        return defaults;
    }
}
const Tags = (input) => Defaults.initialize(input);
const Settings = Tags;
export { Settings, Tags, Defaults };
export default { Settings, Tags, Defaults };
//# sourceMappingURL=tags.js.map