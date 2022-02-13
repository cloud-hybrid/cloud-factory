/// output "http-backend" {
///     sensitive = true
///     value = {
///         address : "https://${data.aws_ssm_parameter.http-backend-username.value}:${data.aws_ssm_parameter.http-backend-token.value}@${data.aws_ssm_parameter.http-backend-hostname.value}/${data.aws_ssm_parameter.http-backend-api.value}/${var.project-id}/${data.aws_ssm_parameter.http-backend-state-prefix.value}/Local"
///         lock_address : "https://${data.aws_ssm_parameter.http-backend-username.value}:${data.aws_ssm_parameter.http-backend-token.value}@${data.aws_ssm_parameter.http-backend-hostname.value}/${data.aws_ssm_parameter.http-backend-api.value}/${var.project-id}/${data.aws_ssm_parameter.http-backend-state-prefix.value}/Local/lock"
///         lock_method : "POST"
///         password : data.aws_ssm_parameter.http-backend-token.value
///         retry_max : null
///         retry_wait_max : null
///         retry_wait_min : 5
///         skip_cert_verification : null
///         unlock_address : "https://${data.aws_ssm_parameter.http-backend-username.value}:${data.aws_ssm_parameter.http-backend-token.value}@${data.aws_ssm_parameter.http-backend-hostname.value}/${data.aws_ssm_parameter.http-backend-api.value}/${var.project-id}/${data.aws_ssm_parameter.http-backend-state-prefix.value}/Local/lock"
///         unlock_method : "DELETE"
///         update_method : null
///         username : data.aws_ssm_parameter.http-backend-username.value
///     }
/// }