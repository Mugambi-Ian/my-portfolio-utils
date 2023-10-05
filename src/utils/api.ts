import {ApiError} from './types.js';

export const ApiAuthError = new ApiError('unauthorized', 401);
export const ApiBadRequestError = new ApiError('not allowed', 405);
export const ApiPlatformError = new ApiError('bad request', 400);
