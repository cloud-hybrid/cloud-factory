/***
 * File Descriptor
 * ---------------
 * The File-System Type
 *
 * @augments {FS.Dirent}
 *
 * @interface File
 *
 */

interface File {
    name?: string | null;

    volume?: boolean | null;

    pipe?: boolean | null;

    ephemeral?: boolean | null;

    file?: boolean | null;

    socket?: boolean | null;

    link?: boolean | null;

    directory?: boolean | null;
}

export default File;