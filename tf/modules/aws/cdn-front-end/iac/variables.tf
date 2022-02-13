variable "certificate" {
    description = "CDN's Source Certificate ARN"
    type        = string
}

variable "repository" {
    description = "GitHub Repository Name as Found in the URL"
    type = string
}

/// variable "project-id" {
///     description = "GitLab CI-CD Pipeline Project Identifier"
///     type = number
/// }

variable "github-organization" {
    description = "GitHub Organization Name"
    type = string
    default = "cloud-hybrid"
}

variable "branch" {
    description = "VCS Target Repository Branch or Revision"
    type = string
}

variable "organization" {
    description = "Organization Name or Business Unit"
    default     = "Cloud-Technology"
    type        = string
}

variable "environment" {
    description = "Target Cloud Environment"
    default     = "Development"
    type        = string
}

variable "profile" {
    description = "Target AWS Cloud Profile"
    default     = "default"
    type        = string
}

variable "region" {
    description = "Target Cloud Region"
    default     = "us-east-2"
    type        = string
}

variable "hosted-zone-fqdn" {
    description = "Hosted Zone Name"
    default     = "pebblego.com"
    type        = string
}

variable "hosted-zone-id" {
    description = "Hosted Zone ID"
    type        = string
    default     = "Z3HAEUAWJJTLQB"
}

variable "creator" {
    description = "Name (Human Identifiable)"
    type        = string
    default     = "Jacob B. Sanders"
}

variable "cloud" {
    description = "Cloud Provider"
    type        = string
    default     = "AWS"
}

variable "application" {
    description = "Encompassing Application Name"
    type        = string
    default     = "Pebble-Go"
}

variable "service" {
    description = "Service Name"
    type        = string
    default     = "Shell"
}

variable "subdomain" {
    description = "Ideally, the Service Name, but Service's Bottom-Level, Subdomain"
    type        = string
    default     = "shell"
}
