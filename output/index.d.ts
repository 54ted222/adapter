/// <reference types="node" />
import * as aliyun from "./aliyun";
import * as openfaas from "./openfaas";
import * as serverless from "./index";
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
    [header: string]: string | undefined;
}
export declare enum EServerType {
    Openfaas = "Openfaas",
    Aliyun = "Aliyun",
    Test = "Test"
}
export interface IContext {
    serverType: EServerType;
    origin: {
        [key: string]: any;
    };
    requireData: Buffer;
    responseData: Buffer;
    requestHeaders: IHttpHeaders;
    responseHeaders: IHttpHeaders;
    statusCode: number;
    path: string;
    queries: {
        [key: string]: string | string[] | undefined;
    };
    method: string;
}
export interface IOpation {
    handler: (context: IContext) => Promise<any>;
    initializer: (context: IContext) => Promise<any>;
}
export declare function openfaasAdapter(opation: IOpation): {
    handler: (event: openfaas.IOpenfaasEvent, context: openfaas.IOpenfaasContext, callback: openfaas.IOpenfaasCallback) => Promise<void>;
};
export interface IAliyunAdapter {
    initializer: aliyun.IAliyunInitializer;
    handler: aliyun.IAliyunHttpFunction;
}
export declare function aliyunAdapter(sverless: serverless.IOpation): IAliyunAdapter;
