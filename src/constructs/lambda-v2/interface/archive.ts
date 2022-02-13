import * as Archive from "@cdktf/provider-archive";

const { DataArchiveFile } = Archive;

const File = DataArchiveFile;

type Source = Archive.DataArchiveFileSource;

export { File };
export type { Source };
export default File;