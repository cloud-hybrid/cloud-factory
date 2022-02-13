import OS from "os";
import Process from "process";
import Subprocess from "child_process";
import * as Listener from "nodemon";
const { default: Application } = Listener;
export default Application({
    colours: true,
    execMap: {
        start: "node --no-warnings --es-module-specifier-resolution node ."
    }, ignore: [".git", "node_modules"],
    watch: ["*.*"],
    stdin: true,
    runOnChangeOnly: false,
    stdout: true,
    watchOptions: {}
}).on("start", async () => {
    console.log("[Debug] Local Development REPL has Started", "\n");
    Subprocess.exec("node --no-warnings --es-module-specifier-resolution node .");
}).on("restart", async (files) => {
    (OS.platform() === "darwin") && Subprocess.exec("osascript -e 'display notification \"Successfully Compiled Source(s)\" with title \"Cloud-Factory\"'");
    console.log("[Debug] Event Source(s)" + ":", JSON.stringify(files, null, 4));
    Process.stdout.write("\n");
});
//# sourceMappingURL=listener.js.map