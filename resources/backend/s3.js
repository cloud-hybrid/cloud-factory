import { Client } from "../secrets-manager";
class S3 {
    static secret = "NPM/Development/API-Gateway-Construct/Terraform/S3-State";
    accessKey;
    bucket;
    encrypt;
    forcePathStyle;
    key;
    profile;
    secretKey;
    sharedCredentialsFile;
    workspaceKeyPrefix;
    constructor(input) {
        this.accessKey = input?.accessKey;
        this.bucket = input?.bucket;
        this.encrypt = input?.encrypt;
        this.forcePathStyle = input?.forcePathStyle;
        this.key = input?.key;
        this.profile = input?.profile;
        this.secretKey = input?.secretKey;
        this.sharedCredentialsFile = input?.sharedCredentialsFile;
        this.workspaceKeyPrefix = input?.workspaceKeyPrefix;
    }
    static async initialize() {
        return new S3(await Client.get(S3.secret));
    }
}
export { S3 };
export default S3;
//# sourceMappingURL=s3.js.map