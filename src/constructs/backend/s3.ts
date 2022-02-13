import { Client } from "../secrets-manager";

interface Bucket {
    /*** S3 Bucket Name - Required */
    readonly bucket: string;

    /*** Stateful Folder Path - Require */
    readonly key: string;

    /*** Encrypt Stateful Content(s) - Enforced to `true` */
    readonly encrypt?: true;

    /*** Credentials Profile */
    readonly profile?: string;

    /*** Shared Credentials File */
    readonly sharedCredentialsFile?: string;

    /*** AWS Access-Key ID */
    readonly accessKey?: string;

    /*** AWS Secret Access Token */
    readonly secretKey?: string;

    /*** Environment Workspace, Prefix */
    readonly workspaceKeyPrefix?: "Development" | "QA" | "Staging" | "UAT" | "Production";

    /*** Force Path-Like Style - Enforced to `true` */
    readonly forcePathStyle?: true
}

class S3 implements Bucket {
    static secret = "NPM/Development/API-Gateway-Construct/Terraform/S3-State";

    public readonly accessKey: string;
    public readonly bucket: string;
    public readonly encrypt: true;
    public readonly forcePathStyle: true;
    public readonly key: string;
    public readonly profile: string;
    public readonly secretKey: string;
    public readonly sharedCredentialsFile: string;
    public readonly workspaceKeyPrefix: "Development" | "QA" | "Staging" | "UAT" | "Production";

    private constructor(input: JSON | String | Generic | null) {
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

    static async initialize (){
        return new S3(await Client.get( S3.secret ))
    }
}

type Generic = any;

export { S3 };

export default S3;

export type { Bucket };
