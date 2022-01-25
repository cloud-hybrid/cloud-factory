import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

import { fromIni } from "@aws-sdk/credential-providers";
import { CredentialProvider } from "@aws-sdk/types";
import OS from "os";

import { Commands } from "./commands.js";

interface Credentials {
    accessKeyId: string;
    secretAccessKey: string;
}

/***
 * Secrets Manager Client Credentials
 * ---
 *
 * Creates a credential provider function that reads from a shared credentials file at ~/.aws/credentials and a shared
 * configuration file at ~/.aws/config.
 *
 * Both files are expected to be INI formatted with section names corresponding to
 * profiles.
 *
 * Sections in the credentials file are treated as profile names, whereas profile sections in the config file
 * must have the format of[profile profile-name], except for the default profile.
 *
 * @example
 * const Credentials = new Client();
 * await Credentials.initialize();
 *
 * console.log(Credentials);
 *
 */

class Credential {
    static readonly user = OS.userInfo();

    /*** `AWS_PROFILE` environment variable or a default of `default`. */
    public profile: string = "default";

    /*** AWS_ACCESS_KEY_ID */
    public id?: string;

    /*** AWS_SECRET_ACCESS_KEY */
    public key?: string;

    /*** A function that, when invoked, returns a promise that will be fulfilled with a value of type Credential */

    private readonly settings: CredentialProvider;

    /***
     *
     * @param profile {string} Defaults to `default`
     *
     */

    constructor(profile?: string) {
        this.settings = fromIni( {
            profile: profile ?? this.profile
        } );
    }

    /***
     * Populate the instance $.id & $.key attributes
     *
     * @returns {Promise<Credentials>}
     *
     */

    async initialize(): Promise<Credentials> {
        const $ = await this.settings();

        this.id = $.accessKeyId;
        this.key = $.secretAccessKey;

        return {
            accessKeyId: this.id, secretAccessKey: this.key
        };
    }
}

/***
 * Secrets Manager API Client
 * ---
 *
 * @example
 * const Secrets = new Client();
 * await Secrets.instantiate();
 *
 * console.log(Secrets);
 *
 * @example
 * const API = await (new Client()).instantiate();
 */

class Client extends Credential {
    /*** AWS Secrets Manager API Client */
    public service: SecretsManagerClient = new SecretsManagerClient({});
    public commands?: Commands;

    /*** Given AWS-V3 Change(s), `await Client.instantiate()` must be called after constructor Instantiation */

    constructor() {
        super("default");
    }

    /***
     * Populate the instance `$.service`, and return a callable, functional Secrets-Manager API Client
     *
     * @returns {Promise<SecretsManagerClient>}
     *
     */

    public async instantiate(): Promise<Client> {
        await this.initialize();

        this.commands = Commands(this.service);

        return this;
    }
}

type Manager = SecretsManagerClient;

const Service = new Client();

await Service.instantiate();

export { Service };

export type { Manager };

export default Client;