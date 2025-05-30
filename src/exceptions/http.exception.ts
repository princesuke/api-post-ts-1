import type { HttpStatus } from "@/types/http.types";

export abstract class HttpException extends Error {
  // public abstract statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus, public details?: any) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
