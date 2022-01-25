import { Base } from "./base.js";
import { Modifier } from "../modifier.js";

class Color extends Base implements Modifier {
    protected static colors: Color[] = [];

    constructor(name: string, code: number) {
        super( name, Color.type, [ code, Color.closure ] );

        Color.colors.push( this );
    }
}

class Radiant extends Base implements Modifier {
    protected static colors: Radiant[] = [];

    constructor(name: string, code: number) {
        super( name, Color.type, [ code, Color.closure ] );

        Radiant.colors.push( this );
    }
}

export { Color, Radiant };
export default Color;