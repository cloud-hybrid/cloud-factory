//import { Application, TF, Construct, Configuration, ID, Initialize, Initializer } from "./configuration";
//
//import { Resource as Parameter } from "./ssm-parameter";
//
//class Stack extends TF {
//    configuration: Configuration;
//
//    constructor(scope: Construct, name: string, settings: Initializer) {
//        super( scope, ID( name ) );
//
//        this.configuration = settings( this, name );
//
//        new Parameter(this, name, {
//            id: "Test-1",
//            type: "String",
//            name: "/test/parameter/1",
//            value: "H31l0 W0rlD",
//            force: true
//        });
//    }
//}
//
//export { TF, Stack };
//
//export default (async () => await Initialize().then(($) => {
//    const configuration: typeof import("./../configuration.json") = Reflect.get(Initialize, "settings");
//
//    const application = new Application( {
//        skipValidation: false,
//        stackTraces: true,
//        outdir: "ssm-parameter"
//    } );
//
//    const instance = new Stack(application, configuration.service, $);
//
//    application.synth();
//
//    return instance;
//}))();

export default {};