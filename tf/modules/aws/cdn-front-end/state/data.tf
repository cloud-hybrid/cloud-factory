/// data "aws_ssm_parameter" "http-backend-username" {
///     name = "/${var.organization}/Global/IaC/Remote-State/Username"
///     with_decryption = true
/// }

/// data "aws_ssm_parameter" "http-backend-token" {
///     name = "/${var.organization}/Global/IaC/Remote-State/Token"
///     with_decryption = true
/// }

/// data "aws_ssm_parameter" "http-backend-hostname" {
///     name = "/${var.organization}/Global/IaC/Remote-State/Hostname"
///     with_decryption = true
/// }

/// data "aws_ssm_parameter" "http-backend-api" {
///     name            = "/${var.organization}/Global/IaC/Remote-State/Partial-API-URI"
///     with_decryption = true
/// }

/// data "aws_ssm_parameter" "http-backend-state-prefix" {
///     name            = "/${var.organization}/Global/IaC/Remote-State/State-Prefix"
///     with_decryption = true
/// }
