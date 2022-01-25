import { API } from "./index.js"

const Test = new API();
await Test.get({
    Bucket: "development-cloud-factory-s3-bucket",
    Key: "node-modules.zip"
}, true);
