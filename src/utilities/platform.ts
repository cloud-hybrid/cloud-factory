import OS from "os";

const $ = OS.platform();

const Platform = { Name: "", Valid: false };

switch ( $ ) {
    case "aix": /*** @Unsupported */
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "android":
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "darwin": /*** @Supported */
        /// console.debug("[Debug] OS Support Validated as Successful");

        Platform.Name = "Apple";
        Platform.Valid = true;

        break;
    case "freebsd":
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "linux": /*** @Supported */
        /// console.debug("[Debug] OS Support Validated as Successful");

        Platform.Name = "Linux";
        Platform.Valid = true;

        break;
    case "openbsd": /*** @Unsupported */
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "sunos": /*** @Unsupported */
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "win32": /*** @Unsupported ? Planned Support */
        /// console.debug("[Debug] OS Support Validated as Successful");

        // Platform.Name = "Windows";
        // Platform.Valid = true;

        break;
    case "netbsd": /*** @Unsupported */
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
    case "cygwin": /*** @Unsupported */
        /// console.error("[Error] OS Not Supported");
        /// console.debug("[Debug] Exiting ...");

        break;
}

export default { ... Platform };
