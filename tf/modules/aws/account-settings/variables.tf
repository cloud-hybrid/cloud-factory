variable "identity" {
    description = "Whether to get AWS account ID, User ID, and ARN in which Terraform is Authorized"
    type        = bool
    default     = true
}

variable "alias" {
    description = "AWS IAM Account Alias for Account"
    type        = string
    default     = "Cloud-Technology"
}

variable "password-policy" {
    description = "Enforce Account-Wide Password Policy"
    type        = bool
    default     = true
}

variable "max-age" {
    description = "Max-Password Age - 0 Disables Max-Password Age"
    type        = number
    default     = 0
}

variable "minimum-length" {
    description = "Minimum Password Length - 0 Disables Minimum Length"
    type        = number
    default     = 8
}

variable "allow-user-updates" {
    description = "Allow User Password Change(s)"
    type        = bool
    default     = true
}

variable "expiration" {
    description = "Enforce Password Expiration"
    type        = bool
    default     = false
}

variable "prevent-reuse" {
    description = "Enforce Password Reuse Prevention"
    type        = bool
    default     = true
}

variable "lowercase" {
    description = "Enforce Lowercase Letter(s) in Password Policy"
    type        = bool
    default     = true
}

variable "uppercase" {
    description = "Enforce Uppercase Letter(s) in Password Policy"
    type        = bool
    default     = true
}

variable "numbers" {
    description = "Enforce Number(s) in Password Policy"
    type        = bool
    default     = true
}

variable "special-characters" {
    description = "Enforce Special Character(s) in Password Policy"
    type        = bool
    default     = true
}
