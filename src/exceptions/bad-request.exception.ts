import { HttpStatus } from "../types/http.types";
import { HttpException } from "./http.exception";

class BadRequestException extends HttpException {
  public statusCode: HttpStatus = HttpStatus.BAD_REQUEST;
}

export default BadRequestException;
