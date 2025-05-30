import { HttpException } from "@/exceptions/http.exception";
import { HttpStatus } from "@/types/http.types";
import type { NextFunction, Request, Response } from "express";

type ErrorResponse = {
  success: false;
  message: string;
  details?: any;
  statusCode: HttpStatus;
  // อาจเพิ่ม field สำหรับ unique error ID สำหรับการติดตามใน logs (correlation ID)
  // errorId?: string;
};

class ErrorHandler {
  static handle(
    err: unknown,
    _req: Request, // เปลี่ยนเป็น req เพื่อเข้าถึงข้อมูล request สำหรับ logging
    res: Response<ErrorResponse>,
    _next: NextFunction
  ) {
    let statusCode: HttpStatus = HttpStatus.SERVER_ERROR;
    let message: string = "Something went wrong on the server.";
    let details: any = undefined;

    // ตรวจสอบว่าเป็น HttpException
    if (err instanceof HttpException) {
      statusCode = err.statusCode;
      message = err.message;
      details = err.details;
    }
    // ตรวจสอบว่าเป็น Error ปกติ
    else if (err instanceof Error) {
      if (process.env.NODE_ENV === "development") {
        message = err.message;
        details = { stack: err.stack };
      } else {
        message = "An unexpected error occurred.";
      }
      statusCode = HttpStatus.SERVER_ERROR;
    }
    // กรณีที่ไม่ใช่ Error (unknown type)
    else {
      // ข้อความเริ่มต้นถูกกำหนดไว้แล้ว
    }

    // ส่ง Response กลับไปยัง Client
    res.status(statusCode).json({
      success: false,
      message,
      details,
      statusCode,
    });
  }
}

export default ErrorHandler;
