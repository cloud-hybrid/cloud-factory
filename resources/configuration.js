import Path from "path";
import Module from "module";
import * as AWS from "@cdktf/provider-aws";
import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { ID } from "./utility";
import { Gitlab } from "./backend/gitlab";
import { Defaults } from "./tags";
import { Credentials } from "./credentials";
const $ = Path.dirname(import.meta.url.replace("file://", ""));
const Import = Module.createRequire($);
const Settings = Import(Path.join($, "tags.json"));
console.log(Settings);
class Configuration extends Construct {
    /***
     * Common tag identifiers that are propagated throughout all the resources
     * in a composed stack(s).
     *
     * @type {Tagging}
     */
    identifiers;
    /*** The Stateful Cloud Provider */
    provider;
    /*** Shared Credentials File Location - Defaults to "~/.aws/credentials" */
    credentials;
    /*** Credentials Profile Alias - Defaults to "default" */
    profile;
    /*** AWS Account Region - Derives from Initial Configuration */
    region;
    /*** The Remote State Backend Type - A Construct Wrapper */
    /// readonly backend: Gitlab;
    /*** The Remote State Backend - Used to Track Infrastructure State Across Team(s) & Organizations */
    /// readonly remote: VCS;
    constructor(scope, name, identifiers, /* backend: Gitlab */ credentials = Credentials) {
        super(scope, ID([name, "Configuration"].join("-")));
        this.identifiers = identifiers;
        this.region = credentials.region;
        this.profile = credentials.profile;
        this.credentials = credentials.credentials;
        /// this.backend = backend;
        /// this.remote = backend.remote( scope );
        this.provider = new AWS.AwsProvider(scope, ID([name, "Configuration", "Provider"].join("-")), {
            region: this.region,
            profile: this.profile,
            defaultTags: this.identifiers,
            sharedCredentialsFile: this.credentials
        });
        /// Output( scope, ID( [ name, "Configuration", "Backend" ].join( "-" ) ), {
        ///     description: "Stack's State Backend",
        ///     sensitive: false,
        ///     value: this.backend.settings
        /// } );
        Output(scope, ID([name, "Configuration", "Profile"].join("-")), {
            description: "Stack's Instantiated Credential's Profile",
            sensitive: false,
            value: this.profile
        });
        /// Output( scope, ID( [ name, "Configuration", "Tags" ].join( "-" ) ), {
        ///     description: "Stack's Propagated Resource Tag(s)",
        ///     sensitive: false,
        ///     value: this.identifiers.tags
        /// } );
    }
    static tags(input) {
        return Defaults.initialize(input);
    }
}
/***
 * Primary Application Entry-Point
 * ---
 *
 * Initializes the Deployable from Configuration + Opinionated Default(s)
 *
 * @returns {Promise<(scope: Construct) => Configuration>}
 *
 * @constructor
 *
 */
const Initialize = async function () {
    const environment = Settings.environment;
    const tags = Configuration.tags({
        tf: Settings.tf,
        cfn: Settings.cfn,
        cloud: Settings.cloud,
        service: Settings.service,
        creator: Settings.creator,
        environment: Settings.environment,
        organization: Settings.organization
    });
    /// assert.match(environment, RegExp("(Development)|(QA)|(Staging)|(UAT)|(Production)"));
    const backend = await Gitlab.initialize(environment, 0);
    Reflect.set(Initialize, "settings", Settings);
    return (scope, name) => new Configuration(scope, name, tags);
};
const Application = App;
const TF = TerraformStack;
const Output = (scope, id, input) => new TerraformOutput(scope, id, input);
export { AWS, Application, TF, Settings, Output, ID, Initialize, Configuration, Construct };
export default Initialize;
//# sourceMappingURL=configuration.js.map