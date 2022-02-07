import Process from "process";

import Assertion from "assert";

import Prompt, { PromptModule, StreamOptions } from "inquirer";

interface Input {
    /*** The Input Option Name */
    name: string
    /*** The Input Option Evaluated Value */
    value: any;

    /*** Defaults to "choice" */
    type?: "choice" | string;

    /*** Additional Properties, Not Required */
    extra?: object | string | number | undefined | null;
}

class Option implements Input {
    name;
    value;
    extra?

    type = "choice";

    constructor (input: Input) {
        this.name = input.name;
        this.value = input.value;
        this.extra = input.extra;
    }
}

/*** Given a schema's requirements, present the user with a list of options */
class Handler {
    options: Option[];
    prompt: PromptModule;

    /*** Establish a private static so stream information doesn't leak into instantiated type(s) */
    private static stream: StreamOptions = {
        input: Process.stdin,
        output: Process.stdout
    }

    /***
     * Handler Constructor
     *
     * Runtime assertion will evaluate if the standard-input stream is indeed a TTY device.
     *
     * @param {Input[]} options
     *
     */
    constructor(options: Option[]) {
        this.options = options;
        this.prompt = Prompt.createPromptModule( Handler.stream );

        /*** @todo - Ensure there becomes an environment variable that will turn off this runtime assertion */
        Assertion.equal( Handler.stream.input?.isTTY, true );
    }
}

export { Handler, Option };
export default Handler;
