locals {
    cwd                   = path.cwd

    user                  = "git"
    source                = "Source"
    vcs                   = "github.com"

    name                  = "${var.organization}-${var.environment}-${var.application}-${var.service}"

    hosted-zone-domain    = var.hosted-zone-fqdn
    hosted-zone-id        = var.hosted-zone-id

    domain                = var.environment != "Production" ? lower("${var.subdomain}.${var.environment}.${var.hosted-zone-fqdn}") : lower("${var.subdomain}.${var.hosted-zone-fqdn}")

    datetime              = formatdate("YYYY-MM-DD", timestamp())
    normalization         = lower("${var.organization}-${var.environment}-${basename(abspath("."))}")
    env                   = join(".", [lower(var.environment), "env"])

    environment-subdomain = lower(var.environment)
}
