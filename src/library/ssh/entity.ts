/***
 * @name        Host SSH-Entry
 * @package     @cloud-technology
 * @summary     ESM SSH Extension
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import OS from "os";
import Path from "path";

/***
 * User Information (OS)
 *
 * @type {{uid: number, gid: number, shell: string, username: string, homedir: string}}
 *
 */

const User = { ... OS.userInfo() };

const Default = {
    SSH: Path.join( User.homedir, ".ssh", "id_rsa" ),
    Username: User.username,
    Bastion: "localhost",
    Alias: "Local-Host",
    IP: "127.0.0.1"
};

/***
 * Create SSH Configuration Entry
 *
 * @param alias {String} Target SSH Configuration Common-Name
 * @param hostname {String} Target SSH Hostname
 * @param user {String} Target SSH Username
 * @param identity {String} System Path Location of Target Remote SSH-Private Key
 * @param key {String} System Path Location of Proxy (Bastion) SSH-Private Key
 * @param bastion {String} Target Bastion Host
 *
 * @return {string}
 *
 * @constructor
 *
 * @example
 *
 * console.log(Entry());
 *
 * >>> Host Local-Host
 * >>>     Hostname 127.0.0.1
 * >>>     User Jacob-Sanders
 * >>>     IdentityFile /Users/Jacob-Sanders/.ssh/id_rsa
 * >>>     ProxyCommand ssh localhost nc %h %p
 *
 */

interface Entity {
    /*** Target SSH Configuration Common-Name */
    alias: string;

    /*** Target SSH Hostname */
    hostname: string;

    /*** Target SSH Username */
    user: string;

    /*** System Path Location of Target Remote SSH-Private Key */
    identity: string;

    /*** System Path Location of Proxy (Bastion) SSH-Private Key */
    key: string;

    /*** Target Bastion Host */
    bastion: string;
}

const Entry = (configuration: Entity) => {
    return [ [ "Host", configuration.alias ].join( " " ), [ "   ", "Hostname", configuration.hostname ].join( " " ), [ "   ", "User", configuration.user ].join(
        " " ), [ "   ", "IdentityFile", configuration.identity ].join( " " ), [ "   ", "ConnectTimeout", "15" ].join(
        " " ), [ "   ", "LogLevel", "QUIET" ].join( " " ), [ "   ", "ProxyCommand", "ssh", configuration.bastion, "-i", configuration.key, "-W", "%h:%p" ].join(
        " " ), [ "" ].join() ].join( "\n" );
};

/***
 * @Task - Add Summary
 *
 * @param alias
 * @param hostname
 * @param key
 *
 * @constructor
 *
 */

const Bastion = (alias: string, hostname: string, key: string) => {
    return [ [ "Host", alias ].join( " " ), [ "   ", "Hostname", hostname ].join( " " ), [ "   ", "User", "ec2-user" ].join(
        " " ), [ "   ", "IdentityFile", key ].join( " " ), [ "" ].join() ].join( "\n" );
};

const Overwrite = () => {
    return [ [ "Host", "*" ].join( " " ), [ "   ", "StrictHostKeyChecking", "no" ].join( " " ), [ "   ", "UserKnownHostsFile", "/dev/null" ].join(
        " " ), [ "" ].join() ].join( "\n" );
};

export { Entry, Overwrite, Bastion, User, Default };

export default Entity;