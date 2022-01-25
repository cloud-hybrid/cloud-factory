import { Fn, Resource } from "cdktf";
import { Construct } from "constructs";
import { cloudwatch, iam, lambdafunction, s3 } from "@cdktf/provider-aws";
import { DataArchiveFile, DataArchiveFileSource } from "@cdktf/provider-archive";

import * as Interface from "./interface";

type Type = typeof Interface.Module.Function.LambdaFunction;
type Policy = typeof Interface.Module.IAM.IamPolicy;

const DEFAULT_TIMEOUT = 5;
const DEFAULT_RETENTION = 14;

const Assume: Policy | JSON | string = JSON.stringify( {
    Version: "2012-10-17", Statement: [ {
        Action: "sts:AssumeRole",
        Principal: {
            Service: "lambda.amazonaws.com"
        },
        Effect: "Allow", Sid: ""
    } ]
}, null, 4 );

//private createLambdaAlarm(
//    lambda: ApplicationVersionedLambda,
//    config: {
//    metricName: string;
//    props: PocketVersionedLambdaDefaultAlarmProps;
//}
//): void {
//    const props = config.props;
//    const defaultEvaluationPeriods = 1;
//
//    new cloudwatch.CloudwatchMetricAlarm(
//        this,
//        config.metricName.toLowerCase(),
//        {
//            alarmName: `${this.config.name}-Lambda-${config.metricName}-Alarm`,
//            namespace: 'AWS/Lambda',
//            metricName: config.metricName,
//            dimensions: {
//                FunctionName: lambda.versionedLambda.functionName,
//                Resource: `${lambda.versionedLambda.functionName}:${lambda.versionedLambda.name}`,
//            },
//            period: props.period,
//            evaluationPeriods: props.evaluationPeriods ?? defaultEvaluationPeriods,
//            datapointsToAlarm: props.datapointsToAlarm ?? defaultEvaluationPeriods,
//            statistic: 'Sum',
//            comparisonOperator: props.comparisonOperator ?? 'GreaterThanThreshold',
//            threshold: props.threshold,
//            alarmDescription:
//                props.alarmDescription ??
//                `Total ${config.metricName.toLowerCase()} breaches threshold`,
//            insufficientDataActions: [],
//            alarmActions: props.actions ?? [],
//            okActions: props.actions ?? [],
//            tags: this.config.tags,
//            treatMissingData: props.treatMissingData ?? 'missing',
//        }
//    );

