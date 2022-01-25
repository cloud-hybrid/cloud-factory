/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     ESM Exportable Module
 *
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import AWS, { iam as IAM } from "@cdktf/provider-aws";
import Assertion from "assert";

import { App, AssetType, TerraformAsset, TerraformOutput, TerraformStack } from "cdktf";

import { Construct } from "constructs";
import FS from "fs";
import Module from "module";
import Path from "path";
import Process from "process";
import * as UUID from "uuid";

/*** ESM Compatability & JSON Importer */
const Import: NodeRequire = Module.createRequire( import.meta.url );

/// import { Configuration, Distribution, Import, Settings } from "./settings.js";

interface Distributable {
    name?: string;
    organization?: string;
    environment?: string;
}

const Factory: Distributable = await import(Path.join(Process.cwd(), "./factory.json")).catch(() => {
    return {
        name: "Factory",
        organization: "Cloud-Technology",
        environment: "Development"
    };
});

const Dot = await import("dotenv");

/***
 * Deployment Configuration & Settings
 * -----------------------------------
 *
 * @externs {{@link Settings}}
 *
 */

class Configuration {
    static readonly stack: string = Factory?.name ?? UUID.v4();

    static readonly environment: string = Factory?.environment ?? "Development";

    static readonly organization: string = Factory?.organization ?? "Factory";

    /*** @todo Abstract */
    static readonly region: string = "us-east-2";

    readonly settings?: Distributable | null;

    static service: string = "Service";


    constructor(settings?: Distributable) {
        this.settings = (settings) ? settings : null;
    }
}

type Policy = IAM.IamPolicy;

// @ts-ignore

/***
 * Cloud Resource Name Normalization
 * ---------------------------------
 * Takes any given prefix, a resource name, and generates a machine-readable, normalized string
 *
 * @param prefix {string} ex) [Organization]-[Environment]
 * @param name {string} ex) API-Gateway-V2-Integration
 *
 * @returns {string}
 *
 */

function normalize(prefix: string, name: string) {
    return [ prefix, name.split( " " ).map( ($) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "_" ).map( ($) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "-" ).map( ($) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ) ].join( "-" );
}

enum Clouds {
    AWS = "AWS",
    Azure = "Azure",
    GCP = "GCP"
}

type Providers = keyof typeof Clouds;

/*** The {@link Lambda} Construct */
class Lambda {
    public static Attachment = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";

    public name: string;

    public readonly ID: string;

    public readonly handler: string = "index.handler";

    public readonly runtime: string = "nodejs14.x";

    public readonly directory: string;

    public readonly version: string;

    public readonly source: string;

    public readonly policy: Policy | JSON | string = JSON.stringify( {
        Version: "2012-10-17", Statement: [ {
            Action: "sts:AssumeRole", Principal: {
                Service: "lambda.amazonaws.com"
            }, Effect: "Allow", Sid: ""
        } ]
    }, null, 4 );

    public cloud: Providers = "AWS";

    /// public static Execution = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
    /// public static RO = "arn:aws:iam::aws:policy/service-role/AWSLambda_ReadOnlyAccess";
    /// public static XWO = "arn:aws:iam::aws:policy/service-role/AWSXrayWriteOnlyAccess";

    /*** Common-Name or Service Extension to be used when constructing the Lambda Function Name */

    public stack: string = Configuration.stack;
    public service: string = Configuration.service;
    public environment: string = Configuration.environment;
    public organization: string = Configuration.organization;

    readonly distribution: string = Process.cwd();

    /***
     * Lambda Strict Configuration Constructor
     *
     * @param name {String} Lambda's Folder Name (**Note**: attribute *must match folder directory name*)
     *
     */

    constructor(name: string) {
        this.name = Path.parse( name ).base;

        Assertion.notStrictEqual( this.name, undefined );
        Assertion.notStrictEqual( this.service, undefined );

        const Artifact = Path.join( this.distribution, this.name );
        const Package = Path.join( Artifact, "package.json" );
        const Version = Import( Package )?.version || null;

        Assertion.strictEqual( typeof Version, "string", "Version not Found" );

        this.version = Version;
        this.directory = Artifact;
        this.source = Artifact; /// @todo

        this.ID = [ this.organization, this.environment, "Lambda", this.service, this.name.split( "_" ) ].join( "-" );
    }
}

