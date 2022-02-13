import type Dirent from "fs";

/***
 * File Descriptor
 * ---------------
 * The File Descriptor Type
 *
 * @augments {Dirent}
 *
 */

interface Type {
    name: string;

    volume: boolean;

    pipe: boolean;

    ephemeral: boolean;

    file: boolean;

    socket: boolean;

    link: boolean;

    directory: boolean;
}

export default Type;
