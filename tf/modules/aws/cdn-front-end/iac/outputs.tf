output "canonical_user_id" {
    value = data.aws_canonical_user_id.current.id
}

output "fqdn" {
    value = local.domain
}

output "cdn" {
    description = "CDN Data Attributes used For Production Downstream CI-CD Hosted-Zone Modification(s) & Provisioning"
    value = {
        id : aws_cloudfront_distribution.target-cdn.id,
        hosted_zone_id : aws_cloudfront_distribution.target-cdn.hosted_zone_id,
        fqdn : aws_cloudfront_distribution.target-cdn.domain_name
    }
}

output "zone" {
    description = "Route53, or DNS, Hosted Zone Information interfaced via CI-CD Job(s) for Dynamic Management of Resource(s)"
    value = {
        id : local.hosted-zone-id,
        fqdn : local.hosted-zone-domain
    }
}

output "certificate" {
    description = "ACM Certificate Information and Data Attributes for Both Target and Production Environments"
    value = {
        input : var.certificate
        data : {
            wildcard-certificate : {
                arn : data.aws_acm_certificate.wildcard-certificate.arn
                status : data.aws_acm_certificate.wildcard-certificate.status
                domain : data.aws_acm_certificate.wildcard-certificate.domain
                latest : data.aws_acm_certificate.wildcard-certificate.most_recent
                tags : data.aws_acm_certificate.wildcard-certificate.tags
                types : data.aws_acm_certificate.wildcard-certificate.types
            }

            wildcard-environment-certificate : {
                arn : data.aws_acm_certificate.wildcard-environment-certificate.arn
                status : data.aws_acm_certificate.wildcard-environment-certificate.status
                domain : data.aws_acm_certificate.wildcard-environment-certificate.domain
                latest : data.aws_acm_certificate.wildcard-environment-certificate.most_recent
                tags : data.aws_acm_certificate.wildcard-environment-certificate.tags
                types : data.aws_acm_certificate.wildcard-environment-certificate.types
            }
        }
    }
}

output "repository" {
    description = "The Source Code Repository Name"
    value = var.repository
}

output "certificate-arn-input" {
    description = "User Provided ARN"
    value = var.certificate
}

output "branch" {
    description = "The Source Code Repository Branch or Revision"
    value = var.branch
}

output "sources" {
    description = "Compiled Assets in Distribution, Relative to the Compiler"
    depends_on = [null_resource.build]
    value = formatlist("%s/%s/%s", path.cwd, var.repository, fileset(join("/", [path.cwd, local.source]), "build/**"))
}

output "uploads" {
    description = "Uploaded Assets in Distribution, Relative to the S3 Location"
    depends_on = [null_resource.build]
    value = [for item in formatlist("%s/%s/%s", path.cwd, var.repository, fileset(join("/", [path.cwd, local.source]), "build/**")) : substr(replace(item, join("/", [path.cwd, var.repository, "build"]), ""), 1, -1)]
}

output "intersections" {
    description = "..."
    depends_on  = [ null_resource.build ]
    value       = setproduct([
        aws_s3_bucket.failover-bucket.bucket,
        aws_s3_bucket.target-bucket.bucket,
        aws_s3_bucket.redirect-target-bucket.bucket
    ], [
    for item in formatlist("%s/%s/%s", path.cwd, var.repository, fileset(join("/", [
        path.cwd,
        local.source
    ]), "build/**")) : substr(replace(item, join("/", [ path.cwd, var.repository, "build" ]), ""), 1, -1)
    ])
}

output "buckets" {
    description = "..."
    depends_on = [null_resource.build]
    value = { for s3 in [aws_s3_bucket.failover-bucket, aws_s3_bucket.target-bucket, aws_s3_bucket.redirect-target-bucket] : s3.bucket => s3 }
}

/// output "remote-state" {
///     description = "..."
///     value = module.state.http-backend
///     sensitive = true
/// }