/***
 * **Serverless Application Model - Construct**
 * ============================================
 *
 * *The following class shall not get confused with the SAM-CLI Cloudformation Transformation(s).*
 *
 *      Overview
 *      --------
 *      SAM is a class that represents, rather, a well-formed ***Serverless Application Model***.
 *
 * @task Rename Class to API-Gateway + SAM Specific Name
 */

class SAM {
    public prefix: string;

    /*** SAM Reference to Encapsulating Folder-Name */
    public name: string;

    /*** Opinionated API Gateway-V2 Resource Name */
    public readonly gateway: string = "API-Gateway";

    /*** Auto-Generated Bucket Property - Requires Instantation */
    public readonly bucket: string;

    /*** Configuration, Read-Only Bucket Property - Requires Instantation for Access */
    public readonly directory?: string | undefined = undefined;

    /*** Configuration Setting Specifying List of Folder(s) that Contain Lambda(s) */
    public readonly functions: string[] = [];

    public readonly layers: string[] = [];

    /*** AWS Cloud Provider, Derived from Configuration (Settings) File */
    public readonly cloud: Providers = "AWS"

    /*** @todo Update Documentation  */
    public readonly region: string = Configuration.region;

    /*** @todo Update Documentation  */
    public stack: string = Configuration.stack;

    /*** @todo Update Documentation  */
    public service: string = Configuration.service;

    /*** Cloud Environment Common-Name, Derived from Configuration (Settings) File */
    public readonly environment: string = Configuration.environment;

    /*** Cloud Organization Alias, Derived from Configuration (Settings) File */
    public readonly organization: string = Configuration.organization;

    /*** @todo Update Documentation  */
    readonly distribution: string = Process.cwd();

    /*** Construct Initializer */
    constructor() {
        this.prefix = [ this.organization, this.environment ].join( "-" );
        this.name = [ this.prefix, this.service, "Stack" ].join( "-" );
        this.bucket = this.name.toLowerCase();

        /// Assertion to ensure a distribution target exists
        Assertion.strictEqual( FS.existsSync( this.distribution ), true, "A CDK Distribution Target Doesn't Exist" );
        FS.readdirSync( this.distribution ).forEach( ($) => {
            ( $ !== "library" ) && this.functions.push( Path.join( this.distribution, $ ) );
        } );

        FS.readdirSync( Path.join(this.distribution, "library" )).forEach( ($) => {
            this.layers.push(Path.join(this.distribution, "library", $));
        });
    }

    /***
     * {@link SAM.generateAPIGatewayCloudWatchAccessLog|API Gateway-V2 Access Logging Generator}
     * =========================================================================================
     * References
     *      - {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-monitor.html|Monitoring HTTP-V2 APIs}
     *
     *      Documentation
     *      -------------
     *      - {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-metrics.html|Metrics}
     *      - {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-logging.html|Logging}
     *           - {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-logging-variables.html|Variables}
     *
     * @param stream {AWS.cloudwatch.CloudwatchLogStream}
     *
     * @param format
     * @returns {{
     *     destinationArn: {String},
     *     format: {String}
     * }|null}
     *
     */

    public static generateAPIGatewayCloudWatchAccessLog(stream: AWS.cloudwatch.CloudwatchLogStream | null = null,
        format: string | null = null) {
        return ( stream === null || format === null ) ? null : {
            destinationArn: String( stream.name ), format: String( format )
        };
    }

    /***
     *
     * {@link SAM.getAPIGatewayLoggingLevel|API Gateway-V2 Logging-Level}
     * ==================================================================
     *
     * References {@link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_stage#logging_level|CFN & TF Logging-Level}
     *
     *      Whitepapers
     *     ------------
     *          -
     * {@link https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/serverless-multi-tier-architectures-api-gateway-lambda.pdf#document-revisions|AWS Serverless Multi-Tier Architectures with Amazon API Gateway and AWS Lambda}
     *          - {@link https://docs.aws.amazon.com/whitepapers/latest/security-overview-aws-lambda/security-overview-aws-lambda.pdf#security-overview-aws-lambda|Security Overview of AWS Lambda}
     *
     * @see {@link https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/serverless-multi-tier-architectures-api-gateway-lambda.pdf#document-revisions|AWS Serverless Multi-Tier Architectures with Amazon API Gateway and AWS Lambda}
     * @see {@link https://docs.aws.amazon.com/whitepapers/latest/security-overview-aws-lambda/security-overview-aws-lambda.pdf#security-overview-aws-lambda|Security Overview of AWS Lambda}
     *
     * @returns {"ERROR", "INFO", "OFF"}
     *
     */

