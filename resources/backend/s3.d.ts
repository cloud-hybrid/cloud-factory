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
    readonly forcePathStyle?: true;
}
declare class S3 implements Bucket {
    static secret: string;
    readonly accessKey: string;
    readonly bucket: string;
    readonly encrypt: true;
    readonly forcePathStyle: true;
    readonly key: string;
    readonly profile: string;
    readonly secretKey: string;
    readonly sharedCredentialsFile: string;
    readonly workspaceKeyPrefix: "Development" | "QA" | "Staging" | "UAT" | "Production";
    private constructor();
    static initialize(): Promise<S3>;
}
export { S3 };
export default S3;
export type { Bucket };
