const FS = require("fs");
const Path = require("path");
const Module = require("module");
const Process = require("process");

const Seperator = Path.sep;

const Service = require("@aws-sdk/client-secrets-manager");

const Provider = new Service.SecretsManager({});

class Froze {
    constructor () {
        this.frozen = true;
    }
}

class Fragment /* extends Froze */ {
    system;

    /**
     * The root of the path such as '/' or 'c:\'
     */

    root = typeof String;

    /**
     * The full directory path such as '/home/user/dir' or 'c:\path\dir'
     */

    dir = typeof String;

    /**
     * The file name including extension (if any) such as 'index.html'
     */

    base = typeof String;

    /**
     * The file extension (if any) such as '.html'
     */

    ext = typeof String;

    /**
     * The file name without extension (if any) such as 'index'
     */

    name = typeof String;

    constructor (path) {
        // super();

        this.system = path;

        this.destructure();

        // Object.freeze(this);
    }

    destructure () {
        const Fragments = Path.parse(this.system);
        Object.keys(Fragments).forEach(($) => {
            Object.defineProperty(this, $, {
                value: Fragments[$],
                configurable: true,
                writable: true,
                enumerable: true
            });
        });
    }
}

class Descriptor /* extends Froze */ {
    constructor (handler) {
        // super();

        const cwd = Process.cwd();

        this.name = handler;

        this.valid = FS.existsSync(cwd, this.path);

        this.path = Path.resolve(cwd, this.name);

        this.fragments = new Fragment(this.path);

        const device = {
            block: FS.lstatSync(this.path).isBlockDevice(),
            character: FS.lstatSync(this.path).isCharacterDevice()
        };

        const queue = FS.lstatSync(this.path).isFIFO();

        const descriptor = FS.lstatSync(this.path).isFile();
        const directory = FS.lstatSync(this.path).isDirectory();

        const socket = FS.lstatSync(this.path).isSocket();
        const symbolic = FS.lstatSync(this.path).isSymbolicLink();

        this.type = Descriptor.evaluate({ device, queue, file: descriptor, directory, socket, symbolic });

        // Object.freeze(this);
    }

    static evaluate (types) {
        const keys = Object.keys(types);
        const values = Object.values(types);
        const type = values.map(($, index) => {
            if ($ === true) {
                return keys[index];
            }
        });

        return type.filter(($) => ($)).pop();
    }
}

class Directory {
    /***
     *
     * File Handler Scanning
     *
     * @param directory {string | undefined}
     *
     * @returns {Descriptor[]}
     *
     */
    constructor (directory) {
        this.package = null;

        this.path = (directory && FS.existsSync(directory)) ? directory : Process.cwd();

        this.name = Path.basename(this.path);

        this.scan(directory);
    }

    /***
     *
     * File Handler Scanning
     *
     * @param directory {string|null}
     *
     * @returns {Descriptor[]}
     *
     */
    scan () {
        const pwd = Process.cwd();

        Process.chdir(this.path);

        const cwd = Process.cwd();
        const scan = FS.readdirSync(cwd);
        const data = scan.map(($) => new Descriptor($));

        this.directories = new Array();
        this.files = new Array();
        this.dots = new Array();

        data.forEach(($) => {
            (String($.name).startsWith(".")) && this.dots.push($);

            if ($.name === "package.json") {
                this.package = {
                    $: true,
                    path: $.path,
                    valid: (FS.existsSync($.path) && JSON.parse(FS.readFileSync($.path))) ?? false
                }
            }

            switch ($.type) {
                case "file": {
                    this.files.push($);
                    break;
                } case "directory": {
                    this.directories.push($);
                    break;
                }
            }
        });

        this.files.total = this.files.length;
        this.directories.total = this.directories.length;
        this.dots.total = this.dots.length;

        Process.chdir(pwd);
    }
}

class Configuration {
    constructor () {
        const $ = new Directory().directories.filter(($) => $.name === "configuration");

        this.directory = ($);
    }
}

class Manager {
    constructor () {
        this.api = new Service.SecretsManager({});
    }

    async generate(file) {
        const data = new Directory();
        console.log(data);

        // console.log(envs);
        //
        // console.debug(Scan.includes("configuration"));
        //
        // const blob = JSON.parse(FS.readFileSync(file));
        //
        // Object.keys(blob).forEach(($) => {
        //     console.log($);
        // });
        //
        // FS.writeFileSync("env.json.test", "...");
        //
        // return true;
    }

    async get(name) {
        const response = await Provider.getSecretValue({
            SecretId: name,
            VersionStage: "AWSCURRENT"
        });

        return response?.SecretString;
    }
}

module.exports = Manager;
module.default = Manager;
module.exports.directory = Directory;
module.exports.configuration = Configuration;
