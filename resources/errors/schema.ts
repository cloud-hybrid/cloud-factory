interface Parameters {
    name: string;
    message: string;
}

class Schema extends Error {
    public input: Parameters;
    public readonly stackTraceLimit: number;

    private trace: Function | undefined;
    private reference: this | undefined;

    constructor(configuration: Parameters, trace: number = 3, capture: Function = () => null) {
        super( configuration.message );

        this.input = configuration;

        /*** Ensure the Error-Name is Machine-Readable */
        this.name = configuration.name.replace( " ", "-" );

        // Clips the Constructor invocation from the Stack Trace
        this.stackTraceLimit = trace;
        this.captureStackTrace( this, ( capture !== null ) ? capture : this.constructor );
    }

    private captureStackTrace(reference: this, namespace: Function) {
        this.reference = reference;
        this.trace = namespace;
    }
}

export { Schema };

export default Schema;