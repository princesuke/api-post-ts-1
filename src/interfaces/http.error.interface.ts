import type { HttpStatus } from "@/types/http.types";

export interface ICreateError extends Error {
  message: string;
  statusCode: HttpStatus;
  details?: any;
}
