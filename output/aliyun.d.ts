/// <reference types="node" />
import { Readable } from "stream";
export interface IAliyunContext {
    requestId: string;
    credentials: {
        accessKeyId: string;
        accessKeySecret: string;
        securityToken: string;
    };
    function: {
        name: string;
        handler: string;
        memory: number;
        timeout: number;
        initializer: string;
        initializationTimeout: number;
    };
    service: {
        name: string;
        logProject: string;
        logStore: string;
        qualifier: string;
        versionId: string;
    };
    region: string;
    accountId: string;
}
export declare type IAliyunCallback = (error: Error | null, data?: Buffer | object | string) => void;
export declare type IAliyunFunction = (event: Buffer, context: IAliyunContext, callback: IAliyunCallback) => Promise<any> | void;
export declare type IAliyunInitializer = (context: IAliyunContext, callback: IAliyunCallback) => Promise<any> | void;
export interface IAliyunRequest extends Readable {
    headers: {
        [key: string]: string;
    };
    path: string;
    queries: {
        [key: string]: string | string[];
    };
    method: string;
    clientIP: string;
    url: string;
}
export interface IAliyunResponse {
    setStatusCode(statusCode: number): void;
    setHeader(headerKey: string, headerValue: string): void;
    deleteHeader(headerKey: string): void;
    send(body: Buffer | string | Readable): void;
}
export declare type IAliyunHttpFunction = (request: IAliyunRequest, response: IAliyunResponse, context: IAliyunContext) => Promise<any> | void;
