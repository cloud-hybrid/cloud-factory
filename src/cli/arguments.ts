import Arguments, { Argv } from "yargs";

import { hideBin } from "yargs/helpers";

type Argument = Arguments.Argv;

export { Arguments as CLI, hideBin };

export type { Argv, Argument };
