/***
 * @name        SSH-Configuration
 * @package     @cloud-technology
 * @summary     ESM SSH Extension
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Module from "module";
import Path from "path";
import Process from "process";

import Entity, { Bastion } from "./entity.js";

const CWD = Process.cwd();

/***
 * Compatability Replacement for `__dirname` (Commonjs)
 *
 * @type {function(): string}
 *
 * @constructor
 *
 * @example
 * >>> const URI = () => Path.normalize(import.meta.url).replace("file" + ":", "");
 *
 */

const URI = () => Path.normalize( import.meta.url ).replace( "file" + ":", "" );
const Directory = () => Path.dirname( URI() );

/***
 * Compatability Replacement for `require` (Commonjs)
 *
 * @type {NodeRequire}
 *
 * @constructor
 *
 * @example
 * >>> const Import = Module.createImport(URI());
 * >>> const Package = Import("package.json");
 *
 */

const Import = Module.createRequire( URI() );

const File = Path.relative( Process.cwd(), Path.join( CWD, "SSH-Utility.config" ) );
const Script = Path.relative( Process.cwd(), Path.join( CWD, "EC2-Script.Bash" ) );

interface Instance {
    alias: string;

    hostname: string;

    key: string;
}

const EC2 = (servers: Instance[] = []) => {
    const Entries: Entity[] = [];

    servers.forEach( ($) => {
        Entries.push( {
            alias: $.alias,
            hostname: $.hostname,
            user: "ec2-user",
            identity: $.key,
            bastion: Proxy.Hostname,
            key: Proxy.Key
        } );
    } );

    return Entries;
};

// const Fleet = Import(Path.join(CWD, "Instances.json"));
//
const Proxy = {
    Name: "Bastion",
    Hostname: ( Process.env[ "NODE_ENV" ] === "production" ) ? "ec2-3-18-168-137.us-east-2.compute.amazonaws.com" : "ec2-13-58-76-0.us-east-2.compute.amazonaws.com",
    Key: "SSH-Key"
};
//
// const Targets: Instance[] = [];
// const Commands: string[] = [];
//
// Fleet.Instances.forEach(($) => {
//     const Keys = Import(Path.join(CWD, "configuration", (process.env["NODE_ENV"] === "production") ? "production" : "development", "SSH-Keys.json")).Mapping;
//
//     const Name = {};
//
//     $.Tags.forEach(($) => {
//         if ( $?.Key === "Name" ) Name.value = $?.Value;
//     });
//
//     const Source = $?.KeyName;
//
//     const Target = Keys[Source];
//
//     if (Target?.Key) {
//         const Identity = Path.relative(Process.cwd(), Path.join(CWD, Target?.Key));
//         if ( Name.value !== Proxy.Name) {
//             const Data = {
//                 "Tags": $.Tags || null,
//                 "AMI-ID": $.ImageId,
//                 "Instance-ID": $.InstanceId,
//                 "Bastion": Proxy.Hostname,
//                 "SSH-Key-Pair": $.KeyName,
//                 "DNS": {
//                     "Public": {
//                         "IP": $.PublicIpAddress || null,
//                         "Name": $.PublicDnsName || null
//                     },
//                     "Private": {
//                         "IP": $.PrivateIpAddress,
//                         "Name": $.PrivateDnsName || null,
//                         "Options": $.PrivateDnsNameOptions
//                     }
//                 },
//                 "Subnet-ID": $.SubnetId,
//                 "VPC-ID": $.VpcId,
//                 "Architecture": $.Architecture,
//                 "IAM-Profile": $.IamInstanceProfile,
//                 "Platform": $.PlatformDetails
//             };
//
//             Targets.push({
//                 alias: Data.DNS.Private.Name,
//                 hostname: Data.DNS.Private.IP,
//                 bastion: Data.Proxy,
//                 key: Identity
//             });
//
//             const Connection = Command(File, Proxy.Hostname, Data.DNS.Private.Name, Identity, Script, Data);
//
//             Commands.push(Connection);
//         }
//     }
// });
//
// const Entries = EC2(Targets);
//
// const Configuration = [];
//
// Entries.forEach(($) => {
//     Configuration.push(
//         Entry({... $})
//     );
// });
//
// FS.writeFileSync("SSH-Utility.config", [Overwrite(), Bastion(Proxy.Name,Proxy.Hostname, Proxy.Key), Configuration.join("\n")].join("\n"));
// FS.writeFileSync("Command-Output.json", JSON.stringify(Commands, null, 4));