type Codes = [ number, number ];

enum Type {
    Modifier = "modifier",
    Color = "color",
    Bright = "bright",
    Background = "background"
}

class Identifier extends String {
    constructor(type: Type | string) {
        super( type );
    }
}

export { Type, Identifier };

export default Codes;