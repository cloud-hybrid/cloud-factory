import { Implementation, Type } from "../implementation.js";
import { default as Modifiers } from "../modifier.js";

class Base extends Implementation {
    static type: Type | string = "color";

    static closure: number = 39;

    bold = (input: string) => Modifiers.Bold.style( this.style( input ) );

    strikethrough = (input: string) => Modifiers.Strikethrough.style( this.style( input ) );

    reset = (input: string) => Modifiers.Reset.style( this.style( input ) );

    dim = (input: string) => Modifiers.Dim.style( this.style( input ) );

    italic = (input: string) => Modifiers.Italic.style( this.style( input ) );

    underline = (input: string) => Modifiers.Underline.style( this.style( input ) );

    inverse = (input: string) => Modifiers.Inverse.style( this.style( input ) );

    hidden = (input: string) => Modifiers.Hidden.style( this.style( input ) );
}

export { Base };
export default Base;