import FS from "fs";

import Type from "./descriptor.type";

/***
 * File Descriptor
 * ---------------
 * File Descriptor Implementation
 *
 * @augments {FS.Dirent}
 *
 */

class Descriptor implements Type {
    name: string;

    volume: boolean;

    pipe: boolean;

    ephemeral: boolean;

    file: boolean;

    socket: boolean;

    link: boolean;

    directory: boolean;

    /***
     *
     * @param file {FS.Dirent}
     * @constructor
     *
     */

    constructor(file: FS.Dirent | string) {
        const $ = ( typeof file === "string" ) ? FS.lstatSync( file, { throwIfNoEntry: true } ) : file;
        this.name = ( typeof file === "string" ) ? file : file.name;

        this.volume = $.isBlockDevice();
        this.pipe = $.isFIFO();
        this.ephemeral = $.isCharacterDevice();
        this.file = $.isFile();
        this.socket = $.isSocket();
        this.link = $.isSymbolicLink();
        this.directory = $.isDirectory();
    }
}

export { Descriptor };

export default Descriptor;