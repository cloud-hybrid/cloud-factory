data "aws_canonical_user_id" "current" {}

data "aws_iam_policy_document" "s3-target-policy" {
    statement {
        actions = [ "s3:GetObject" ]
        effect  = "Allow"

        resources = [
            "${aws_s3_bucket.target-bucket.arn}/*"
        ]

        principals {
            type        = "AWS"
            identifiers = [ aws_cloudfront_origin_access_identity.cdn-identity.iam_arn ]
        }
    }
}

data "aws_iam_policy_document" "s3-failover-policy" {
    statement {
        actions = [ "s3:GetObject" ]
        effect  = "Allow"

        resources = [
            "${aws_s3_bucket.failover-bucket.arn}/*"
        ]

        principals {
            type        = "AWS"
            identifiers = [ aws_cloudfront_origin_access_identity.cdn-identity.iam_arn ]
        }
    }
}

data "aws_acm_certificate" "wildcard-certificate" {
    provider    = aws.global
    domain      = "*.${var.hosted-zone-fqdn}"
    types       = [ "AMAZON_ISSUED" ]
    most_recent = true
}

data "aws_acm_certificate" "wildcard-environment-certificate" {
    provider    = aws.global
    domain      = "*.${lower(var.environment)}.${var.hosted-zone-fqdn}"
    types       = [ "AMAZON_ISSUED" ]
    most_recent = true
}

data "archive_file" "sources" {
    type = "zip"
    depends_on = [null_resource.source]
    source_dir = join("/", [path.cwd, "Source"])
    output_path = "Archive.zip"
}

data "archive_file" "distribution" {
    type = "zip"
    depends_on = [null_resource.build]
    source_dir = join("/", [path.cwd, "Source", "build"])
    output_path = "Distribution.zip"
}
