const STS = JSON.stringify( {
    Version: "2012-10-17", Statement: [ {
        Action: "sts:AssumeRole", Principal: {
            Service: "lambda.amazonaws.com"
        }, Effect: "Allow", Sid: ""
    } ]
}, null, 4 );

const Attachment = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";

class Policy {
    static sts: string = STS;

    static managed: string = Attachment;
}

export { Policy };
export default Policy;