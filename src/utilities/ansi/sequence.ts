interface Sequence {
    /***
     * Control Sequence Introducer
     * ---
     *
     * > *For Control Sequence Introducer, or CSI, commands, the ESC [ is followed by any number (including none) of
     * > "parameter bytes" in the range 0x30–0x3F (ASCII 0–9:;<=>?), then by any number of "intermediate bytes" in the
     * > range 0x20–0x2F (ASCII space and !"#$%&'()*+,-./), then finally by a single "final byte" in the range 0x40–0x7E
     * > (ASCII @A–Z[\]^_`a–z{|}~).*
     *
     * - Escape Sequence: `ESC`
     * - Set Element: `[`
     * - Byte: `0x9B`
     * - Abbreviation: `CSI`
     *
     * The byte in the range 0x40 through 0x7E that terminates the character set.
     *
     * @default "["
     * @type {string}
     * @see {@link https://www.ecma-international.org/wp-content/uploads/ECMA-48_5th_edition_june_1991.pdf ECMA Standard, Reprint 1991}
     */
    introducer: string;

    /***
     * Select Graphic Rendition
     * ---
     *
     * > *Sets colors and style of the characters following this code*
     *
     * The constant (`m`) character that terminates the style(s) or color(s) sequence(s), and that therefore modifies
     * all following input in some visible way.
     *
     * @default "m"
     * @type {string}
     * @see {@link https://man7.org/linux/man-pages/man4/console_codes.4.html Linux Console Output}
     *
     */
    rendition: string;

    /***
     * The control chracter that starts all the escape sequences
     *
     * - Name: `Escape`
     *
     * @default "0x1B" | "\u001b"
     * @type {string}
     *
     */
    escape: string;

    /***
     * The integer value that defines which color or style to start the visual-type
     *
     * @type {number|null|undefined}
     *
     */
    open: number | null | undefined;

    /***
     * The integer value that defines which color or style to stop the visual-type
     *
     * @type {number|null|undefined}
     *
     */
    close: number | null | undefined;
}

class Sequence implements Sequence {
    public static readonly introducer: string = "[";

    public static readonly rendition: string = "m";

    public static readonly escape: string = "\\u001b";

    public readonly style: Function = this.construct;

    open: number | null | undefined = null;

    close: number | null | undefined = null;

    constructor(opener: number, closure: number) {
        this.open = opener;
        this.close = closure;

        this.style = (input: string | null) => this.construct( input ?? "" );
    }

    /***
     * The indices of the construction array are required to be hardcoded because the runtime undefines the escape,
     * introducer, and rendition when combined with input...
     *
     * @param output {string}
     *
     * @returns {string}
     *
     * @private
     *
     */

    private construct(output: string) {
        return [
            [ "\u001b[", this.open, "m" ].join( "" ), // Begin the Style Sequence
            output, // --> Style the `output` (input parameter string)
            [ "\u001b[", this.close, "m" ].join( "" ) // Terminate the Style Sequence
        ].join( "" );
    }
}

export { Sequence };

export default Sequence;