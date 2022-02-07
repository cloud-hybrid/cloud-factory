output "default-resource-tags" {
    value = {
        tags = data.aws_default_tags.current.tags
        total = length(data.aws_default_tags.current.tags)
        provider = data.aws_default_tags.current.id
    }
}
