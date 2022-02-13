import { HttpBackend } from "cdktf";
import { Construct } from "constructs";
declare enum Environment {
    Development = "Development",
    QA = "QA",
    Staging = "Staging",
    UAT = "UAT",
    Production = "Production"
}
declare type Environments = keyof typeof Environment;
interface Input {
    /*** Gitlab Username - Defaults to "NPM-TF-User" */
    readonly Username?: "NPM-TF-User" | string | undefined;
    /*** Gitlab User's API Token - Token must have API Permission */
    readonly Token?: string | undefined;
    /*** Gitlab Server Hostname */
    readonly Hostname?: string | undefined;
    /*** Gitlab Project API Route - Defaults to "api/v4/projects" */
    readonly API?: "api/v4/projects" | string | undefined;
    /*** Gitlab Project State Route - Defaults to "terraform/state" */
    readonly State?: "terraform/state" | string | undefined;
}
interface Backend {
    readonly address?: string | undefined;
    readonly lockAddress?: string | undefined;
    readonly lockMethod?: string | undefined;
    readonly unlockAddress?: string | undefined;
    readonly unlockMethod?: string | undefined;
    readonly username?: string | undefined;
    readonly password?: string | undefined;
    readonly skipCertVerification?: boolean | undefined;
}
declare class Remote implements Backend {
    readonly address: Backend["address"];
    readonly lockAddress: Backend["lockAddress"];
    readonly lockMethod: Backend["lockMethod"];
    readonly password: Backend["password"];
    readonly skipCertVerification: Backend["skipCertVerification"];
    readonly unlockAddress: Backend["unlockAddress"];
    readonly unlockMethod: Backend["unlockMethod"];
    readonly username: Backend["username"];
    constructor(settings: Backend);
}
interface Defaults {
    lockMethod: "POST";
    unlockMethod: "DELETE";
    skipCertVerification: false;
}
declare class Gitlab implements Input {
    settings?: Remote;
    environment?: Environments;
    readonly Username: Input["Username"];
    readonly Token: Input["Token"];
    readonly Hostname: Input["Hostname"];
    readonly API: Input["API"];
    readonly State: Input["State"];
    readonly defaults?: Defaults;
    static readonly secret = "NPM/Development/API-Gateway-Construct/Terraform/HTTP-State";
    /***
     * Initialize HTTP Attribute(s) & Settings
     *
     * @param { Environments } environment
     * @param { number } project
     *
     * @returns {Promise<Gitlab>}
     */
    static initialize(environment: Environments, project: number): Promise<Gitlab>;
    /***
     * The Remote HTTP Backend Construct
     *
     * @param {Construct} scope
     * @returns {HttpBackend}
     */
    remote(scope: Construct): HttpBackend;
    private constructor();
    /***
     * @param {number} id - Repository or Project ID
     *
     * @returns {Remote}
     */
    private backend;
    private address;
    private unlock;
    private lock;
}
declare type VCS = HttpBackend;
export { Gitlab };
export default Gitlab;
export type { VCS };
