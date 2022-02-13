#!/usr/bin/env node

import FS from "fs";
import Path from "path";
import Process from "process";

import { Main } from "./src/index.js";

const $ = Path.dirname(Path.normalize(import.meta.url.replace("file://", "")));

const Package = JSON.parse(FS.readFileSync(Path.join($, "package.json"), { encoding: "utf-8" }));

Reflect.set(Process, "package", Package);

await Main();
