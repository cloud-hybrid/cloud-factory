import Spawn from "child_process";
declare const Subprocess: (command: string, directory?: string) => Promise<Spawn.ChildProcessWithoutNullStreams>;
export { Subprocess };
export default Subprocess;
