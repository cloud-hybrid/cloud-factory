import AJV from "ajv";
import Formats from "ajv-formats";

const Compiler = new AJV( {
    allErrors: true,
    verbose: false,
    removeAdditional: true,
    useDefaults: true,
    validateSchema: true
} );

export { Compiler };

export default Compiler;