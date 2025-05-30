import { HttpStatus } from "../types/http.types";
import { HttpException } from "./http.exception";

class NotFoundException extends HttpException {
  public statusCode: HttpStatus = HttpStatus.NOT_FOUND;
}

export default NotFoundException;
