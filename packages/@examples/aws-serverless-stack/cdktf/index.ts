#!/usr/bin/env node

import { TF, Stack } from "./src";

const Application = new TF.CDK.App( { skipValidation: false, stackTraces: true, outdir: require("./cdktf.json").output } );

new Stack( Application, "lambda-hello-world", {
    path: "../lambda-hello-world/dist",
    handler: "index.handler",
    runtime: "nodejs14.x",
    stageName: "hello-world",
    version: "v0.0.2"
} );

new Stack( Application, "lambda-hello-name", {
    path: "../lambda-hello-name/dist",
    handler: "index.handler",
    runtime: "nodejs14.x",
    stageName: "hello-name",
    version: "v0.0.1"
} );

Application.synth();
