resource "null_resource" "source" {
    triggers = {
        Trigger = timestamp()
    }

    provisioner "local-exec" {
        working_dir = path.cwd
        command     = "rm -rf ${local.cwd}/${local.source} && git clone --branch ${var.branch} ${local.user}@${local.vcs}:${var.github-organization}/${var.repository} ${local.cwd}/${local.source}"
    }
}

resource "null_resource" "install" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [null_resource.source]
    provisioner "local-exec" {
        working_dir = join("/", [path.cwd, local.source])
        command = "npm install . --production --omit-dev --no-funding"
    }
}

resource "null_resource" "configuration" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [null_resource.install]
    provisioner "local-exec" {
        working_dir = join("/", [path.cwd, local.source])
        command = "mkdir -p ./configuration"
    }
}

resource "null_resource" "environment-variables" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [null_resource.configuration]
    provisioner "local-exec" {
        working_dir = join("/", [path.cwd, local.source])
        command = "find . -type 'f' -name '*.env' -exec cp {} ./configuration \\;"
    }
}

resource "null_resource" "injection" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [null_resource.environment-variables]
    provisioner "local-exec" {
        working_dir = join("/", [path.cwd, local.source])
        command = "mv ./configuration/${local.env} .env"
    }
}

resource "null_resource" "build" {
    triggers = {
        Trigger = timestamp()
    }

    depends_on = [null_resource.install]
    provisioner "local-exec" {
        working_dir = join("/", [path.cwd, local.source])
        command = "npm run build"
    }
}

resource "aws_ssm_parameter" "hosted-zone-id" {
    name        = "/${var.organization}/${var.environment}/Global/Route-53/Hosted-Zone/${local.name}/ID"
    description = "Hosted-Zone-ID for ${local.name} (Managed via IO & Terraform)"
    value       = local.hosted-zone-id
    type        = "String"

    overwrite = true
}

resource "aws_ssm_parameter" "hosted-zone-name" {
    name        = "/${var.organization}/${var.environment}/Route-53/Hosted-Zone/${local.name}/Name"
    description = "Hosted-Zone-Name for ${local.name} (Managed via IO & Terraform)"
    value       = local.hosted-zone-domain
    type        = "String"

    overwrite = true
}

resource "aws_ssm_parameter" "hosted-zone-subdomain" {
    name        = "/${var.organization}/${var.environment}/Route-53/Hosted-Zone/${local.name}/Subdomain"
    description = "CDN Target Domain for ${local.name} (Managed via IO & Terraform)"
    value       = local.domain
    type        = "String"

    overwrite = true
}

resource "aws_ssm_parameter" "certificate-arn" {
    name        = "/${var.organization}/${var.environment}/Route-53/Hosted-Zone/${local.name}/Certificate-ARN"
    description = "ACM Certificate ARN for ${local.name} (Managed via IO & Terraform)"
    value       = var.certificate
    type        = "String"

    overwrite = true
}

resource "aws_s3_bucket" "logging-bucket" {
    bucket = "logging.${local.domain}"
    acl    = "log-delivery-write"

    force_destroy = false

    versioning {
        enabled = false
    }

    lifecycle_rule {
        id      = "${local.name}-Logging-Lifecycle-ID"
        enabled = true

        transition {
            storage_class = "INTELLIGENT_TIERING"
        }
    }
}

resource "aws_s3_bucket" "target-bucket" {
    bucket = local.domain

    force_destroy = false

    depends_on = [ aws_s3_bucket.logging-bucket ]

    grant {
        permissions = [ "FULL_CONTROL" ]
        type        = "CanonicalUser"
        id          = "d149861738b3b1911e98c75d02ce54fc7f0c1ae602e8c95f2af0dd60599f9091"
    }

    versioning {
        enabled = false
    }

    website {
        index_document = "index.html"
        error_document = "index.html"
    }

    lifecycle_rule {
        id      = "${local.name}-${var.environment}-Primary-Lifecycle-ID"
        enabled = false

        transition {
            storage_class = "INTELLIGENT_TIERING"
        }
    }

    logging {
        target_bucket = aws_s3_bucket.logging-bucket.bucket
        target_prefix = "Logging/Primary"
    }

    cors_rule {
        allowed_headers = [ "*" ]
        allowed_origins = [ "*" ]
        allowed_methods = [ "GET", "POST", "PUT" ]
        expose_headers  = [ ]
        max_age_seconds = 3000
    }
}

resource "aws_s3_bucket" "redirect-target-bucket" {
    bucket = "www.${local.domain}"

    force_destroy = false

    depends_on = [ aws_s3_bucket.logging-bucket, aws_s3_bucket.target-bucket ]

    versioning {
        enabled = false
    }

    website {
        redirect_all_requests_to = aws_s3_bucket.target-bucket.bucket
    }

    lifecycle_rule {
        id      = "${local.name}-${var.environment}-Redirect-Lifecycle-ID"
        enabled = false
    }

    logging {
        target_bucket = aws_s3_bucket.logging-bucket.bucket
        target_prefix = "Logging/Redirect"
    }

    cors_rule {
        allowed_headers = [ "*" ]
        allowed_origins = [ "*" ]
        allowed_methods = [ "GET", "POST", "PUT" ]
        expose_headers  = [ ]
        max_age_seconds = 3000
    }
}

