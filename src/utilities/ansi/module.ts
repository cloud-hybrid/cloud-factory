import Process from "process";
import * as Color from "../ansi/color/colors.js";
import Type from "../ansi/color/colors.js";

class Module {
    Black: typeof Color.Black = Color.Black;

    Red: typeof Color.Red = Color.Red;

    Green: typeof Color.Green = Color.Green;

    Yellow: typeof Color.Yellow = Color.Yellow;

    Blue: typeof Color.Blue = Color.Blue;

    Magenta: typeof Color.Magenta = Color.Magenta;

    Cyan: typeof Color.Cyan = Color.Cyan;

    White: typeof Color.White = Color.White;

    Gray: typeof Color.Gray = Color.Gray;

    Grey: typeof Color.Grey = Color.Grey;

    "Bright-Black": typeof Color.Bright.Black = Color.Bright.Black;

    "Bright-Red": typeof Color.Bright.Red = Color.Bright.Red;

    "Bright-Green": typeof Color.Bright.Green = Color.Bright.Green;

    "Bright-Yellow": typeof Color.Bright.Yellow = Color.Bright.Yellow;

    "Bright-Blue": typeof Color.Bright.Blue = Color.Bright.Blue;

    "Bright-Magenta": typeof Color.Bright.Magenta = Color.Bright.Magenta;

    "Bright-Cyan": typeof Color.Bright.Cyan = Color.Bright.Cyan;

    "Bright-White": typeof Color.Bright.White = Color.Bright.White;

    color = (type: Type) => this[ type ];

    string(color: Type, output: string) {
        return this[ color ].style( output );
    }

    write(color: Type, output: string) {
        Process.stdout.write( this.string( color, output ) + "\n" );
    }
}

export { Module };

export default Type;
