import Subprocess from "child_process";
import Process from "process";

const Transform = (linefeed: string[]) => {
    const Output = {
        Lines: [ { Modify: false, Add: false, Delete: false, Rename: false } ], Modified: false, Total: 0
    };

    linefeed.forEach( ($) => {
        const Split = String( $ ).trim().normalize().split( " " );
        const Enumeration = Split[ 0 ].trim();
        const Target = Split[ 1 ] || null;

        const Modifications = {
            Modify: ( Enumeration.search( "M" ) !== -1 ),
            Add: ( Enumeration.search( "A" ) !== -1 ),
            Delete: ( Enumeration.search( "R" ) !== -1 ),
            Rename: ( Enumeration.search( "R" ) !== -1 )
        };

        if ( Modifications.Modify ) Output.Modified = true;

        ( Target && Target !== "" ) && Output.Lines.push( {
            ... Modifications
        } );
    } );

    Output.Total = Output.Lines.length;

    return Output;
};

const Status = (directory: string = Process.cwd()) => {
    const Output = Subprocess.execSync( "git status --porcelain", {
        cwd: directory, stdio: "pipe"
    } ).toString().split( "\n" );

    return Transform( Output );
};

const Data = Status();

export { Data };

export default Data;
