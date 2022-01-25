# Common Node.js Code Snippets #

## `import` & `require` ESM Replacements ##

```javascript
/***
 * @author      Jacob B. Sanders
 * @package     @cloud-technology
 * @summary     Module Exports Template
 *
 * @license     BSD 1-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Path from "path";
import Module from "module";
import Process from "process";

/***
 * Compatability (ESM) Replacement for `__dirname` (Common-JS)
 *
 * @type {function(): string}
 * @constructor
 *
 * @example
 *
 * const URI = () => Path.normalize(import.meta.url).replace("file" + ":", "");
 *
 * >>> "index.js"
 *
 */

const URI = () => Path.normalize(import.meta.url).replace("file" + ":", "");
const Directory = () => Path.dirname(URI());
const CWD = Directory();

/***
 * Compatability (ESM) Replacement for `require` (Common-JS)
 *
 * @type {NodeRequire}
 * @constructor
 *
 * @example
 *
 * const Import = Module.createImport(URI());
 * const Package = Import("package.json");
 *
 * >>> { "name": "@organization/example", "version": "0.0.1", "...": "..." }
 *
 */

const Import = Module.createRequire(URI());

const Configuration = Import(Path.join(CWD, "configuration", "Settings.json"));

export { /* ... */ };

export default { /* ... */ };
```
