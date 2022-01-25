import AWS from "@cdktf/provider-aws";

type Type = typeof AWS;

const Provider: Type = AWS;

export { Provider };
export type { Type };
export default Provider;