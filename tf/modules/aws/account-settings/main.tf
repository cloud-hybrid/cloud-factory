resource "aws_iam_account_alias" "account" {
    account_alias = lower(var.alias)
}

resource "aws_iam_account_password_policy" "account" {
    count = (var.password-policy) ? 1 : 0

    password_reuse_prevention      = (var.prevent-reuse) ? 1 : 0

    max_password_age               = var.max-age
    minimum_password_length        = var.minimum-length
    allow_users_to_change_password = var.allow-user-updates
    hard_expiry                    = var.expiration
    require_lowercase_characters   = var.lowercase
    require_uppercase_characters   = var.uppercase
    require_numbers                = var.numbers
    require_symbols                = var.special-characters
}