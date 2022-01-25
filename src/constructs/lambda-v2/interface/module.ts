import { cloudwatch, iam, lambdafunction, s3 } from "@cdktf/provider-aws";

import * as Function from "@cdktf/provider-aws/lib/lambdafunction/lambda-function";

const S3 = s3;
const IAM = iam;
const Lambda = lambdafunction;
const Cloudwatch = cloudwatch;

export { Lambda, Function, S3, IAM, Cloudwatch };
export default { Lambda, Function, S3, IAM, Cloudwatch };