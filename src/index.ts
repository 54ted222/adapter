
import * as aliyun from "./aliyun";
import * as openfaas from "./openfaas";
import * as serverless from "./index";
import * as util from "./util";
import * as getRawBody from "raw-body";

export interface IHttpHeaders {
    "accept"?: string;
    "access-control-allow-origin"?: string;
    "access-control-allow-credentials"?: string;
    "access-control-expose-headers"?: string;
    "access-control-max-age"?: string;
    "access-control-allow-methods"?: string;
    "access-control-allow-headers"?: string;
    "accept-patch"?: string;
    "accept-ranges"?: string;
    "age"?: string;
    "allow"?: string;
    "alt-svc"?: string;
    "authorization"?: string;
    "cache-control"?: string;
    "connection"?: string;
    "content-disposition"?: string;
    "content-encoding"?: string;
    "content-language"?: string;
    "content-length"?: string;
    "content-location"?: string;
    "content-range"?: string;
    "content-type"?: string;
    "cookie"?: string;
    "date"?: string;
    "expect"?: string;
    "expires"?: string;
    "forwarded"?: string;
    "from"?: string;
    "host"?: string;
    "if-match"?: string;
    "if-modified-since"?: string;
    "if-none-match"?: string;
    "if-unmodified-since"?: string;
    "last-modified"?: string;
    "location"?: string;
    "pragma"?: string;
    "proxy-authenticate"?: string;
    "proxy-authorization"?: string;
    "public-key-pins"?: string;
    "range"?: string;
    "referer"?: string;
    "retry-after"?: string;
    "set-cookie"?: string;
    "strict-transport-security"?: string;
    "trailer"?: string;
    "transfer-encoding"?: string;
    "tk"?: string;
    "upgrade"?: string;
    "user-agent"?: string;
    "vary"?: string;
    "via"?: string;
    "warning"?: string;
    "www-authenticate"?: string;
    [header: string]: string  | undefined;
}

export enum EServerType {
    Openfaas= "Openfaas",
    Aliyun= "Aliyun",
    Test= "Test",
}

export interface IContext {
    serverType: EServerType;
    origin: { [key: string]: any };
    requireData: Buffer;
    responseData: Buffer;
    requestHeaders: IHttpHeaders;
    responseHeaders: IHttpHeaders;
    statusCode: number;
    path: string;
    queries: { [key: string]: string | string[] | undefined };
    method: string;
    // clientIP: string;
    // url: string;
}


export interface IOpation {
    handler: (context: IContext) => Promise<any>;
    initializer: (context: IContext) =>  Promise<any>;
}

export function openfaasAdapter(opation: IOpation) {
    const servCtx = util.getEmptyContext();
    servCtx.serverType = serverless.EServerType.Openfaas;
    return {
        handler: async (event: openfaas.IOpenfaasEvent, context: openfaas.IOpenfaasContext, callback: openfaas.IOpenfaasCallback) => {
            servCtx.method = event.method!;
            servCtx.requireData = Buffer.from(event.body);
            servCtx.origin = { event, context };
            servCtx.queries = event.query;
            servCtx.requestHeaders = event.headers;
            servCtx.path = event.path;
            servCtx.responseHeaders = context.headers();
            //servCtx.statusCode = context.status();
            try {
                await opation.initializer(servCtx);
                await opation.handler(servCtx);
            } catch (error) {
                context.fail(error);
                return;
            }
            context.succeed(servCtx.responseData.toString());
            context.status(servCtx.statusCode);
            context.headers(servCtx.responseHeaders);
        },
    };
}



export interface IAliyunAdapter  {
    initializer: aliyun.IAliyunInitializer;
    handler: aliyun.IAliyunHttpFunction;
}

export function aliyunAdapter(sverless: serverless.IOpation): IAliyunAdapter {
    const servCtx = util.getEmptyContext();
    servCtx.serverType = serverless.EServerType.Aliyun;
    return {

        initializer: async (context: aliyun.IAliyunContext, callback: aliyun.IAliyunCallback) => {
            servCtx.origin = { context };
            try {
                await sverless.initializer(servCtx);
                callback(null, "");
            } catch (error) {
                callback(error);
            }
        },//initializer

        handler: async (request: aliyun.IAliyunRequest, response: aliyun.IAliyunResponse, context: aliyun.IAliyunContext) => {
            servCtx.origin = { request, response, context };
            servCtx.requestHeaders = request.headers;
            servCtx.queries = request.queries;
            servCtx.path = request.path;
            servCtx.method = request.method;

            try {
                servCtx.requireData = await getRawBody(request);
                const handler = await sverless.handler(servCtx);
                Object.entries(servCtx.responseHeaders).forEach((keyValue) => {
                    if (keyValue[1] === undefined) return;
                    response.setHeader(keyValue[0], keyValue[1]);
                });
                response.setStatusCode(servCtx.statusCode);
                response.send(servCtx.responseData);
            } catch (error) {
                throw error;
            }
        },//handler


    };//return
}//adapter func

