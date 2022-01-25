#!/usr/bin/env node

import Spawn from "child_process";
import Path from "path";

const Process = process;

const File = import.meta.url.replace("file" + ":" + "//", "");
const Directory = Path.dirname(File);

/***
 * Subprocess Spawner
 * ==================
 *
 * @param directory {String} System Target Path for a Current-Working-Directory
 *
 * @constructor
 *
 */

const Subprocess = (directory = Process.cwd()) => {
    Spawn.spawnSync("npm", [ "i", "typescript@latest", "--global" ], {
        cwd: directory,
        env: Process.env,
        stdio: "inherit"
    });

    Spawn.spawnSync("cp", [ "-f", "compile.js", Process.cwd() + Path.sep + "distribution" ], {
        cwd: directory,
        env: Process.env,
        stdio: "inherit"
    });

    return Spawn.spawnSync("tsc", [], {
        cwd: directory,
        env: Process.env,
        stdio: "inherit"
    });
};

// @ts-ignore
Subprocess(Directory);
