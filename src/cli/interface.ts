import Chalk from "chalk";
import Process from "process";
import Colors from "../utilities/colors.js";
import TTY, { Columns } from "../utilities/tty.js";
import { Arguments as CLI, Argv } from "./arguments.js";

import { Header } from "./header.js";

const Factory = await import("../commands/factory/index.js");
const Casing = await import("../commands/string/index.js");
const Template = await import("../commands/template-engine/index.js");
const API = await import("../commands/api/index.js");

const Main = async () => {
    (TTY) && Process.stdout.write( Header + "\n" );

    const script = "cloud-factory";
    const Arguments = async () => {
        const Commands = {
            cwd: async (input: Argv) => (await import("../commands/environment/cwd.js")).CWD( input ),
            environment: async (input: Argv) => (await import("../commands/environment/configuration.js")).Configuration(
                input ),
            input: async (input: Argv) => (await import("../commands/test-input.js")).Input( input ),
            version: (await import("../commands/version.js")).Version,
            factory: {
                deploy: async (input: Argv) => await Factory.Deploy( input ),
                synthesize: async (input: Argv) => await Factory.Synthesize( input ),
                initialize: async (input: Argv) => await Factory.Initialize( input ),
                "build-layer": async (input: Argv) => await Factory.Layer( input )
            },
            case: {
                "train-case": async (input: Argv) => await Casing.Train( input ),
                "screaming-train-case": async (input: Argv) => await Casing.Scream( input )
            },
            template: {
                "hydrate": async (input: Argv) => await Template.Render( input )
            },
            secrets: {
                "get-secret": async (input: Argv) => await API.Get( input ),
                "create-secret": async (input: Argv) => await API.Create( input )
            }
        };

        /*** CLI Arguments, Options, and Sub-Command Inclusions */
        return await CLI( Process.argv.splice( 2 ) )
            .scriptName( script ).wrap( Columns() )

            .command( "generate-auto-completion", Colors( "Blue", "Generate a CLI Options Auto-Completion Script" ), (async ($: Argv) => {
                $.showCompletionScript();
            }) )

            .command( "template", Colors( "Blue", "Hydrate JSON Template(s) via Regular Expression(s) Engine" ), (async ($: Argv) => {
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
                    async ($: Argv) => {
                        $.option( "file", { type: "string" } ).alias( "file", "f" ).describe( "file", Colors( "Bright-White", "Template File Path (Required, Prompt)" ) ).default( "file", null )
                        $.option( "output", { type: "string" } ).alias( "output", "o" ).describe( "output", Colors( "Bright-White", "Hydrated Template Output Path (Required, Prompt)" ) ).default( "output", null );

                        await Commands.template.hydrate( $ )
                    }) );
            }) )

            .command( "secrets-manager", Colors( "Blue", "AWS Secrets Management API" ), (async ($: Argv) => {
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
                    async ($: Argv) => {
                        /*** Namespace'd Example(s) */
                        $.example( "API Response (Prompt)", script + " " + name + " " + commands[0] );
                        $.example( "Print Secret (Prompt)", script + " " + name + " " + commands[0] + " " + "--value-only" );
                        $.example( "Create Secret File (No-Prompt)", script + " " + name + " " + commands[0] + " " + "--name \"Organization-Secret\" --file \"Output.json\" --value-only" );

                        $.option( "name", { type: "string" } ).alias( "name", "n" ).describe( "name", Colors( "Bright-White", "Secret Resource Name (Required, Prompt)" ) ).default( "name", null );
                        $.option( "file", { type: "string" } ).alias( "file", "f" ).describe( "file", Colors( "Bright-White", "Write Output to File Handler" ) ).default( "file", null );
                        $.option( "value-only", { type: "boolean" } ).alias( "value-only", "x" ).describe( "value-only", Colors( "Bright-White", "Retrieve Only the Secret-Value - No API Response" ) ).default( "value-only", false );

                        await Commands.secrets["get-secret"]( $ );
                    })
                );

                $.command( commands[1], "Create AWS Secret", (
                    async ($: Argv) => {
                        /*** Namespace'd Example(s) */
                        $.example( "Create Secret", script + " " + name + " " + commands[1] + " " + "--name \"IBM/Production/Audit-Service/Storage/Watson-AI/Credentials\" --description \"IBM Watson Storage Login Credentials\" --secret \"input.json\"" );

                        $.option( "name", { type: "string" } ).alias( "name", "n" ).describe( "name", Colors( "Bright-White", "Resource Name" ) ).default( "name", null );
                        $.option( "description", { type: "string" } ).alias( "description", "d" ).describe( "description", Colors( "Bright-White", "Usage Description" ) ).default( "description", null );
                        $.option( "input", { type: "string" } ).alias( "input", "i" ).describe( "input", Colors( "Bright-White", "Pipe'd JSON Serializable String from Standard-Input" ) ).default( "input", null );
                        $.option( "secret", { type: "string" } ).alias( "secret", "f" ).describe( "secret", Colors( "Bright-White", "JSON File-System Path Containing Secret's Content" ) ).default( "secret", null );

                        await Commands.secrets["create-secret"]( $ );
                    })
                );
            }) )

            /*** String Manipulation */
            .command( "string", Colors( "Blue", "String Regular-Expression Function(s)" ), (
                async ($: Argv) => {
                    $.command( "train-case", "Train-Case String Manipulation", (
                        async ($: Argv) => await Commands.case["train-case"]( $ ))
                    );

                    $.command( "screaming-train-case", "Screaming-Train-Case String Manipulation", (
                        async ($: Argv) => await Commands.case["screaming-train-case"]( $ ))
                    );
                })
            )

            /*** Runtime Environment */
            .command( "environment", Colors( "Blue", "Runtime Environment Information" ), (
                async ($: Argv) => {

                    /*** NPM Configuration */
                    $.command( "npm-configuration", "NPM Runtime Environment Variable(s) & Configuration", (
                        async ($: Argv) => await Commands.environment( $ ))
                    );

                    /*** Current Working Directory */
                    $.command( "cwd", "Current Working Directory", (
                        async ($: Argv) => await Commands.cwd( $ ))
                    );
                }) )

            /*** Test-Input */
            .command( "test-input", Colors( "Red", "Arbitrary User-Input (Testing Purposes Only)" ), (
                async ($: Argv) => {
                    return await Commands.input( $ );
                }) )

            /*** CDFK Configuration */
            .command( "ci-cd", Colors( "Yellow", "(Under Development) CI-CD Utilities" ), (
                async ($: Argv) => {
                    $.command( "build-layer", "Build a Lambda Layer", (
                        async ($: Argv) => await Commands.factory["build-layer"]( $ ))
                    );

                    $.command( "initialize", "Create Distribution", (
                        async ($: Argv) => await Commands.factory.initialize( $ ))
                    );

                    $.command( "synthesize", "Stack Synthesis", (
                        async ($: Argv) => await Commands.factory.synthesize( $ ))
                    );

                    $.command( "deploy", "Deploy Cloud Resource(s)", (
                        async ($: Argv) => await Commands.factory.deploy( $ ))
                    );
                })
            )

            /*** Version - Hide unless Explicitly Invoked*/
            .version( [ ... Commands.version ].join( " " ) ).alias( "version", "v" ).describe( "version", Colors( "Green", "Show Version Number" ) ).hide( "version" )

            /*** Global Usage Text */
            .usage( Chalk.italic( "Usage:" + " " + script + " " + "? [--version] { Command } ? [--Flag(s)]" ) )

            /*** Global Help Command */
            .help( "help" ).alias( "help", "h" ).describe( "help", Colors( "Green", "Display Additional Information & Usage Command(s)" ) ).showHelpOnFail( true, Colors( "Red", "Error Parsing CLI Input(s)" ) )

            /*** Global Debug Optional */
            .option( "debug", { type: "boolean" } ).alias( "debug", "d" ).default( "debug", false ).describe( "debug", Colors( "Green", "Enable Verbose Logging - Primarily for Development Purposes" ) )

            .parseAsync();
    };

    const Input = await Arguments();
};

export { Main };

export default Main;