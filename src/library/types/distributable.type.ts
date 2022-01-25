interface Type {
    /*** Name of the Distributable Resource */
    name: string;

    /*** Current Working Directory */
    cwd: string;

    /*** Base Folder Name */
    base: string;

    /*** Source Folder */
    directory: string;

    /*** Distribution Target Folder */
    distribution: string;

    /*** File Path to `package.json` */
    definition: string;

    /*** Distribution Folder Lambda Layer */
    layer: boolean;

    /*** Overwrite Definition for `factory.json` */
    overwrites: object;

    /*** Under Development */
    factory: object | null;
}

export default Type;