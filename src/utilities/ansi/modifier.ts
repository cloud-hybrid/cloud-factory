import { Implementation, Type } from "./implementation.js";

class Modifier extends Implementation implements Implementation {
    static modifiers: Modifier[] = [];

    private static type: Type | string = "modifier";

    constructor(name: string, codes: [ number, number ]) {
        super( name, Modifier.type, [ ... codes ] );

        Modifier.modifiers.push( this );
    }
}

const Reset = new Modifier( "reset", [ 0, 0 ] );
const Bold = new Modifier( "bold", [ 1, 22 ] );
const Dim = new Modifier( "dim", [ 2, 22 ] );
const Italic = new Modifier( "italic", [ 3, 23 ] );
const Underline = new Modifier( "underline", [ 4, 24 ] );
const Inverse = new Modifier( "inverse", [ 7, 27 ] );
const Hidden = new Modifier( "hidden", [ 8, 28 ] );
const Strikethrough = new Modifier( "strikethrough", [ 9, 29 ] );

export {
    Modifier,
    Reset,
    Bold,
    Dim,
    Italic,
    Underline,
    Inverse,
    Hidden,
    Strikethrough
};

export default {
    Reset,
    Bold,
    Dim,
    Italic,
    Underline,
    Inverse,
    Hidden,
    Strikethrough
};