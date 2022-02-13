import { HttpBackend } from "cdktf";
import { Client } from "../secrets-manager";
var Environment;
(function (Environment) {
    Environment["Development"] = "Development";
    Environment["QA"] = "QA";
    Environment["Staging"] = "Staging";
    Environment["UAT"] = "UAT";
    Environment["Production"] = "Production";
})(Environment || (Environment = {}));
class Remote {
    address;
    lockAddress;
    lockMethod;
    password;
    skipCertVerification;
    unlockAddress;
    unlockMethod;
    username;
    constructor(settings) {
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
class Gitlab {
    settings;
    environment;
    Username;
    Token;
    Hostname;
    API;
    State;
    defaults = {
        lockMethod: "POST",
        unlockMethod: "DELETE",
        skipCertVerification: false
    };
    /*** The Magic Constant */
    static secret = "NPM/Development/API-Gateway-Construct/Terraform/HTTP-State";
    /***
     * Initialize HTTP Attribute(s) & Settings
     *
     * @param { Environments } environment
     * @param { number } project
     *
     * @returns {Promise<Gitlab>}
     *
     */
    static async initialize(environment, project) {
        const instance = new Gitlab(await Client.get(Gitlab.secret));
        instance.environment = environment;
        instance.settings = instance.backend(project);
        return instance;
    }
    /***
     * The Remote HTTP Backend Construct
     *
     * @param {Construct} scope
     *
     * @returns {HttpBackend}
     *
     */
    remote(scope) {
        return new HttpBackend(scope, {
            address: this?.settings?.address ?? "",
            lockAddress: this?.settings?.lockAddress ?? "",
            lockMethod: this?.settings?.lockMethod ?? "",
            password: this?.settings?.password ?? "",
            skipCertVerification: this?.settings?.skipCertVerification ?? false,
            unlockAddress: this?.settings?.unlockAddress ?? "",
            unlockMethod: this?.settings?.unlockMethod ?? "",
            username: this?.settings?.username ?? ""
        });
    }
    constructor(input) {
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
     *
     */
    backend(id) {
        return new Remote({
            ...this.defaults, ...{
                username: this.Username,
                password: this.Token,
                unlockAddress: this.unlock(id),
                lockAddress: this.lock(id),
                address: this.address(id)
            }
        });
    }
    address(id) {
        return ["https", "://", this.Hostname, "/", this.API, "/", id, "/", this.State, "/", this.environment].join("");
    }
    unlock(id) {
        return [this.address(id), "/", "lock"].join("");
    }
    lock(id) {
        return [this.address(id), "/", "lock"].join("");
    }
}
export { Gitlab };
export default Gitlab;
//# sourceMappingURL=gitlab.js.map