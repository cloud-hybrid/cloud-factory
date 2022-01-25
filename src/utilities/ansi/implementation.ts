import { Sequence } from "./sequence.js";

import Codes, { Identifier, Type } from "./type.js";

class Implementation {
    name: string;

    sequence: Sequence;

    type: Identifier;

    constructor(name: string, type: Type | string, codes: Codes) {
        this.name = name;
        this.sequence = new Sequence( codes[ 0 ], codes[ 1 ] );
        this.type = new Identifier( type ).valueOf();

        this.constructor = this.style;
    }

    style(input: string | null): string {
        return this.sequence.style( input );
    }
}

export { Implementation, Identifier, Type };

export default { Implementation, Identifier, Type };