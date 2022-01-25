import { Color, Radiant } from "./type.js";

enum Colors {
    Black = "black",
    Red = "red",
    Green = "green",
    Yellow = "yellow",
    Blue = "blue",
    Magenta = "magenta",
    Cyan = "cyan",
    White = "white",
    Gray = "gray",
    Grey = "grey",

    "Bright-Black" = "bright-black",
    "Bright-Red" = "bright-red",
    "Bright-Green" = "bright-green",
    "Bright-Yellow" = "bright-yellow",
    "Bright-Blue" = "bright-blue",
    "Bright-Magenta" = "bright-magenta",
    "Bright-Cyan" = "bright-cyan",
    "Bright-White" = "bright-white",
}

type Type = keyof typeof Colors;

const Black = new Color( "black", 30 );
const Red = new Color( "red", 31 );
const Green = new Color( "green", 32 );
const Yellow = new Color( "yellow", 33 );
const Blue = new Color( "blue", 34 );
const Magenta = new Color( "magenta", 35 );
const Cyan = new Color( "cyan", 36 );
const White = new Color( "white", 37 );
const Gray = new Color( "gray", 90 );
const Grey = new Color( "grey", 90 );

const Bright = {
    Black: new Radiant( "bright-black", 90 ),
    Red: new Radiant( "bright-red", 91 ),
    Green: new Radiant( "bright-green", 92 ),
    Yellow: new Radiant( "bright-yellow", 93 ),
    Blue: new Radiant( "bright-blue", 94 ),
    Magenta: new Radiant( "bright-magenta", 95 ),
    Cyan: new Radiant( "bright-cyan", 96 ),
    White: new Radiant( "bright-white", 97 )
};

export {
    Bright,
    Black,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Gray,
    Grey
};

export default Type;