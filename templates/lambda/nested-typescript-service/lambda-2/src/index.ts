import {APIGatewayEvent, APIGatewayProxyEventV2, Context, Handler} from "aws-lambda";

type Headers = [header: { key: string, value: string }[]];

/***
 * A Lambda HTTP-based Response Object
 *
 * @see {@link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses-in-requests.html#lambda-generating-http-responses-object|Lambda-Response}
 */

interface Response extends Promise<Object> {
    statusCode: number,
    bodyEncoding: "text" | "base64" | null,
    headers: Headers | null,
    status: string | null,
    statusDescription: string | null
}

/***
 * Default Lambda Context Handler
 *
 * @param event {APIGatewayEvent}
 * @param context {Context}
 *
 */

export const handler: Handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<Response> => {
    return new Promise((resolve) => {
        resolve({
            statusCode: 200,
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({
                Message: "Hello World"
            }, null, 4)
        })
    });
};
