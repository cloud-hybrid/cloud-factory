provider "aws" {
    region = "us-east-2"
}

resource "aws_api_gateway_rest_api" "service" {
    name                         = "Capstone-QA-Book-Content-Service-API-Gateway"
    api_key_source               = "HEADER"
    description                  = "Book Content Utilities Service API Gateway"
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

resource "aws_api_gateway_resource" "service-api-v1-book-series" {
    rest_api_id = aws_api_gateway_rest_api.service.id
    parent_id   = aws_api_gateway_resource.service-api-v1.id
    path_part   = "bookseries"
}

resource "aws_api_gateway_method" "service-api-v1-book-series-post" {
    rest_api_id   = aws_api_gateway_rest_api.service.id
    resource_id   = aws_api_gateway_resource.service-api-v1-book-series.id
    authorization = "NONE"
    http_method   = "POST"

    // cache_key_parameters = [ "method.request.path.param" ]
    // cache_namespace      = "foobar"
    // timeout_milliseconds = 29000 // -1000ms for Lambda Response Default Timeout

}

resource "aws_api_gateway_method" "service-api-v1-book-series-options" {
    rest_api_id   = aws_api_gateway_rest_api.service.id
    resource_id   = aws_api_gateway_resource.service-api-v1-book-series.id
    authorization = "NONE"
    http_method   = "OPTIONS"
}

resource "aws_api_gateway_integration" "service-api-v1-book-series-integration" {
    http_method = aws_api_gateway_method.service-api-v1-book-series-post.http_method
    resource_id = aws_api_gateway_resource.service-api-v1-book-series.id
    rest_api_id = aws_api_gateway_rest_api.service.id

    type = "AWS_PROXY"

    request_parameters = {
        "integration.request.header.Access-Control-Allow-Headers" = "'*'"
        "integration.request.header.Access-Control-Allow-Methods" = "'*'"
        "integration.request.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

resource "aws_lambda_permission" "apigw_lambda" {
    statement_id  = "AllowExecutionFromAPIGateway"
    action        = "lambda:InvokeFunction"
    function_name = data.aws_lambda_function.lambda.function_name
    principal     = "apigateway.amazonaws.com"

    # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
    # arn:aws:lambda:us-east-2:700423713782:function:post_book_series_metadata_qa
    # source_arn = "arn:aws:execute-api:us-east-2:700423713782:${aws_api_gateway_rest_api.service.id}/*/${aws_api_gateway_method.service-api-v1-book-series-post.http_method}${aws_api_gateway_resource.service-api-v1-book-series.path}"
}

data "aws_lambda_function" "lambda" {
    function_name = "post_book_series_metadata_qa"
}

# IAM
resource "aws_iam_role" "role" {
    name = "sts-lambda-policy"

    assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_api_gateway_integration" "service-api-v1-book-series-preflight-integration" {
    http_method = aws_api_gateway_method.service-api-v1-book-series-post.http_method
    resource_id = aws_api_gateway_resource.service-api-v1-book-series.id
    rest_api_id = aws_api_gateway_rest_api.service.id
    type        = "MOCK"

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
            aws_api_gateway_resource.service-api-v1-book-series.id,

            aws_api_gateway_integration.service-api-v1-book-series-integration,
            aws_api_gateway_integration.service-api-v1-book-series-preflight-integration
        ]))
    }

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_api_gateway_stage" "staging-area" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id   = aws_api_gateway_rest_api.service.id
    stage_name    = "qa"
}