import * as Serverless from "./index";

export function getEmptyContext(): Serverless.IContext {
    return {
        serverType: Serverless.EServerType.Test,
        origin: { },
        requireData: Buffer.from(""),
        responseData: Buffer.from(""),
        requestHeaders: {},
        responseHeaders: {},
        statusCode: 200,
        path: "",
        queries: {  },
        method: "",
    };
}


