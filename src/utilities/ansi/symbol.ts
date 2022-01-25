import Process from "process";

/***
 * Ensure to give credit to the... I believe the ansi-styles? team...
 * @type {boolean}
 */

const Hyper = Process.env.TERM_PROGRAM === "Hyper";
const Windows = Process.platform === "win32";
const Linux = Process.platform === "linux";

const common = {
    ballotDisabled: "☒",
    ballotOff: "☐",
    ballotOn: "☑",
    bullet: "•",
    bulletWhite: "◦",
    fullBlock: "█",
    heart: "❤",
    identicalTo: "≡",
    line: "─",
    mark: "※",
    middot: "·",
    minus: "－",
    multiplication: "×",
    obelus: "÷",
    pencilDownRight: "✎",
    pencilRight: "✏",
    pencilUpRight: "✐",
    percent: "%",
    pilcrow2: "❡",
    pilcrow: "¶",
    plusMinus: "±",
    question: "?",
    section: "§",
    starsOff: "☆",
    starsOn: "★",
    upDownArrow: "↕"
};

const windows = Object.assign( {}, common, {
    check: "√",
    cross: "×",
    ellipsisLarge: "...",
    ellipsis: "...",
    info: "i",
    questionSmall: "?",
    pointer: ">",
    pointerSmall: "»",
    radioOff: "( )",
    radioOn: "(*)",
    warning: "‼"
} );

const other = Object.assign( {}, common, {
    ballotCross: "✘",
    check: "✔",
    cross: "✖",
    ellipsisLarge: "⋯",
    ellipsis: "…",
    info: "ℹ",
    questionFull: "？",
    questionSmall: "﹖",
    pointer: Linux ? "▸" : "❯",
    pointerSmall: Linux ? "‣" : "›",
    radioOff: "◯",
    radioOn: "◉",
    warning: "⚠"
} );

const Exportable = ( Windows && !Hyper ) ? windows : other;

Object.defineProperty( Exportable, "common", { enumerable: false, value: common } );
Object.defineProperty( Exportable, "windows", { enumerable: false, value: windows } );
Object.defineProperty( Exportable, "other", { enumerable: false, value: other } );

export { Exportable } ;
