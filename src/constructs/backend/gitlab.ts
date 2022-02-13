import { HttpBackend } from "cdktf";

import { Construct } from "constructs";

import { Client } from "../secrets-manager";

enum Environment {
    Development = "Development",
    QA = "QA",
    Staging = "Staging",
    UAT = "UAT",
    Production = "Production"
}

type Environments = keyof typeof Environment;

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

class Remote implements Backend {
    public readonly address: Backend["address"];
    public readonly lockAddress: Backend["lockAddress"];
    public readonly lockMethod: Backend["lockMethod"];
    public readonly password: Backend["password"];
    public readonly skipCertVerification: Backend["skipCertVerification"];
    public readonly unlockAddress: Backend["unlockAddress"];
    public readonly unlockMethod: Backend["unlockMethod"];
    public readonly username: Backend["username"];

    constructor(settings: Backend) {
        this.address = settings.address;
        this.lockAddress = settings.lockAddress;
        this.lockMethod = settings.lockMethod;
        this.password = settings.password;
        this.skipCertVerification = settings.skipCertVerification;
        this.unlockAddress = settings.unlockAddress;
        this.unlockMethod = settings.unlockMethod;
        this.username = settings.username;
    }
}

interface Defaults {
    lockMethod: "POST";
    unlockMethod: "DELETE";
    skipCertVerification: false;
}

class Gitlab implements Input {
    settings?: Remote;
    environment?: Environments;

    readonly Username: Input["Username"];
    readonly Token: Input["Token"];
    readonly Hostname: Input["Hostname"];
    readonly API: Input["API"];
    readonly State: Input["State"];

    readonly defaults?: Defaults = {
        lockMethod: "POST",
        unlockMethod: "DELETE",
        skipCertVerification: false
    };

    static readonly secret = "NPM/Development/API-Gateway-Construct/Terraform/HTTP-State";

    /***
     * Initialize HTTP Attribute(s) & Settings
     *
     * @param { Environments } environment
     * @param { number } project
     *
     * @returns {Promise<Gitlab>}
     */
    public static async initialize(environment: Environments, project: number): Promise<Gitlab> {
        const instance = new Gitlab( await Client.get( Gitlab.secret ) );

        instance.environment = environment;

        instance.settings = instance.backend( project );

        return instance;
    }

    /***
     * The Remote HTTP Backend Construct
     *
     * @param {Construct} scope
     * @returns {HttpBackend}
     */
    public remote(scope: Construct) {
        return new HttpBackend( scope, {
            address: this?.settings?.address ?? "",
            lockAddress: this?.settings?.lockAddress ?? "",
            lockMethod: this?.settings?.lockMethod ?? "",
            password: this?.settings?.password ?? "",
            skipCertVerification: this?.settings?.skipCertVerification ?? false,
            unlockAddress: this?.settings?.unlockAddress ?? "",
            unlockMethod: this?.settings?.unlockMethod ?? "",
            username: this?.settings?.username ?? ""
        } );
    }

    private constructor(input: JSON | String | Generic | null) {
        this.Username = input?.Username;
        this.Token = input?.Token;
        this.Hostname = input?.Hostname;
        this.API = input?.API;
        this.State = input?.State;
    }

    /***
     * @param {number} id - Repository or Project ID
     *
     * @returns {Remote}
     */
    private backend(id: number) {
        return new Remote( {
            ... this.defaults, ... {
                username: this.Username,
                password: this.Token,
                unlockAddress: this.unlock( id ),
                lockAddress: this.lock( id ),
                address: this.address( id )
            }
        } );
    }

    private address(id: number) {
        return [ "https", "://", this.Hostname, "/", this.API, "/", id, "/", this.State, "/", this.environment ].join( "" );
    }

    private unlock(id: number) {
        return [ this.address( id ), "/", "lock" ].join( "" );
    }

    private lock(id: number) {
        return [ this.address( id ), "/", "lock" ].join( "" );
    }
}

type Generic = any;

type VCS = HttpBackend;

export { Gitlab };

export default Gitlab;

export type { VCS };
