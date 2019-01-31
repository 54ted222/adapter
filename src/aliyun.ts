import { Readable } from "stream";

export interface IAliyunContext {

    requestId: string; //本次调用请求的唯一 id，您可以把它记录下来在出现问题的时候方便调查。
    credentials: { //函数计算服务通过扮演您提供的 服务角色 获得的一组临时密钥，其有效时间是 6 小时。您可以在代码中使用它去访问相应的服务（ 例如 OSS ），这就避免了您把自己的 AK 信息写死在函数代码里。
        accessKeyId: string;
        accessKeySecret: string;
        securityToken: string;
    };
    function: { //当前调用的函数的一些基本信息如函数名 / 函数入口 / 函数内存 / 超时时间。
        name: string;
        handler: string;
        memory: number;
        timeout: number;
        initializer: string;
        initializationTimeout: number;
    };
    //当前调用的函数所在的 service 的信息，包括 service 的名字，接入的 SLS 的 logProject 和 logStore 信息，
    //service的版本信息qualifier和version_id，qualifier表示调用函数时指定的service版本或别名，version_id表示实际调用的service版本。
    service: {
        name: string;
        logProject: string;
        logStore: string;
        qualifier: string;
        versionId: string;
    };
    region: string; //当前调用的函数所在区域，如 cn-shanghai。
    accountId: string; //当前调用函数用户的阿里云 account id。
}
export type IAliyunCallback = (error: Error | null , data?: Buffer | object | string) => void;

//不支援
export type IAliyunFunction = (event: Buffer, context: IAliyunContext, callback: IAliyunCallback) => Promise<any>|void;

export type IAliyunInitializer = (context: IAliyunContext, callback: IAliyunCallback) => Promise<any>|void;

export interface IAliyunRequest extends Readable {
    headers: {[key: string]: string}; //map 类型，存放来自 HTTP 客户端的键值对。
    path: string;//string 类型，为 HTTP URL。
    queries: {[key: string]: string | string[]}; //map 类型，存放来自 HTTP URL 中的 query 部分的 key - value 键值对, value 的类型可以为字符串或是数组。
    method: string; //string 类型，HTTP 方法。
    clientIP: string; //string 类型，client 的 IP 地址。
    url: string ; //string 类型，request 的 url。
}

export interface IAliyunResponse {
    setStatusCode(statusCode: number): void; //设置 status code
    setHeader(headerKey: string, headerValue: string): void; //设置 header
    deleteHeader(headerKey: string): void; //删除 header
    send(body: Buffer|string|Readable): void; //发送 body
}

export type IAliyunHttpFunction = (request: IAliyunRequest, response: IAliyunResponse, context: IAliyunContext) => Promise<any>|void;


