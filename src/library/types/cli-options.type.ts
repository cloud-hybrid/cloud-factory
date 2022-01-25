import { Choices, PositionalOptionsType } from "yargs";

interface Type {
    /** string or array of strings, alias(es) for the canonical option key, see `alias()` */
    alias?: string | ReadonlyArray<string> | undefined;

    /** boolean, interpret option as an array, see `array()` */
    array?: boolean | undefined;

    /**  boolean, interpret option as a boolean flag, see `boolean()` */
    boolean?: boolean | undefined;

    /** value or array of values, limit valid option arguments to a predefined set, see `choices()` */
    choices?: Choices | undefined;

    /** function, coerce or transform parsed command line values into another value, see `coerce()` */
    coerce?: ( (arg: any) => any ) | undefined;

    /** boolean, interpret option as a path to a JSON config file, see `config()` */
    config?: boolean | undefined;

    /** function, provide a custom config parsing function, see `config()` */
    configParser?: ( (configPath: string) => object ) | undefined;

    /** string or object, require certain keys not to be set, see `conflicts()` */
    conflicts?: string | ReadonlyArray<string> | { [ key: string ]: string | ReadonlyArray<string> } | undefined;

    /** boolean, interpret option as a count of boolean flags, see `count()` */
    count?: boolean | undefined;

    /** value, set a default value for the option, see `default()` */
    default?: any;

    /** string, use this description for the default value in help content, see `default()` */
    defaultDescription?: string | undefined;

    /** boolean or string, mark the argument as deprecated, see `deprecateOption()` */
    deprecate?: boolean | string | undefined;

    /** boolean or string, mark the argument as deprecated, see `deprecateOption()` */
    deprecated?: boolean | string | undefined;

    /** boolean or string, demand the option be given, with optional error message, see `demandOption()` */
    demandOption?: boolean | string | undefined;

    /** string, the option description for help content, see `describe()` */
    desc?: string | undefined;

    /** string, the option description for help content, see `describe()` */
    describe?: string | undefined;

    /** string, the option description for help content, see `describe()` */
    description?: string | undefined;

    /** boolean, indicate that this key should not be reset when a command is invoked, see `global()` */
    global?: boolean | undefined;

    /** string, when displaying usage instructions place the option under an alternative group heading, see `group()` */
    group?: string | undefined;

    /** don't display option in help output. */
    hidden?: boolean | undefined;

    /**  string or object, require certain keys to be set, see `implies()` */
    implies?: string | ReadonlyArray<string> | { [ key: string ]: string | ReadonlyArray<string> } | undefined;

    /** number, specify how many arguments should be consumed for the option, see `nargs()` */
    nargs?: number | undefined;

    /** boolean, apply path.normalize() to the option, see `normalize()` */
    normalize?: boolean | undefined;

    /** boolean, interpret option as a number, `number()` */
    number?: boolean | undefined;

    /** boolean, require the option be specified with a value, see `requiresArg()` */
    requiresArg?: boolean | undefined;

    /** boolean, skips validation if the option is present, see `skipValidation()` */
    skipValidation?: boolean | undefined;

    /** boolean, interpret option as a string, see `string()` */
    string?: boolean | undefined;

    type?: "array" | "count" | PositionalOptionsType | undefined;
}

export default Type;