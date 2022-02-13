import { Service } from "@cloud-technology/secrets-manager-client";
const $ = new Service();
const Client = await $.initialize();
export { Client };
export default Client;
//# sourceMappingURL=secrets-manager.js.map