import Chalk    from "chalk";
import Process  from "process";

type Argument = import("yargs").Argv;

const Main = async () => {
    const script = "cloud-factory";

    const { Colors } = await import("../utilities/colors.js").then( ( $ ) => $ );

    const { CLI } = await import("./arguments.js");
    const { Header } = await import("./header.js").then( ( $ ) => $ );
    const Template = await import("../commands/template-engine/index.js");
    const API = await import("../commands/api/index.js");
    
    const Arguments = async () => {
        ( await import("../utilities/tty.js").then( ( $ ) => $.TTY ) ) && Process.stdout.write( Header + "\n" );
        const Commands = {
            cwd: async ( input: Argument ) => ( await import("../commands/environment/cwd.js") ).CWD( input ),
            environment: async ( input: Argument ) => ( await import("../commands/environment/configuration.js") ).NPM(
                input ),
            input: async ( input: Argument ) => ( await import("../commands/prompt") ).JSON( input ),
            git: async ( input: Argument ) => ( await import("../commands/git-template") ).Git( input ),
            version: ( await import("../commands/version.js") ).Version,
            factory: {
                deploy: async ( input: Argument ) => ( await import("../commands/factory/deploy.js") ).Deploy( input ),
                synthesize: async ( input: Argument ) => ( await import("../commands/factory/synthesize.js") ).Synthesize( input ),
                initialize: async ( input: Argument ) => ( await import("../commands/factory/initialize.js") ).Initialize( input ),
                "build-layer": async ( input: Argument ) => ( await import("../commands/factory/build-layer.js") ).Layer( input )
            },
            case: {
                "train-case": async ( input: Argument ) => ( await import("../commands/string/train-case.js") ).Train( input ),
                "screaming-train-case": async ( input: Argument ) => ( await import("../commands/string/screaming-train-case.js") ).Scream( input )
            },
            template: {
                "hydrate": async ( input: Argument ) => await Template.Render( input )
            },
            secrets: {
                "get-secret": async ( input: Argument ) => await API.Get( input ),
                "create-secret": async ( input: Argument ) => await API.Create( input )
            }
        };

        /*** CLI Arguments, Options, and Sub-Command Inclusions */
        return await CLI( Process.argv.splice( 2 ) )
            .scriptName( script ).wrap( await import("../utilities/tty.js").then( ( $ ) => $.Columns() ) )

            .command( "generate-auto-completion", Colors( "Blue", "Generate a CLI Options Auto-Completion Script" ), ( async ( $: Argument ) => {
                $.showCompletionScript();
            } ) )

            .command( "template", Colors( "Blue", "Hydrate JSON Template(s) via Regular Expression(s) Engine" ), ( async ( $: Argument ) => {
                const name = "template";
                const commands = [
                    "hydrate"
                ];

                $.strict().strictOptions().strictCommands();

                $.demandCommand().showHelpOnFail( true );

                /*** Namespace'd Usage Command + Description */
                $.usage( "Usage:" + " " + script + " " + name + " " + "[--help] Sub-Command ? [--Flag(s)]" );

                $.example( "Fill Template (Prompt)", name + " " + commands[0] + " " + "? [--help] ? [--Flag(s)]" );

                $.command( commands[0], "Hydrate Template File", (
                    async ( $: Argument ) => {
                        $.option( "file", { type: "string" } ).alias( "file", "f" ).describe( "file", Colors( "Bright-White", "Template File Path (Required, Prompt)" ) ).default( "file", null );
                        $.option( "output", { type: "string" } ).alias( "output", "o" ).describe( "output", Colors( "Bright-White", "Hydrated Template Output Path (Required, Prompt)" ) ).default( "output", null );

                        await Commands.template.hydrate( $ );
                    } ) );
            } ) )

            .command( "secrets-manager", Colors( "Blue", "AWS Secrets Management API" ), ( async ( $: Argument ) => {
                const name = "secrets-manager";
                const commands = [
                    "get",
                    "create"
                ];

                $.strict().strictOptions().strictCommands();

                $.demandCommand().showHelpOnFail( true );

                /*** Namespace'd Usage Command + Description */
                $.usage( "Usage:" + " " + script + " " + name + " " + "[--help] Sub-Command ? [--Flag(s)]" );

                /*** Namespace'd Example(s) */
                $.example( "Get Secret (Prompt)", script + " " + name + " " + commands[0] + " " + "? [--help] ? [--Flag(s)]" );
                $.example( "Create Secret (Prompt)", script + " " + name + " " + commands[1] + " " + "? [--help] ? [--Flag(s)]" );

                $.command( commands[0], "Retrieve AWS Secret", (
                    async ( $: Argument ) => {
                        /*** Namespace'd Example(s) */
                        $.example( "API Response (Prompt)", script + " " + name + " " + commands[0] );
                        $.example( "Print Secret (Prompt)", script + " " + name + " " + commands[0] + " " + "--value-only" );
                        $.example( "Create Secret File (No-Prompt)", script + " " + name + " " + commands[0] + " " + "--name \"Organization-Secret\" --file \"Output.json\" --value-only" );

                        $.option( "name", { type: "string" } ).alias( "name", "n" ).describe( "name", Colors( "Bright-White", "Secret Resource Name (Required, Prompt)" ) ).default( "name", null );
                        $.option( "file", { type: "string" } ).alias( "file", "f" ).describe( "file", Colors( "Bright-White", "Write Output to File Handler" ) ).default( "file", null );
                        $.option( "value-only", { type: "boolean" } ).alias( "value-only", "x" ).describe( "value-only", Colors( "Bright-White", "Retrieve Only the Secret-Value - No API Response" ) ).default( "value-only", false );

                        await Commands.secrets["get-secret"]( $ );
                    } )
                );

                $.command( commands[1], "Create AWS Secret", (
                    async ( $: Argument ) => {
                        /*** Namespace'd Example(s) */
                        $.example( "Create Secret",
                            script + " " + name + " " + commands[1] + " " + "--name \"IBM/Production/Audit-Service/Storage/Watson-AI/Credentials\" --description \"IBM Watson Storage Login Credentials\" --secret \"input.json\"" );

                        $.option( "name", { type: "string" } ).alias( "name", "n" ).describe( "name", Colors( "Bright-White", "Resource Name" ) ).default( "name", null );
                        $.option( "description", { type: "string" } ).alias( "description", "d" ).describe( "description", Colors( "Bright-White", "Usage Description" ) ).default( "description", null );
                        $.option( "input", { type: "string" } ).alias( "input", "i" ).describe( "input", Colors( "Bright-White", "Pipe'd JSON Serializable String from Standard-Input" ) ).default( "input", null );
                        $.option( "secret", { type: "string" } ).alias( "secret", "f" ).describe( "secret", Colors( "Bright-White", "JSON File-System Path Containing Secret's Content" ) ).default( "secret", null );

                        await Commands.secrets["create-secret"]( $ );
                    } )
                );
            } ) )

            /*** String Manipulation */
            .command( "string", Colors( "Blue", "String Regular-Expression Function(s)" ), (
                async ( $: Argument ) => {
                    $.command( "train-case", "Train-Case String Manipulation", (
                        async ( $: Argument ) => await Commands.case["train-case"]( $ ) )
                    );

                    $.command( "screaming-train-case", "Screaming-Train-Case String Manipulation", (
                        async ( $: Argument ) => await Commands.case["screaming-train-case"]( $ ) )
                    );
                } )
            )

            /*** Runtime Environment */
            .command( "environment", Colors( "Blue", "Runtime Environment Information" ), (
                async ( $: Argument ) => {

                    /*** NPM Configuration */
                    $.command( "npm-configuration", "NPM Runtime Environment Variable(s) & Configuration", (
                        async ( $: Argument ) => await Commands.environment( $ ) )
                    );

                    /*** Current Working Directory */
                    $.command( "cwd", "Current Working Directory", (
                        async ( $: Argument ) => await Commands.cwd( $ ) )
                    );
                } ) )

            /*** JSON-Input */
            .command( "json-input", Colors( "Red", "JSON User-Input" ), (
                async ( $: Argument ) => {
                    return await Commands.input( $ );
                } ) )

            /*** Test-Input */
            .command( "git", Colors( "Red", "Git Templating" ), (
                async ( $: Argument ) => {
                    return await Commands.git( $ );
                } ) )

            /*** CDFK Configuration */
            .command( "ci-cd", Colors( "Yellow", "(Under Development) CI-CD Utilities" ), (
                async ( $: Argument ) => {
                    $.command( "build-layer", "Build a Lambda Layer", (
                        async ( $: Argument ) => await Commands.factory["build-layer"]( $ ) )
                    );

                    $.command( "initialize", "Create Distribution", (
                        async ( $: Argument ) => await Commands.factory.initialize( $ ) )
                    );

                    $.command( "synthesize", "Stack Synthesis", (
                        async ( $: Argument ) => await Commands.factory.synthesize( $ ) )
                    );

                    $.command( "deploy", "Deploy Cloud Resource(s)", (
                        async ( $: Argument ) => await Commands.factory.deploy( $ ) )
                    );
                } )
            )

            /*** Version - Hide unless Explicitly Invoked*/
            .version( [ ... Commands.version ].join( " " ) ).alias( "version", "v" ).describe( "version", Colors( "Green", "Show Version Number" ) ).hide( "version" )

            /*** Global Usage Text */
            .usage( Chalk.italic( "Usage:" + " " + script + " " + "? [--version] { Command } ? [--Flag(s)]" ) )

            /*** Global Help Command */
            .help( "help" ).alias( "help", "h" ).describe( "help", Colors( "Green", "Display Additional Information & Usage Command(s)" ) ).showHelpOnFail( true, Colors( "Red", "Error Parsing CLI Input(s)" ) )

            /*** Global Debug Optional */
            .option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false ).describe( "debug", Colors( "Green", "Enable Verbose Logging - Primarily for Development Purposes" ) )

            /*** Catch Anything not Found */
            .command({
                command: "*",
                handler: () => {
                    /// console.error("Invalid Command");

                    process.exit(1);
                },
            })

            .parseAsync();
    };

    return await Arguments();
};

export { Main };

export default {};