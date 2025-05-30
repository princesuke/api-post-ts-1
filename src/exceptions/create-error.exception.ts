import type { HttpStatus } from "@/types/http.types";
import type { HttpException } from "./http.exception";

export function createHttpError(
  message: string,
  statusCode: HttpStatus,
  details?: any
): HttpException {
  const error = new Error(message) as HttpException;
  error.statusCode = statusCode;
  error.details = details;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createHttpError);
  }

  return error;
}
