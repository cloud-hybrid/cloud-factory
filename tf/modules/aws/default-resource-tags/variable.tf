variable "tf" {
    type        = bool
    description = "Terraform Management Tag Indicator"
    default     = true
}

variable "cfn" {
    type        = bool
    description = "CFN Management or Inclusion (via TF) Tag Indicator"
    default     = false
}

variable "cloud" {
    type        = string
    description = "Target Cloud Provider"
    default     = "AWS"
}

variable "region" {
    type        = string
    description = "Cloud Provider Deployment Target Region"
    default     = "us-east-2"
}

variable "creator" {
    type        = string
    description = "IaC Initiator (Human Identifiable Name)"
    default     = "Jacob B. Sanders"
}

variable "service" {
    type        = string
    description = "IaC Target Service"
}

variable "environment" {
    type        = string
    description = "Target Deployment Environment"
    default     = "Development"
    validation {
        condition = (var.environment == "Development") || (var.environment == "QA") || (var.environment == "Staging") || (var.environment == "UAT") || (var.environment == "Production")

        error_message = "Environment != Development | QA | Staging | UAT | Production. Was another name used?"
    }
}

variable "organization" {
    type        = string
    description = "Organizational Alias, Contractor, or Business Unit"
    default     = "Cloud Technology"
}

