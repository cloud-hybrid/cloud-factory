class Schema extends Error {
    input;
    stackTraceLimit;
    trace;
    reference;
    constructor(configuration, trace = 3, capture = () => null) {
        super(configuration.message);
        this.input = configuration;
        /*** Ensure the Error-Name is Machine-Readable */
        this.name = configuration.name.replace(" ", "-");
        // Clips the Constructor invocation from the Stack Trace
        this.stackTraceLimit = trace;
        this.captureStackTrace(this, (capture !== null) ? capture : this.constructor);
    }
    captureStackTrace(reference, namespace) {
        this.reference = reference;
        this.trace = namespace;
    }
}
export { Schema };
export default Schema;
//# sourceMappingURL=schema.js.map