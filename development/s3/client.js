import OS from "os";

import { S3Client } from "@aws-sdk/client-s3";

import { fromIni } from "@aws-sdk/credential-providers";

/***
 * S3 Client Credentials
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
    /***
     * Returns information about the currently effective user. On POSIX platforms, this is typically a subset of the
     * password file. The returned object includes the username, uid, gid, shell, and homedir. On Windows, the uid
     * andgid fields are -1, and shell is null. The value of homedir returned by os.userInfo() is provided by the
     * operating system. This differs from the result of os.homedir(), which queries environment variables for the home
     * directory before falling back to the operating system response.
     *
     * Throws a SystemError if a user has no username or homedir.
     *
     */

    user = OS.userInfo();

    /*** `AWS_PROFILE` environment variable or a default of `default`. */
    profile = "default";

    /*** AWS_ACCESS_KEY_ID */
    id = null;

    /*** AWS_SECRET_ACCESS_KEY */
    key = null;

    /***
     * A function that, when invoked, returns a promise that will be fulfilled with a value of type Credential
     *
     * @type {import("@aws-sdk/types").CredentialProvider}
     * */

    settings = null;

    /***
     *
     * @param profile {string} Defaults to `default`
     *
     */

    constructor(profile = null) {
        this.settings = fromIni( {
            profile: profile ?? this.profile
        } );
    }
}

/***
 * S3 API Client
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
    /***
     * AWS S3 API Client
     *
     * @type {import("@aws-sdk/types").Client | import("@aws-sdk/client-s3").S3Client}
     */
    service;

    /*** Given AWS-V3 Change(s), `await Client.instantiate()` must be called after constructor Instantiation */

    constructor() {
        super();
    }

    /***
     * Populate the instance `$.service`, and return a callable, functional S3 API Client
     *
     * @returns {Promise<import("@aws-sdk/client-s3").S3Client>}
     *
     */

    async instantiate() {
        const credentials = await this.settings();

        this.id = credentials.accessKeyId;
        this.key = credentials.secretAccessKey;

        this.credentials = {
            accessKeyId: this.id, secretAccessKey: this.key
        }

        this.service = new S3Client({... this.credentials});

        return this.service;
    }
}

export { Client };

export default Client;