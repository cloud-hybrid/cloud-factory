import Spawn from "child_process";

const Process = process;

/***
 * Subprocess Spawner
 * ==================
 *
 * @param command {String} Denormalized, Shell Command
 * @param directory {String} System Target Path for a Current-Working-Directory
 *
 * @constructor
 *
 */

const Subprocess = (command, directory = Process.cwd()) => {
    const Binary = command.split(" ")[ 0 ];
    const Arguments = command.split(" ").splice(1);

    return Spawn.spawnSync(Binary, [ ...Arguments ], {
        cwd: directory,
        env: Process.env,
        stdio: "inherit"
    });
};

export { Subprocess };

export default Subprocess;