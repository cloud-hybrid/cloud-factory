import Type from "./color/colors";

export * from "./index.js";
export * from "./module.js";
export * from "./implementation.js";
export * from "./modifier.js";
export * from "./sequence.js";
export * from "./symbol.js";
export * from "./type.js";

export * from "./color/index.js";

const Colors = await import("./module.js").then( ($) => new $.Module() );

export default (color: Type, content: string) => Colors.string( color, content );
