import Path    from "path";
import Process from "process";

const Dot = ( await import("dotenv") ).config( {
    path: Path.join( Process.cwd(), ".env" ), encoding: "utf-8", debug: true, override: true
} );

export { Dot };