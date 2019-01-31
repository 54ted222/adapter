import * as serverless from "./index";

export interface IOpenfaasEvent {
    body: any;
    headers: serverless.IHttpHeaders;
    method ?: string;
    query: any;
    path: string;
}

type IResult = object | string;

export type IOpenfaasCallback = (error: any, functionResult?: IResult) => void;


export interface IOpenfaasContext {
    status (): number;
    status (errorCode: number): IOpenfaasContext | number;

    headers (): serverless.IHttpHeaders;
    headers(headersObj: serverless.IHttpHeaders): IOpenfaasContext;

    succeed(functionResult: IResult): IOpenfaasContext;
    fail(errorCode: number): IOpenfaasContext;
}
