interface Parameters {
    name: string;
    message: string;
}
declare class Schema extends Error {
    input: Parameters;
    readonly stackTraceLimit: number;
    private trace;
    private reference;
    constructor(configuration: Parameters, trace?: number, capture?: Function);
    private captureStackTrace;
}
export { Schema };
export default Schema;
