import Colors from "chalk";

const Year = new Date().getFullYear();

const Title = Colors.bold.underline( "Cloud-Factory" ) + " - " + Colors.italic.red( "Software-Defined State" );
const Description = Colors.white( "CLI Tools & Cloud Management Utilities" );
const Copyright = Colors.dim( "Open Source" + "," + " " + Year );
const License = Colors.dim( "BSD-1 License" );

const Generate = () => {
    const Lines: string[] = [];

    /// Check if Local `run-script start` is interfacing `factory`
    ( process.env?.npm_lifecycle_event !== "start" ) && Lines.push( "" );

    Lines.push( [ Colors.blue( "    //\\\\--/" ), "  ", Colors.magentaBright( " //\\\\--/" ) ].join( "" ) );
    Lines.push( [ Colors.blue( "   ╱╱__\\\\/" ), "  ", Colors.magentaBright( " //__\\\\/" ) ].join( "" ) + "   " + Title );
    Lines.push( [ Colors.blue( "  ╱╱\\\\--/" ), "  ", Colors.magentaBright( " //\\\\--/" ) ].join( "" ) );
    Lines.push( [ Colors.blue( " //__\\\\/" ), "  ", Colors.magentaBright( " //__\\\\/" ) ].join( "" ) + "   " + Description );
    Lines.push( [ Colors.blue( " \\\\--/\\\\" ), "  ", Colors.magentaBright( "//\\\\--/" ) ].join( "" ) );
    Lines.push( [ Colors.blue( "  \\\\/__\\\\" ), "", Colors.magentaBright( "//__\\\\/" ) ].join( "" ) + "   " + Copyright + " " + License );
    Lines.push( [ Colors.blue( "   \\\\---" ), "", Colors.magentaBright( "//\\\\--/" ) ].join( "" ) );
    Lines.push( [ Colors.blue( "    \\\\" ), " ", Colors.magentaBright( "//__\\\\/" ) ].join( "" ) + "   " + Colors.yellow(
        "--[H]elp for Usage" ) );
    Lines.push( [ Colors.blue( "     \\\\" ), "", Colors.magentaBright( "\\\\--//" ) ].join( "" ) );
    Lines.push( "" );

    return Lines.join( "\n" );
};

const Header = Generate();

export { Header };

export default Header;