//export class Lambda extends Resource {
//    /*** Cloud Resource */
//    resource: Type;
//
//    /*** Lambda Function Configuration */
//    readonly settings: Interface.Configuration;
//
//    /***
//     *
//     * - Set Configuration Attribute
//     * - Update Provider Information
//     * - Create an S3-Bucket using Name Lambda-Name as Prefix
//     * - Initialize CW Log-Group
//     * - Initialize CW Stream
//     * - Initialize CW Alarm
//     * - Package Lambda into TF Asset (Asset)
//     * - Establish TF Asset Archive (Archive)
//     * - Create IAM Execution Role (Assume, STS)
//     * -
//     *
//     * @param {Construct} scope
//     * @param {string} name
//     *
//     * @param {Configuration} configuration
//     */
//    constructor(scope: Construct, name: string, configuration: Interface.Configuration) {
//        super( scope, name );
//
//        this.settings = configuration;
//        this.resource = this.create();
//    }
//
//    private create(): Type {
////        this.lambdaExecutionRole = new iam.IamRole( this, "execution-role", {
////            name: `${ this.config.name }-ExecutionRole`,
////            assumeRolePolicy: this.getLambdaAssumePolicyDocument()
////        } );
//
////        const executionPolicy = new iam.IamPolicy( this, "execution-policy", {
////            name: `${ this.config.name }-ExecutionRolePolicy`,
////            policy: this.getLambdaExecutionPolicyDocument()
////        } );
//
////        new iam.IamRolePolicyAttachment( this, "execution-role-policy-attachment", {
////            role: this.lambdaExecutionRole.name,
////            policyArn: executionPolicy.arn,
////            dependsOn: [ this.lambdaExecutionRole, executionPolicy ]
////        } );
//
//        const defaultLambda = this.getDefaultLambda();
//        const lambdaConfig: lambdafunction.LambdaFunctionConfig = {
//            functionName: `${ this.config.name }-Function`,
//            filename: defaultLambda.outputPath,
//            handler: this.config.handler,
//            runtime: this.config.runtime,
//            timeout: this.config.timeout ?? DEFAULT_TIMEOUT,
//            sourceCodeHash: defaultLambda.outputBase64Sha256,
//            role: this.lambdaExecutionRole.arn,
//            vpcConfig: this.config.vpcConfig,
//            publish: true,
//            lifecycle: {
//                ignoreChanges: [
//                    "filename",
//                    "source_code_hash",
//                    this.shouldIgnorePublish() ? "publish" : ""
//                ].filter( (v: string) => v )
//            },
//            tags: this.config.tags,
//            environment: this.config.environment
//                ? { variables: this.config.environment }
//                : undefined
//        };
//
//        const lambda = new lambdafunction.LambdaFunction(
//            this,
//            "lambda",
//            lambdaConfig
//        );
//
//        new cloudwatch.CloudwatchLogGroup( this, "log-group", {
//            name: `/aws/lambda/${ lambda.functionName }`,
//            retentionInDays: this.config.logRetention ?? DEFAULT_RETENTION,
//            dependsOn: [ lambda ]
//        } );
//
//        return new lambdafunction.LambdaAlias( this, "alias", {
//            functionName: lambda.functionName,
//            functionVersion: Fn.element( Fn.split( ":", lambda.qualifiedArn ), 7 ),
//            name: "DEPLOYED",
//            lifecycle: {
//                ignoreChanges: [ "function_version" ]
//            },
//            dependsOn: [ lambda ]
//        } );
//    }
//
//    private shouldIgnorePublish() {
//        if ( this.config.usesCodeDeploy !== undefined ) {
//            return this.config.usesCodeDeploy;
//        }
//
//        return false;
//    }
//
//    private getLambdaAssumePolicyDocument() {
//        return new iam.DataAwsIamPolicyDocument( this, "assume-policy-document", {
//            version: "2012-10-17",
//            statement: [
//                {
//                    effect: "Allow",
//                    actions: [ "sts:AssumeRole" ],
//                    principals: [
//                        {
//                            identifiers: [ "lambda.amazonaws.com", "edgelambda.amazonaws.com" ],
//                            type: "Service"
//                        }
//                    ]
//                }
//            ]
//        } ).json;
//    }
//
//    private getLambdaExecutionPolicyDocument() {
//        const document = {
//            version: "2012-10-17",
//            statement: [
//                {
//                    effect: "Allow",
//                    actions: [
//                        "logs:CreateLogGroup",
//                        "logs:CreateLogStream",
//                        "logs:PutLogEvents",
//                        "logs:DescribeLogStreams"
//                    ],
//                    resources: [ "arn:aws:logs:*:*:*" ]
//                },
//                ... (this.config.executionPolicyStatements ?? [])
//            ]
//        };
//
//        if ( this.config.vpcConfig ) {
//            document.statement.push( {
//                effect: "Allow",
//                actions: [
//                    "ec2:DescribeNetworkInterfaces",
//                    "ec2:CreateNetworkInterface",
//                    "ec2:DeleteNetworkInterface",
//                    "ec2:DescribeInstances",
//                    "ec2:AttachNetworkInterface"
//                ],
//                resources: [ "*" ]
//            } );
//        }
//
//        return new iam.DataAwsIamPolicyDocument(
//            this,
//            "execution-policy-document",
//            document
//        ).json;
//    }
//
//    private getDefaultLambda() {
//        const source = this.getDefaultLambdaSource();
//        return new DataArchiveFile( this, "lambda-default-file", {
//            type: "zip",
//            source: [ source ],
//            outputPath: `${ source.filename }.zip`
//        } );
//    }
//
//    private getDefaultLambdaSource(): DataArchiveFileSource {
//        const runtime = this.config.runtime.match( /[a-z]*/ )[0];
//        const handler = this.config.handler.split( "." );
//        const functionName = handler.pop();
//        const functionFilename = handler.join( "." );
//
//        let content = `exports.${ functionName } = (event, context) => { console.log(event) }`;
//        let filename = `${ functionFilename }.js`;
//
//        if ( runtime === "python" ) {
//            content = `import json\ndef ${ functionName }(event, context):\n\t print(event)\n\t return {'statusCode': 200, 'headers': {'dance': 'party'}, 'body': json.dumps({'electric': 'boogaloo'}), 'isBase64Encoded': False}`;
//            filename = `${ functionFilename }.py`;
//        }
//
//        return {
//            content,
//            filename
//        };
//    }
//
//    private createCodeBucket() {
//        const codeBucket = new s3.S3Bucket( this, "code-bucket", {
//            bucket: this.config.s3Bucket,
//            acl: "private",
//            tags: this.config.tags,
//            forceDestroy: true
//        } );
//
//        new s3.S3BucketPublicAccessBlock( this, `code-bucket-public-access-block`, {
//            bucket: codeBucket.id,
//            blockPublicAcls: true,
//            blockPublicPolicy: true
//        } );
//    }
//}

export {};