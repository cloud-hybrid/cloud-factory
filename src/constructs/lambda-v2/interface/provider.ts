import * as AWS from "@internal/aws";

type Type = typeof AWS;

const Provider: Type = AWS;

export { Provider };
export type { Type };
export default Provider;