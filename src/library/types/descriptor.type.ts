/***
 * File Descriptor
 * ---------------
 * The File Descriptor Type
 *
 * @augments {FS.Dirent}
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