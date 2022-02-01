output "organization" {
    value       = data.aws_organizations_organization.organization
    description = "The Name of the AWS Organization"
}