resource "aws_s3_bucket" "failover-bucket" {
    bucket = "failover.${local.domain}"

    # ... acl    = "public-read"

    force_destroy = false

    depends_on = [ aws_s3_bucket.logging-bucket ]

    grant {
        permissions = [ "FULL_CONTROL" ]
        type        = "CanonicalUser"
        id          = "d149861738b3b1911e98c75d02ce54fc7f0c1ae602e8c95f2af0dd60599f9091"
    }

    versioning {
        enabled = false
    }

    website {
        index_document = "index.html"
        error_document = "index.html"
    }

    lifecycle_rule {
        id      = "${local.name}-${var.environment}-Failover-Lifecycle-ID"
        enabled = false

        transition {
            storage_class = "INTELLIGENT_TIERING"
        }
    }

    logging {
        target_bucket = aws_s3_bucket.logging-bucket.bucket
        target_prefix = "Logging/Failover"
    }

    cors_rule {
        allowed_headers = [ "*" ]
        allowed_origins = [ "*" ]
        allowed_methods = [ "GET", "POST", "PUT" ]
        expose_headers  = [ ]
        max_age_seconds = 3000
    }
}

resource "aws_s3_bucket_policy" "target-bucket-policy" {
    bucket = aws_s3_bucket.target-bucket.id
    policy = data.aws_iam_policy_document.s3-target-policy.json
}

resource "aws_s3_bucket_policy" "failover-bucket-policy" {
    depends_on = [ aws_s3_bucket.target-bucket ]
    bucket     = aws_s3_bucket.failover-bucket.id
    policy     = data.aws_iam_policy_document.s3-failover-policy.json
}

resource "aws_cloudfront_origin_access_identity" "cdn-identity" {
    comment = "${local.name}-CDN-Identity-ID"
}

resource "aws_cloudfront_distribution" "target-cdn" {
    enabled             = true
    is_ipv6_enabled     = true
    default_root_object = "index.html"

    depends_on = [
        aws_s3_bucket.target-bucket,
        aws_s3_bucket.failover-bucket,
        aws_s3_bucket_policy.target-bucket-policy,
        aws_s3_bucket_policy.failover-bucket-policy,
        aws_s3_bucket.logging-bucket
    ]

    aliases = [ local.domain ]
    comment = "CDN for ${local.name}'s ${var.environment} Environment"

    custom_error_response {
        error_caching_min_ttl = 300

        error_code    = 403
        response_code = 200

        response_page_path = "/index.html"
    }

    origin_group {
        origin_id = "Cluster"

        failover_criteria {
            status_codes = [ 403, 404, 500, 502 ]
        }

        member {
            origin_id = "Primary"
        }

        member {
            origin_id = "Failover"
        }
    }

    origin {
        domain_name = aws_s3_bucket.target-bucket.bucket_regional_domain_name
        origin_id   = "Primary"

        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.cdn-identity.cloudfront_access_identity_path
        }
    }

    origin {
        domain_name = aws_s3_bucket.failover-bucket.bucket_regional_domain_name
        origin_id   = "Failover"

        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.cdn-identity.cloudfront_access_identity_path
        }
    }

    logging_config {
        include_cookies = false
        bucket          = "logging.${local.domain}.s3.amazonaws.com"
        prefix          = "Logging/CDN"
    }

    default_cache_behavior {
        target_origin_id = "Cluster"

        viewer_protocol_policy = "redirect-to-https"

        compress = true

        smooth_streaming = false

        default_ttl = 0
        max_ttl     = 0
        min_ttl     = 0

        allowed_methods = [
            "GET",
            "HEAD",
            "OPTIONS"
        ]

        cached_methods = [
            "HEAD", "GET", "OPTIONS"
        ]

        forwarded_values {
            query_string = true

            headers = [
                "Access-Control-Request-Headers",
                "Access-Control-Request-Method",
                "Origin"
            ]

            cookies {
                forward = "none"
            }
        }
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        acm_certificate_arn      = data.aws_acm_certificate.wildcard-environment-certificate.arn
        minimum_protocol_version = "TLSv1.1_2016"
        ssl_support_method       = "sni-only"
    }

    tags = {
        Name         = "${var.environment}.${local.name}-CDN"
    }
}

//resource "aws_s3_object_copy" "distributions" {
//    for_each = local.targets
//
//    bucket = each.value["bucket"]
//
//    dynamic "source" {
//        for_each = fileset(join("/", [path.cwd, local.source]), "build/**")
//        content {
//            key = source.d
//        }
//    }
//
//    source = join("/", [path.cwd, local.source, "build"]), "build/**")
//    key    = fileset(join("/", [path.cwd, local.source]), "build/**")
//}