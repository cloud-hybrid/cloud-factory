/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     ESM Exportable Module
 *
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Assertion from "assert";

import { Construct as Constructor } from "constructs";
import FS from "fs";
import Module from "module";
import Path from "path";
import Provider from "../provider.js";

import TF from "../stack.js";

import Lambda from "./function.js";

import IAM from "./iam.js";
import { AWS } from "./provider";

/*** ESM Resolver for *Current-Working-Directory* */
const CWD: string = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

/*** ESM Resolver for Package Directory relative to Current Working Directory */
const PKG: string = Path.dirname( CWD );

/*** ESM Resolver for Source Directory relative to the Current Working Directory */
const Source: string = Path.dirname( PKG );

/*** ESM Resolver for Schemas Directory relative to the Current Working Directory */
const Schemas: string = Path.dirname( Source );

/*** ESM Compatability & JSON Importer */
const Import: NodeRequire = Module.createRequire( import.meta.url );

/// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- /// --- --- --- ///

/***
 * Parent Directory Name Resolver
 * ------------------------------
 *
 * @param path {String|FS.PathLike} Directory or File System Path
 *
 * @constructor
 *
 */

const Parent = (path: string) => {
    const Resolved = Path.dirname( path );
    return {
        ... Path.parse( Resolved ), ... {
            $: FS.readdirSync( Resolved, { withFileTypes: true } )
        }
    };
};

/*** Expected: ~ factory/cdfk */
const directory: string = Parent( CWD ).dir;

/*** Expected: ~ factory */
const Package = Parent( directory );
Assertion.strictEqual( Package.name, "factory" );

/*** Expected: "packages" Directory in Package Folder */
const Descriptors = Package.$.map( ($) => $.name );
Assertion.strictEqual( Descriptors.includes( "packages" ), true );

/*** Expected: "packages" Directory */
const Packages = Path.join( Path.format( Package ), "packages" );
Assertion.strictEqual( FS.existsSync( Packages ), true );

/***
 * Lambda Packaging Construct
 * --------------------------
 * The minimal following folder structure is a requirement to deploy a lambda:
 *
 * ```
 * factory
 *  └── packages
 *       ├── artifacts.json
 *       └── service
 *            └── lambda-(n + 1)
 *                 ├── package.json
 *                 └── src
 *                      └── index.js
 * ```
 *
 * Such requirements derive from the following assumptions:
 *      - A) **The lambda function is to be readily available over HTTP protocol**
 *          * At a minimum, a single API Gateway is required
 *      - B) **The lambda function is to be REST-compliant** (without state)
 *          * Any given lambda functions cannot require the state or source dependencies of another
 *      - C) **The lambda function is to be publicly accessible** (authentication being arbitrary)
 *          * Arguably an extension of point A
 *      - D) **The lambda function is to be deployable as *apart of a larger service, or individually***
 *          * Development lifecycles see benefit in this flexibility; deployment runtimes can easily
 *            and expectedly clone in any given repository into a target directory
 *
 * Where `artifacts.json` defines the folder structure and runtime requirements in order for pipelines
 * to compile such compatible folder structure(s). Objectively, it can be assumed that such information that
 * gets written into `artifacts.json` is provided by either package maintainers or a development team(s).
 *
 */

type API = Provider.apigatewayv2.Apigatewayv2Api;

class Construct extends Lambda {
    name: string;

    description: string;

    uri: string;

    api?: API;