    getAPIGatewayLoggingLevel() {
        const $ = { value: "INFO" };

        /// --> No Break(s) Non-Pure Returns
        switch ( this.environment.toUpperCase() ) {
            case "PRODUCTION":
                /*** Forceful, Hard-Coded Overwrites for Production */

                $.value = "ERROR";

                return $.value;
            default:
                return $.value;
        }
    }

    /***
     * {@link SAM.getAPIGatewayStageMetricsEnabled|API Gateway-V2 Metrics Enablement}
     * ==============================================================================
     *
     * References
     *      - {@link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_stage#detailed_metrics_enabled|Detailed Metrics & Logging}
     *
     * @see {@link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_stage#detailed_metrics_enabled|Terraform Configuration}}
     *
     * @returns {true | false}
     *
     */

    getAPIGatewayStageMetricsEnabled() {
        const $ = { value: true };

        /// --> No Break(s) Non-Pure Returns
        switch ( this.environment.toUpperCase() ) {
            case "PRODUCTION":
                /*** Forceful, Hard-Coded Overwrites for Production */

                $.value = true;

                return $.value;
            default:
                return $.value;
        }
    }
}

class Service extends TerraformStack {
    readonly prefix: string;

    readonly identifier: string;

    constructor($: Construct, settings: SAM) {
        super( $, settings.name );

        this.prefix = settings.prefix;
        this.identifier = settings.name;

        /*** Cloud Provider (AWS) */
        const provider = new AWS.AwsProvider( this, [ this.identifier, "AWS-Provider" ].join( "-" ).toLowerCase(), {
            region: settings.region
        } );

        /*** Unique S3 Bucket Containing Lambda Artifact(s) */
        const bucket = new AWS.s3.S3Bucket( this, [ this.identifier, "S3-Bucket" ].join( "-" ).toLowerCase(), {
            bucket: settings.bucket
        } );

        /*** Logging Group */
        const group = new AWS.cloudwatch.CloudwatchLogGroup( this,
            [ this.identifier, "Log-Group" ].join( "-" ).toLowerCase(),
            {
                name: [ this.identifier, "Log-Group" ].join( "-" )
            } );

        /*** Logging Stream(s) */
        const stream = new AWS.cloudwatch.CloudwatchLogStream( this,
            [ this.identifier, "Log-Stream" ].join( "-" ).toLowerCase(),
            {
                name: [ this.identifier, "Log-Stream" ].join( "-" ), logGroupName: group.name
            } );

        /*** API Gateway */
        const api = new AWS.apigatewayv2.Apigatewayv2Api( this,
            [ this.identifier, "Gateway" ].join( "-" ).toLowerCase(),
            {
                name: [ this.identifier, settings.gateway ].join( "-" ),
                description: "API Gateway V2 Resource for" + " " + this.identifier,
                protocolType: "HTTP"
            } );

        /*** API Gateway-V2 Stage Configuration */
        const stage = new AWS.apigatewayv2.Apigatewayv2Stage( this,
            [ this.identifier, "Environment-Stage" ].join( "-" ).toLowerCase(),
            {
                apiId: api.id,
                name: settings.environment.toLowerCase(),
                autoDeploy: true,
                description: "Gateway-V2 Deployment Stage Environment"
                // accessLogSettings: SAM.generateAPIGatewayCloudWatchAccessLog(
                //     stream,
                //     JSON.stringify({
                //         "requestId": "$context.requestId",
                //         "ip": "$context.identity.sourceIp",
                //         "requestTime": "$context.requestTime",
                //         "httpMethod": "$context.httpMethod",
                //         "routeKey": "$context.routeKey",
                //         "status": "$context.status",
                //         "protocol": "$context.protocol",
                //         "responseLength": "$context.responseLength"
                //     }, null, 4)
                // ), description: "HTTP Gateway-V2 Route-Integration Deployment Stage Environment",
                // defaultRouteSettings: staging
            } );

        // const Lambdas: string[] = [];
        FS.readdirSync( Path.join( settings.distribution ), { withFileTypes: true } ).forEach( ($) => {
            /// Exclude Lambda Layer Library
            if ( $.name !== "library" && $.isDirectory() && $.name !== ".gen" && $.name !== "src" && $.name !== "node_modules" && $.name !== "cdktf.out" ) {
                const Function = new Lambda( $.name );
                const ID = normalize( this.prefix, Function.name );

                /*** Lambda Artifact(s) (Executable) */
                const asset = new TerraformAsset( this, [ ID, "Asset" ].join( "-" ).toLowerCase(), {
                    type: AssetType.ARCHIVE, path: Function.directory
                } );

                /// console.debug("[Debug] Target S3 Folder-Key" + ":", [ID, "Archive", [Function.version, "zip"].join(".")].join("-"));

                /*** Upload Lambda Artifact(s) --> S3 */
                const archive = new AWS.s3.S3BucketObject( this, [ ID, "Archive" ].join( "-" ).toLowerCase(), {
                    source: asset.path,
                    bucket: bucket.bucket,
                    key: [ ID, "Archive", [ Function.version, "zip" ].join( "." ) ].join( "-" )
                } );

                /*** Lambda Execution Role */
                const role = new AWS.iam.IamRole( this, [ ID, "Execution-Role" ].join( "-" ).toLowerCase(), {
                    name: [ ID, "Execution-Role" ].join( "-" ),
                    description: "Lambda Execution Role",
                    assumeRolePolicy: String( Function.policy ),
                    lifecycle: { createBeforeDestroy: false }
                } );

                /*** Lambda Layer (Dependencies) */
                const Layers: string[] = [];
                FS.readdirSync( Path.join( settings.distribution, "library" ), { withFileTypes: true } ).forEach( ($) => {
                    if ( $.isDirectory() ) {
                        const Name = normalize( this.identifier, $.name );
                        const Directory = Path.join( settings.distribution, "library" );

                        /*** Lambda-Layer Artifact(s) */
                        const asset = new TerraformAsset( this, [ Name, "Layer-Asset" ].join( "-" ).toLowerCase(), {
                            type: AssetType.ARCHIVE, path: Path.join( Directory, $.name )
                        } );

                        /*** Upload Lambda Artifact(s) --> S3 */
                        const archive = new AWS.s3.S3BucketObject( this,
                            [ Name, "Layer-Archive" ].join( "-" ).toLowerCase(),
                            {
                                source: asset.path,
                                bucket: bucket.bucket,
                                key: [ Name, "Layer-Archive.zip" ].join( "-" )
                            } );

                        /*** Upload Lambda-Layer Artifact(s) --> S3 */
                        const layer = new AWS.lambdafunction.LambdaLayerVersion( this,
                            [ Name, "Layer" ].join( "-" ).toLowerCase(),
                            {
                                layerName: Name, description: "...", s3Bucket: bucket.bucket, s3Key: archive.key
                            } );

                        Layers.push( layer.arn );
                    }
                } );

                /*** Lambda Function */
                const lambda = new AWS.lambdafunction.LambdaFunction( this, ID.toLowerCase(), {
                    functionName: [ ID, "Lambda" ].join( "-" ),
                    handler: Function.handler,
                    runtime: Function.runtime,
                    /// environment: {
                    ///     variables: { Object. ... Dot.parse(Path.join(Process.cwd(), ".env"), ... {  } }
                    /// },
                    s3Bucket: bucket.bucket,
                    s3Key: archive.key,
                    layers: Layers,
                    role: role.arn
                } );

                /*** Inline API Gateway ==> Lambda Invocation */
                const invocation = new AWS.lambdafunction.LambdaPermission( this,
                    [ ID, "Gateway-Invoke-Permission" ].join( "-" ).toLowerCase(),
                    {
                        functionName: lambda.functionName,
                        action: "lambda:InvokeFunction",
                        principal: "apigateway.amazonaws.com",
                        sourceArn: [ api.executionArn, "*", "*" ].join( "/" )
                    } );

                /*** Managed Policy Permitting Lambda Write Access to CloudWatch */
                const policy = new AWS.iam.IamRolePolicyAttachment( this,
                    [ ID, "Execution-Role-Managed-Policy" ].join( "-" ).toLowerCase(),
                    {
                        policyArn: Lambda.Attachment, role: role.name
                    } );

                /***
                 * API Gateway-V2 Integration Resource
                 * ===================================
                 * Overview
                 * --------
                 * The following list summarizes the supported integration types:
                 *      - AWS: This type of integration lets an API expose AWS service actions. In AWS integration, you must configure both the integration request and integration response and set up necessary data mappings from the method
                 * request to the integration request, and from the integration response to the method response.
                 *      - AWS_PROXY: This type of integration lets an API method be integrated with the Lambda function invocation action with a flexible, versatile, and streamlined integration setup. This integration relies on direct
                 * interactions between the client and the integrated Lambda function.
                 *           - With this type of integration, also known as the Lambda proxy integration, you do not set the integration request or the integration response. API Gateway passes the incoming request from the client as the
                 * input to the backend Lambda function. The integrated Lambda function takes the input of this format and parses the input from all available sources, including request headers, URL path variables, query string parameters,
                 * and applicable body. The function returns the result following this output format.
                 *           - This is the preferred integration type to call a Lambda function through API Gateway and is not applicable to any other AWS service actions, including Lambda actions other than the function-invoking action.
                 *      - HTTP: This type of integration lets an API expose HTTP endpoints in the backend. With the HTTP integration, also known as the HTTP custom integration, you must configure both the integration request and
                 * integration response. You must set up necessary data mappings from the method request to the integration request, and from the integration response to the method response.
                 *      - HTTP_PROXY: The HTTP proxy integration allows a client to access the backend HTTP endpoints with a streamlined integration setup on single API method. You do not set the integration request or the integration
                 * response. API Gateway passes the incoming request from the client to the HTTP endpoint and passes the outgoing response from the HTTP endpoint to the client.
                 *      - MOCK: This type of integration lets API Gateway return a response without sending the request further to the backend. This is useful for API testing because it can be used to test the integration set up without
                 * incurring charges for using the backend and to enable collaborative development of an API.
                 *           - In collaborative development, a team can isolate their development effort by setting up simulations of API components owned by other teams by using the MOCK integrations. It is also used to return
                 * CORS-related headers to ensure that the API method permits CORS access. In fact, the API Gateway console integrates the OPTIONS method to support CORS with a mock integration. Gateway responses are other examples of mock
                 * integrations.
                 *
                 * - passthroughBehavior: "WHEN_NO_MATCH" (Websocket APIs Only)
                 */

                const integration = new AWS.apigatewayv2.Apigatewayv2Integration( this,
                    [ ID, "Gateway-Integration" ].join( "-" ).toLowerCase(),
                    {
                        apiId: api.id,
                        integrationType: "AWS_PROXY",
                        connectionType: "INTERNET",
                        description: [ ID, "Gateway-Integration" ].join( " " ),
                        payloadFormatVersion: "1.0",
                        integrationUri: lambda.arn
                    } );

                const route = new AWS.apigatewayv2.Apigatewayv2Route( this,
                    [ ID, "Gateway-Route" ].join( "-" ).toLowerCase(),
                    {
                        apiId: api.id,
                        target: [ "integrations", integration.id ].join( "/" ),
                        routeKey: "GET" + " " + "/" + Function.name.toLowerCase(),
                        dependsOn: [ integration ]
                    } );
            }
        } );

        /*** URI to API-Gateway-Lambda Invocation URL */
        new TerraformOutput( this, "url", {
            value: api.apiEndpoint.trim() + "\n"
        } );
    }
}

const Deployment = () => {
    console.debug("...")
    const Application = new App( {
        skipValidation: false, stackTraces: true
    } );

    return new Promise( (resolve) => {
        const Stack = new SAM();

        new Service( Application, Stack );

        const Synthesize = () => {
            Application.synth();

            return true;
        };

        resolve( Synthesize() );
    } );
};

const Metadata = {
    Package: Object.create(null)
};

try { Metadata.Package = (
    await import("./../library/types/module.js")
).Locality.initialize( import.meta.url ); }

catch (e) { Metadata.Package = await Deployment(); }

export { Metadata };

export default Metadata.Package;
