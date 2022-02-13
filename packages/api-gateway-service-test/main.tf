terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 3.74.1"
        }

        archive = {
            source  = "hashicorp/archive"
            version = "~> 2.2.0"
        }
    }

    required_version = "~> 1.0"
}

provider "aws" {
    region = var.region
}

resource "aws_s3_bucket" "lambda-bucket" {
    bucket        = lower("Capstone-Development-Arbitrary-Service-API-Gateway")
    acl           = "private"
    force_destroy = true
}

resource "aws_api_gateway_rest_api" "service" {
    name                         = "Capstone-Development-Arbitrary-Service-API-Gateway"
    api_key_source               = "HEADER"
    description                  = "[Insert Description Here]"
    disable_execute_api_endpoint = false
    endpoint_configuration {
        types = [ "REGIONAL" ]
    }
    minimum_compression_size = -1
}

resource "aws_api_gateway_resource" "service-api" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    parent_id   = aws_api_gateway_rest_api.service.root_resource_id
    path_part   = "api"
}

resource "aws_api_gateway_resource" "service-api-v1" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    parent_id   = aws_api_gateway_resource.service-api.id
    path_part   = "v1"
}

resource "aws_api_gateway_resource" "service-api-v1-endpoint" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    parent_id   = aws_api_gateway_resource.service-api-v1.id
    path_part   = "endpoint"
}

resource "aws_api_gateway_method" "service-api-v1-endpoint-post" {
    rest_api_id   = aws_api_gateway_rest_api.service.id
    resource_id   = aws_api_gateway_resource.service-api-v1-endpoint.id
    authorization = "NONE"
    http_method   = "POST"
}

resource "aws_api_gateway_method" "service-api-v1-endpoint-options" {
    rest_api_id   = aws_api_gateway_rest_api.service.id
    resource_id   = aws_api_gateway_resource.service-api-v1-endpoint.id
    authorization = "NONE"
    http_method   = "OPTIONS"
}

resource "aws_api_gateway_integration" "service-api-v1-endpoint-integration" {
    resource_id = aws_api_gateway_resource.service-api-v1-endpoint.id
    rest_api_id = aws_api_gateway_rest_api.service.id

    type = "AWS_PROXY"

    http_method             = "POST"
    integration_http_method = "POST"

    uri = aws_lambda_function.function.invoke_arn

    request_parameters = {
        "integration.request.header.Access-Control-Allow-Headers" = "'*'"
        "integration.request.header.Access-Control-Allow-Methods" = "'*'"
        "integration.request.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

resource "aws_api_gateway_integration" "service-api-v1-endpoint-preflight-integration" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    resource_id = aws_api_gateway_resource.service-api-v1-endpoint.id
    http_method = aws_api_gateway_method.service-api-v1-endpoint-options.http_method
    passthrough_behavior = "WHEN_NO_MATCH"
    type        = "MOCK"
}

resource "aws_api_gateway_integration_response" "service-api-v1-endpoint-integration-response" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    resource_id = aws_api_gateway_resource.service-api-v1-endpoint.id
    http_method = aws_api_gateway_method.service-api-v1-endpoint-post.http_method
    status_code = aws_api_gateway_method_response.service-api-v1-endpoint-preflight-response.status_code

    # Transforms the Backend JSON Response
    response_templates = {
        "application/json" = "{}"
    }
}

resource "aws_api_gateway_method_response" "service-api-v1-endpoint-preflight-response" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    resource_id = aws_api_gateway_integration.service-api-v1-endpoint-preflight-integration.id
    http_method = aws_api_gateway_integration.service-api-v1-endpoint-preflight-integration.http_method
    status_code = "200"
}

resource "aws_api_gateway_integration_response" "service-api-v1-endpoint-preflight-integration-response" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    resource_id = aws_api_gateway_resource.service-api-v1-endpoint.id
    http_method = aws_api_gateway_method.service-api-v1-endpoint-options.http_method
    status_code = aws_api_gateway_method_response.service-api-v1-endpoint-preflight-response.status_code

    # Transforms the backend JSON response
    response_templates = {
        "application/json" = "{}"
    }
}

resource "aws_lambda_permission" "apigw_lambda" {
    statement_id  = "AllowExecutionFromAPIGateway"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.function.function_name
    principal     = "apigateway.amazonaws.com"

    source_arn = "arn:${data.aws_partition.current.partition}:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.service.id}/*/${aws_api_gateway_method.service-api-v1-endpoint-post.http_method}${aws_api_gateway_resource.service-api-v1-endpoint.path}"
}

