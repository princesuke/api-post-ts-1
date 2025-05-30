import NotFoundException from "@/exceptions/not-found.exception";
import type { Request, Response, NextFunction } from "express";

class NotFoundMiddleware {
  // Static method เพื่อให้สามารถเรียกใช้ได้โดยไม่ต้องสร้าง instance
  static handle(req: Request, _res: Response, next: NextFunction) {
    next(
      new NotFoundException(
        `resource: ${req.method} ${req.url} could not be found on this server.`
      )
    );
  }
}

export default NotFoundMiddleware;
