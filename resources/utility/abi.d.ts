/***
 * @example
 * import { Binary } from "./abi";
 *
 * /// Search for `git` ABI
 * const example = () => {
 *     console.log(Binary("git"));
 * }
 *
 * example();
 */
import FS from "fs";
declare const Binary: (bin: string | FS.PathLike) => boolean;
export { Binary };
export default Binary;