    constructor(scope: Constructor, id: string, name: string, description: string, uri: string, gateway: API) {
        super( scope, id, name, description, uri );

        this.name = name;
        this.description = description;
        this.uri = uri;

        this.api = gateway;

        /*** Cloud Provider (AWS) */
        const provider = new AWS.AwsProvider( this, [ this.name, "Provider" ].join( "-" ).toLowerCase(), {
            region: "us-east-2"
        } );

        /*** AWS S3 Artifact */
        const bucket = new Provider.s3.S3Bucket( this, [ this.name, "Bucket" ].join( "-" ).toLowerCase(), {
            bucket: [ this.name, "Artifact-Storage" ].join( "-" ).toLowerCase(),
            versioning: { enabled: true, mfaDelete: false },
            forceDestroy: true,
            tags: {
                ... this.tags, ... {
                    Name: [ this.name, "Artifact-Storage" ].join( "-" )
                }
            }
        } );

        /*** Lambda Artifact(s) (Executable) */
        const asset = new TF.Asset( [ this.name, "Asset" ].join( "-" ).toLowerCase(), this, {
            type: TF.Asset.Type.Archive, path: this.uri
        } );

        /*** Upload Lambda Artifact(s) --> S3 */
        const archive = new Provider.s3.S3BucketObject( this, [ this.name, "Archive" ].join( "-" ).toLowerCase(), {
            source: asset.path, bucket: bucket.bucket, key: [ this.name, asset.fileName ].join( "/" ), tags: {
                ... this.tags, ... {
                    Name: [ this.name, "Archive" ].join( "-" )
                }
            }
        } );

        /*** Lambda Execution Role */
        const role = new Provider.iam.IamRole( this, [ this.name, "Execution-Role" ].join( "-" ).toLowerCase(), {
            name: [ this.name, "Execution-Role" ].join( "-" ), assumeRolePolicy: IAM.sts, lifecycle: {
                createBeforeDestroy: false
            }, tags: {
                ... this.tags, ... {
                    Name: [ this.name, "IAM-Execution-Role" ].join( "-" )
                }
            }
        } );

        /*** Lambda Function */
        const lambda = new Provider.lambdafunction.LambdaFunction( this, this.name.toLowerCase(), {
            functionName: this.name,
            handler: this.handler,
            runtime: this.runtime,
            memorySize: this.memory,
            timeout: this.timeout,
            environment: this.environment,
            packageType: this.type,
            s3Bucket: bucket.bucket,
            s3Key: archive.key,
            role: role.arn,
            tags: {
                ... this.tags, ... {
                    Name: [ this.name, "Lambda-Function" ].join( "-" )
                }
            }
        } );

        /*** Inline API Gateway ==> Lambda Invocation */
        const invocation = new Provider.lambdafunction.LambdaPermission( this,
            [ this.name, "Gateway-Invoke-Permission" ].join( "-" ).toLowerCase(),
            {
                functionName: lambda.functionName,
                action: "lambda:InvokeFunction",
                principal: "apigateway.amazonaws.com",
                sourceArn: [ this.api.executionArn, "*", "*" ].join( "/" )
            } );

        /*** Managed Policy Permitting Lambda Write Access to CloudWatch */
        const policy = new Provider.iam.IamRolePolicyAttachment( this,
            [ this.name, "Managed-Policy" ].join( "-" ).toLowerCase(),
            {
                policyArn: IAM.managed, role: role.name
            } );

        /***
         * API Gateway-V2 Integration Resource
         * ===================================
         * Overview
         * --------
         * The following list summarizes the supported integration types:
         *      - AWS: This type of integration lets an API expose AWS service actions. In AWS integration, you must configure both the integration request and integration response and set up necessary data mappings from the method request
         * to the integration request, and from the integration response to the method response.
         *      - AWS_PROXY: This type of integration lets an API method be integrated with the Lambda function invocation action with a flexible, versatile, and streamlined integration setup. This integration relies on direct interactions
         * between the client and the integrated Lambda function.
         *           - With this type of integration, also known as the Lambda proxy integration, you do not set the integration request or the integration response. API Gateway passes the incoming request from the client as the input to
         * the backend Lambda function. The integrated Lambda function takes the input of this format and parses the input from all available sources, including request headers, URL path variables, query string parameters, and applicable
         * body. The function returns the result following this output format.
         *           - This is the preferred integration type to call a Lambda function through API Gateway and is not applicable to any other AWS service actions, including Lambda actions other than the function-invoking action.
         *      - HTTP: This type of integration lets an API expose HTTP endpoints in the backend. With the HTTP integration, also known as the HTTP custom integration, you must configure both the integration request and integration
         * response. You must set up necessary data mappings from the method request to the integration request, and from the integration response to the method response.
         *      - HTTP_PROXY: The HTTP proxy integration allows a client to access the backend HTTP endpoints with a streamlined integration setup on single API method. You do not set the integration request or the integration response.
         * API Gateway passes the incoming request from the client to the HTTP endpoint and passes the outgoing response from the HTTP endpoint to the client.
         *      - MOCK: This type of integration lets API Gateway return a response without sending the request further to the backend. This is useful for API testing because it can be used to test the integration set up without incurring
         * charges for using the backend and to enable collaborative development of an API.
         *           - In collaborative development, a team can isolate their development effort by setting up simulations of API components owned by other teams by using the MOCK integrations. It is also used to return CORS-related
         * headers to ensure that the API method permits CORS access. In fact, the API Gateway console integrates the OPTIONS method to support CORS with a mock integration. Gateway responses are other examples of mock integrations.
         *
         * - passthroughBehavior: "WHEN_NO_MATCH" (Websocket APIs Only)
         */

        const integration = new Provider.apigatewayv2.Apigatewayv2Integration( this,
            [ this.name, "Gateway-Integration" ].join( "-" ).toLowerCase(),
            {
                apiId: this.api.id,
                integrationType: "AWS_PROXY",
                connectionType: "INTERNET",
                description: [ this.name, "Gateway-Integration" ].join( " " ),
                integrationUri: lambda.arn
            } );

        const route = new Provider.apigatewayv2.Apigatewayv2Route( this,
            [ this.name, "Gateway-Route" ].join( "-" ).toLowerCase(),
            {
                apiId: this.api.id,
                target: [ "integrations", integration.id ].join( "/" ),
                routeKey: "ANY" + " " + "/" + this.name.toLowerCase(),
                dependsOn: [ integration ]
            } );
    }

    // private static includes(name: string) {
    //     return FS.readdirSync(Construct.packages, {withFileTypes: false})
    //         .map((descriptor) => descriptor).includes(name);
    // }
}

/// Transform Class Types into Functional Compositions
const Implementation: typeof Construct = new Proxy( Construct, {
    apply(target: Construct | any, parameters: any[]) {
        return target( ... parameters );
    }
} );

interface Implementation extends Construct {
}

const Interface: (scope: Constructor,
    id: string,
    name: string,
    description: string,
    uri: string,
    gateway: API) => Implementation = (scope, id, name, description, uri, gateway) => {
    return new Implementation( scope, id, name, description, uri, gateway );
};

export default Interface;

