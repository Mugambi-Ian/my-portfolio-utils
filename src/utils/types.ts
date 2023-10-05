/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from 'express';

export class ApiError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

export function response_success(body: Record<string, any>, message?: string) {
  return (
    JSON.stringify({
      message,
      success: true,
      payload: body,
    }),
    {
      status: 200,
    }
  );
}
export function response_failed(body: Record<string, any>, status?: number) {
  return (
    JSON.stringify({
      success: false,
      payload: body,
    }),
    {
      status: status || 500,
    }
  );
}

export const request_server = async (
  req: Request,
  res: Response,
  callback: (
    r: Request,
    s: Response
  ) => Promise<Response<any, Record<string, any>>>
) => {
  try {
    await callback(req, res);
  } catch (error: any) {
    console.log(error);
    res.send(JSON.stringify({error})).status(error.code || 500);
  }
};
