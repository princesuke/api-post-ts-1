import BadRequestException from "@/exceptions/bad-request.exception";
import authService from "@/services/auth.service";
import { HttpStatus } from "@/types/http.types";
import type { NextFunction, Request, Response } from "express";

const authenBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    console.log("userId", userId);
    if (!userId) {
      throw new BadRequestException(
        "userId is required",
        HttpStatus.BAD_REQUEST
      );
    }

    const existUser = await authService.findUserById(userId);

    if (!existUser) {
      throw new BadRequestException(
        "userId is not exist",
        HttpStatus.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authenBody;
