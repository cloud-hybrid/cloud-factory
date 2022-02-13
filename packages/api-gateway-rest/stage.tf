resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.api-gateway.id

    triggers = {
        redeployment = sha1(timestamp())
    }

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_api_gateway_stage" "stage" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id   = aws_api_gateway_rest_api.api-gateway.id
    stage_name    = "qa"
}

output "staging" {
    value = aws_api_gateway_stage.stage
}