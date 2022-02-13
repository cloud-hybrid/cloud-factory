import Path from "path";

import { Construct } from "constructs";

import * as TF from "./terraform";
import { Policy } from "./iam";

interface Configuration {
    path: string,
    handler: string,
    runtime: string,
    stageName: string,
    version: string,
}

class Stack extends TF.CDK.TerraformStack {
    constructor(scope: Construct, name: string, configuration: Configuration) {
        super( scope, name );

        new TF.AWS.AwsProvider( this, "aws", {
            region: "us-east-2"
        } );

        new TF.Random.RandomProvider( this, "random" );

        // Create random value
        const pet = new TF.Random.Pet( this, "random-name", {
            length: 2
        } );

        /// ::: Create Lambda Executable, Distribution
        const asset = new TF.CDK.TerraformAsset( this, "lambda-asset", {
            path: Path.resolve( __dirname, configuration.path ),
            type: TF.CDK.AssetType.ARCHIVE // if left empty it infers directory and file
        } );

        // Create unique S3 bucket that hosts Lambda executable
        const bucket = new TF.AWS.s3.S3Bucket( this, "bucket", {
            bucketPrefix: `learn-cdktf-${ name }`
        } );

        // Upload Lambda zip file to newly created S3 bucket
        const lambdaArchive = new TF.AWS.s3.S3BucketObject( this, "lambda-archive", {
            bucket: bucket.bucket,
            key: `${ configuration.version }/${ asset.fileName }`,
            source: asset.path // returns a posix path
        } );

        // Create Lambda role
        const role = new TF.AWS.iam.IamRole( this, "lambda-exec", {
            name: `learn-cdktf-${ name }-${ pet.id }`,
            assumeRolePolicy: JSON.stringify( Policy )
        } );

        // Add execution role for lambda to write to CloudWatch logs
        new TF.AWS.iam.IamRolePolicyAttachment( this, "lambda-managed-policy", {
            policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
            role: role.name
        } );

        // Create Lambda function
        const lambdaFunc = new TF.AWS.lambdafunction.LambdaFunction( this, "learn-cdktf-lambda", {
            functionName: `learn-cdktf-${ name }-${ pet.id }`,
            s3Bucket: bucket.bucket,
            s3Key: lambdaArchive.key,
            handler: configuration.handler,
            runtime: configuration.runtime,
            role: role.arn
        } );

        // Create and configure API gateway
        const api = new TF.AWS.apigatewayv2.Apigatewayv2Api( this, "api-gw", {
            name: name,
            protocolType: "HTTP",
            target: lambdaFunc.arn
        } );

        new TF.AWS.lambdafunction.LambdaPermission( this, "apigw-lambda", {
            functionName: lambdaFunc.functionName,
            action: "lambda:InvokeFunction",
            principal: "apigateway.amazonaws.com",
            sourceArn: `${ api.executionArn }/*/*`
        } );

        new TF.CDK.TerraformOutput( this, "url", {
            value: api.apiEndpoint
        } );
    }
}

export { TF, Stack };
