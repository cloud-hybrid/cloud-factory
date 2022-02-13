import { spawn } from "child_process";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
const HTTP = await import("follow-redirects");
const { https, http } = HTTP;
function isPresent(input) {
    return Array.isArray(input) && input.length > 0;
}
function getLocalMatch(source) {
    return source.match(/^(\.\/|\.\.\/|\.\\\\|\.\.\\\\)(.*)/);
}
export function isLocalModule(source) {
    return getLocalMatch(source) !== null;
}
export async function shell(program, args = [], options = {}) {
    const stderr = new Array();
    const stdout = new Array();
    try {
        return await exec(program, args, options, (chunk) => {
            stdout.push(chunk.toString());
            console.log(chunk.toString());
        }, (chunk) => stderr.push(chunk));
    }
    catch (e) {
        if (stderr.length > 0) {
            e.stderr = stderr.map((chunk) => chunk.toString()).join("");
        }
        if (stdout.length > 0) {
            e.stdout = stdout.join("");
        }
        throw e;
    }
}
export async function withTempDir(dirname, closure) {
    const prevdir = process.cwd();
    const parent = await fs.mkdtemp(path.join(os.tmpdir(), "cdktf."));
    const workdir = path.join(parent, dirname);
    await fs.mkdirp(workdir);
    try {
        process.chdir(workdir);
        await closure();
    }
    finally {
        process.chdir(prevdir);
        await fs.remove(parent);
    }
}
export async function mkdtemp(closure) {
    const workdir = await fs.mkdtemp(path.join(os.tmpdir(), "cdktf."));
    try {
        await closure(workdir);
    }
    finally {
        await fs.remove(workdir);
    }
}
export const exec = async (command, args, options, stdout, stderr) => {
    return new Promise((ok, ko) => {
        const child = spawn(command, args, options);
        const out = new Array();
        const err = new Array();
        if (stdout !== undefined) {
            child.stdout?.on("data", (chunk) => {
                stdout(chunk);
            });
        }
        else {
            child.stdout?.on("data", (chunk) => {
                out.push(chunk);
            });
        }
        if (stderr !== undefined) {
            child.stderr?.on("data", (chunk) => {
                stderr(chunk);
            });
        }
        else {
            child.stderr?.on("data", (chunk) => {
                process.stderr.write(chunk);
                err.push(chunk);
            });
        }
        child.once("error", (err) => ko(err));
        child.once("close", (code) => {
            if (code !== 0) {
                const error = new Error(`non-zero exit code ${code}`);
                error.stderr = err.map((chunk) => chunk.toString()).join("");
                return ko(error);
            }
            return ok(Buffer.concat(out).toString("utf-8"));
        });
    });
};
export async function readCDKTFVersion(outputDir) {
    const outputFile = path.join(outputDir, "cdk.tf.json");
    if (fs.existsSync(outputFile)) {
        const outputJSON = fs.readFileSync(outputFile, "utf8");
        const data = JSON.parse(outputJSON);
        return data["//"].metadata.version;
    }
    return "";
}
/**
 * Downcase the first character in a string.
 *
 * @param str the string to be processed.
 */
export function downcaseFirst(str) {
    if (str === "") {
        return str;
    }
    return `${str[0].toLocaleLowerCase()}${str.slice(1)}`;
}
export class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message); // 'Error' breaks prototype chain here
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        // see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    }
}
export async function downloadFile(url, targetFilename) {
    // if the type is inferred to be "http|https" calling .get() is not possible
    // because the options parameter (which we don't use anyway) for get is
    // not compatible between http and https -> so we treat it as http
    const client = (url.startsWith("http://") ? http : https);
    const file = fs.createWriteStream(targetFilename);
    return new Promise((ok, ko) => {
        const request = client.get(url, (response) => {
            if (response.statusCode !== 200) {
                ko(new HttpError(`Failed to get '${url}' (${response.statusCode})`, response.statusCode));
                return;
            }
            response.pipe(file);
        });
        file.on("finish", () => ok());
        request.on("error", (err) => {
            fs.unlink(targetFilename, () => ko(err));
        });
        file.on("error", (err) => {
            fs.unlink(targetFilename, () => ko(err));
        });
        request.end();
    });
}
//# sourceMappingURL=file-system.js.map