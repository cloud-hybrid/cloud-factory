resource "aws_api_gateway_resource" "auth-resource" {
    rest_api_id = aws_api_gateway_rest_api.api-gateway.id
    parent_id = aws_api_gateway_rest_api.api-gateway.root_resource_id
    path_part = "auth"
}

resource "aws_api_gateway_resource" "auth-token-resource" {
    rest_api_id = aws_api_gateway_rest_api.api-gateway.id
    parent_id = aws_api_gateway_resource.auth-resource.id
    path_part = "token"
}

resource "aws_api_gateway_method" "auth-token-resource-method-post" {
    rest_api_id   = aws_api_gateway_rest_api.api-gateway.id
    resource_id   = aws_api_gateway_resource.auth-token-resource.id
    authorization = "NONE"
    http_method   = "POST"
}

resource "aws_api_gateway_method" "auth-token-resource-method-options" {
    rest_api_id   = aws_api_gateway_rest_api.api-gateway.id
    resource_id   = aws_api_gateway_resource.auth-token-resource.id
    authorization = "NONE"
    http_method   = "OPTIONS"
}

resource "aws_api_gateway_resource" "auth-cookie-resource" {
    rest_api_id = aws_api_gateway_rest_api.api-gateway.id
    parent_id   = aws_api_gateway_resource.auth-resource.id
    path_part   = "cookie"
}

resource "aws_api_gateway_method" "auth-cookie-resource-method-post" {
    rest_api_id   = aws_api_gateway_rest_api.api-gateway.id
    resource_id   = aws_api_gateway_resource.auth-token-resource.id
    authorization = "NONE"
    http_method   = "POST"
}

resource "aws_api_gateway_method" "auth-cookie-resource-method-options" {
    rest_api_id   = aws_api_gateway_rest_api.api-gateway.id
    resource_id   = aws_api_gateway_resource.auth-token-resource.id
    authorization = "NONE"
    http_method   = "POST"
}

output "auth-resource-output" {
    value = aws_api_gateway_resource.auth-resource
}

output "auth-token-resource-output" {
    value = aws_api_gateway_resource.auth-token-resource
}

output "auth-token-resource-method-post-output" {
    value = aws_api_gateway_method.auth-token-resource-method-post
}

output "auth-token-resource-method-options-output" {
    value = aws_api_gateway_method.auth-token-resource-method-options
}

output "auth-cookie-resource-method-post-output" {
    value = aws_api_gateway_method.auth-cookie-resource-method-post
}

output "auth-cookie-resource-method-options-output" {
    value = aws_api_gateway_method.auth-cookie-resource-method-options
}
