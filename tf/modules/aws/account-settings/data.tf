data "aws_caller_identity" "account" {
    count = var.identity ? 1 : 0
}