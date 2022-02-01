output "account-identity-alias" {
    value = module.account.aws-account-alias
}

output "account-identity-arn" {
    value = module.account.caller-identity-arn
}

output "account-identity-id" {
    value = module.account.caller-identity-account-id
}

output "account-identity-password-policy" {
    value = module.account.iam-account-password-policy
}

output "account-identity-password-policy-expire-passwords" {
    value = module.account.iam-account-password-policy-expire-passwords
}

output "account-identity-user-id" {
    value = module.account.caller-identity-user-id
}

