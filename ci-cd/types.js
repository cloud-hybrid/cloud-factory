#!/usr/bin/env node

import { Subprocess } from "./subprocess.js";

import Process from "process";
import Path from "path";
import FS from "fs";

const URI = import.meta.url;

/*** Current User's Working Directory */
const CWD = Process.cwd();

/*** CI-CD Directory */
const CI = Path.dirname(URI).replace("file://", "");

/*** Target, @types Directory */
const Target = Path.join(Path.dirname(CI), "@types");

/*** Valid, Existing Directory */
const Valid = FS.existsSync(Target) && FS.statSync(Target).isDirectory();

(Valid) || await Subprocess("npm run get", Path.dirname(CI));

const Providers = FS.readdirSync(Path.join(Target, "providers"), { encoding: "utf-8", withFileTypes: true });

Providers.forEach(async ($) => {
    const Name = ["@internal", $.name].join("/");
    const Type = "module";
    const Version = "0.0.0";

    const Package = JSON.stringify({
        name: Name,
        type: Type,
        version: Version,
        main: "index.js",
        scripts: {
            compile: "tsc --pretty"
        },
        dependencies: {
            "@aws-sdk/types": "latest",
            "@types/node": "latest",
            "source-map-support": "latest",
            typescript: "latest",
            tslib: "latest"
        }
    }, null, 4);

    const File = Path.join(Path.join(Target, "providers"), $.name, "package.json");

    FS.writeFileSync(File, Package);

    const Destination = Path.join(Path.join(Target, "providers"), $.name, "tsconfig.json");
    FS.copyFileSync(Path.join(CI, "typescript.settings.json"), Destination);

    const PWD = Process.cwd();
    Process.chdir(Path.dirname(Destination));

    await Subprocess("npm install", Path.dirname(Destination));
    await Subprocess("tsc --pretty", Path.dirname(Destination));

    Process.chdir(PWD);
});

Process.chdir(Path.dirname(CI));

await Subprocess("npm install");
await Subprocess("npm link");

export {};