resource "aws_api_gateway_integration" "service-api-v1-preflight-integration" {
    http_method = aws_api_gateway_method.service-api-v1-endpoint-options.http_method
    resource_id = aws_api_gateway_resource.service-api-v1-endpoint.id
    rest_api_id = aws_api_gateway_rest_api.service.id

    type = "MOCK"

    request_parameters = {
        "integration.request.header.Access-Control-Allow-Headers" = "'*'"
        "integration.request.header.Access-Control-Allow-Methods" = "'*'"
        "integration.request.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.service.id

    triggers = {
        # NOTE: The configuration below will satisfy ordering considerations,
        #       but not pick up all future REST API changes. More advanced patterns
        #       are possible, such as using the filesha1() function against the
        #       Terraform configuration file(s) or removing the .id references to
        #       calculate a hash against whole resources. Be aware that using whole
        #       resources will show a difference after the initial implementation.
        #       It will stabilize to only change when resources change afterwards.
        redeployment = sha1(jsonencode([
            aws_api_gateway_resource.service-api.id,
            aws_api_gateway_resource.service-api-v1.id,
            aws_api_gateway_resource.service-api-v1-endpoint.id,

            aws_api_gateway_integration.service-api-v1-endpoint-integration,
            aws_api_gateway_integration.service-api-v1-preflight-integration
        ]))
    }

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_api_gateway_stage" "staging-area" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id   = aws_api_gateway_rest_api.service.id
    stage_name    = "development"
}

data "archive_file" "archive" {
    type = "zip"

    source_dir  = "${path.module}/function-poc/src"
    output_path = "${path.module}/function-poc.zip"
}

data "archive_file" "archive-layer" {
    type        = "zip"
    depends_on  = [ null_resource.build ]
    source_dir  = join("/", [ path.cwd, "function-poc", "@dependencies" ])
    output_path = "Layer.zip"
}

resource "aws_lambda_layer_version" "lambda-layer" {
    depends_on = [ data.archive_file.archive-layer ]
    filename   = data.archive_file.archive-layer.output_path
    layer_name = "lambda-layer"

    compatible_runtimes = [ "nodejs14.x" ]
}

resource "aws_s3_bucket_object" "lambda-archive" {
    bucket = aws_s3_bucket.lambda-bucket.bucket

    key    = "archive.zip"
    source = data.archive_file.archive.output_path

    etag = filemd5(data.archive_file.archive.output_path)
}

resource "aws_lambda_function" "function" {
    function_name = "lambda-function-name"

    s3_bucket = aws_s3_bucket.lambda-bucket.id
    s3_key    = aws_s3_bucket_object.lambda-archive.key

    runtime       = "nodejs14.x"
    handler       = "index.handler"
    architectures = [ "x86_64" ]
    layers        = [ aws_lambda_layer_version.lambda-layer.arn ]

    source_code_hash = data.archive_file.archive.output_base64sha256

    role = aws_iam_role.api-execution-role.arn
}

resource "aws_cloudwatch_log_group" "log-group" {
    name = "/aws/lambda/${aws_lambda_function.function.function_name}"

    retention_in_days = 30
}

resource "aws_iam_role" "api-execution-role" {
    name = "capstone-development-arbitrary-service-api-execution-role"

    // managed_policy_arns = [
    //     "arn:aws:iam::aws:policy/service-role/AWSLambda_ReadOnlyAccess",
    //     "arn:aws:iam::aws:policy/service-role/AWSXrayWriteOnlyAccess"
    // ]

    assume_role_policy = jsonencode({
        Version   = "2012-10-17"
        Statement = [
            {
                Action    = "sts:AssumeRole"
                Effect    = "Allow"
                Sid       = ""
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "lambda-execution-policy-attachment" {
    role       = aws_iam_role.api-execution-role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "null_resource" "install" {
    triggers = {
        Trigger = timestamp()
    }

    provisioner "local-exec" {
        working_dir = join("/", [ path.cwd, "function-poc" ])
        command     = "npm install . --production --omit-dev --no-funding"
    }
}

resource "null_resource" "build" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [ null_resource.install ]
    provisioner "local-exec" {
        working_dir = join("/", [ path.cwd, "function-poc" ])
        command     = "make build"
    }
}

