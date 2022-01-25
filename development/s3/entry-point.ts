import * as S3 from "./index.js"

const Service = new S3.Client();
await Service.instantiate();

type Client = typeof Service;


interface S3 {
    Client: Client,
    Payload: S3.Payload;
}

console.debug(S3);