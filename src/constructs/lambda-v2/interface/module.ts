import * as AWS from "@cdktf/provider-aws";

const { cloudwatch, iam, lambdafunction, s3 } = AWS;

const S3 = s3;
const IAM = iam;
const Lambda = lambdafunction;
const Cloudwatch = cloudwatch;

export { Lambda, S3, IAM, Cloudwatch };
export default { Lambda, S3, IAM, Cloudwatch };