import FS from "fs";
import Path from "path";
import Process from "process";
import * as UUID from "uuid";
import { Application, TF, ID, Initialize } from "./../../configuration";
import { Resource as Parameter } from "./definition";
class Stack extends TF {
    configuration;
    constructor(scope, name, settings) {
        super(scope, ID(name));
        this.configuration = settings(this, name);
        new Parameter(this, name, {
            id: UUID.v4(),
            type: "String",
            name: "/test/parameter/1",
            value: "H31l0 W0rlD",
            force: true
        });
    }
}
export { TF, Stack };
console.log(process.stdout.isTTY);
const Tags = await (await import("./../../tags")).Defaults.prompt();
//const Settings = JSON.parse(await ((await import("./prompt")).Prompt()));
export default (async () => await Initialize().then(async ($) => {
    const configuration = Reflect.get(Initialize, "settings");
    const Manifest = JSON.parse(FS.readFileSync(Path.join(Process.cwd(), "cdktf.json"), { encoding: "utf-8" }));
    const Output = String(Manifest?.output) ?? "cdk.out";
    const application = new Application({
        skipValidation: false,
        stackTraces: true
    });
    const instance = new Stack(application, "Name", $);
    application.synth();
    return instance;
}))();
//# sourceMappingURL=index.js.map