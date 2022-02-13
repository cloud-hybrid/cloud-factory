import Process from "process";

/***
 * Local Process Packaged Directory Source
 *
 * The environment variable `npm_config_local_prefix` is the current working directory of the control process;
 * for example, if /File-System/Package-1 is the current working directory for the controller, and the controller
 * executes a script in /File-System/Package-2, the `npm_config_local_prefix` value, from the executed
 * /File-System/Package-1 `process.env`'s context, would still be `/File-System/Package-1`.
 *
 * @type {string}
 *
 */

const Local = Process.env?.npm_config_local_prefix ?? Process.cwd();

export {
    Local
};
