output "caller-identity-account-id" {
    description = "The AWS Account ID number of the Account that Owns or Contains the Invocation's Entity"
    value       = element(concat(data.aws_caller_identity.account.*.account_id, [""]), 0)
}

output "caller-identity-arn" {
    description = "The AWS ARN Associated with the Invocation's Entity"
    value       = element(concat(data.aws_caller_identity.account.*.arn, [""]), 0)
}

output "caller-identity-user-id" {
    description = "The Unique Identifier of the Invocation's Entity"
    value       = element(concat(data.aws_caller_identity.account.*.user_id, [""]), 0)
}

output "iam-account-password-policy-expire-passwords" {
    description = "Indicates Account-Wide Password Expiration Policy"
    value       = element(concat(aws_iam_account_password_policy.account.*.expire_passwords, [""]), 0)
}

output "iam-account-password-policy" {
    description = "AWS Account Password Policy"
    value = {
        max_password_age               = element(concat(aws_iam_account_password_policy.account.*.max_password_age, [""]), 0)
        minimum_password_length        = element(concat(aws_iam_account_password_policy.account.*.minimum_password_length, [""]), 0)
        allow_users_to_change_password = element(concat(aws_iam_account_password_policy.account.*.allow_users_to_change_password, [""]), 0)
        hard_expiry                    = element(concat(aws_iam_account_password_policy.account.*.hard_expiry, [""]), 0)
        password_reuse_prevention      = element(concat(aws_iam_account_password_policy.account.*.password_reuse_prevention, [""]), 0)
        require_lowercase_characters   = element(concat(aws_iam_account_password_policy.account.*.require_lowercase_characters, [""]), 0)
        require_uppercase_characters   = element(concat(aws_iam_account_password_policy.account.*.require_uppercase_characters, [""]), 0)
        require_numbers                = element(concat(aws_iam_account_password_policy.account.*.require_numbers, [""]), 0)
        require_symbols                = element(concat(aws_iam_account_password_policy.account.*.require_symbols, [""]), 0)
    }
}

output "aws-account-alias" {
    description = "AWS Account Login Alias"
    value = element(concat(aws_iam_account_alias.account.*.account_alias, [""]), 0)
}