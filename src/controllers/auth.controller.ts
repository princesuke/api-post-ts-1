import { env } from "@/config/env.config";
import BadRequestException from "@/exceptions/bad-request.exception";
import type { User } from "@/generated/prisma";
import authService from "@/services/auth.service";
import hashService from "@/services/hash.service";
import jwtService from "@/services/jwt.service";
import type { LoginDTO, RegisterDTO } from "@/types/auth.types";
import { HttpStatus } from "@/types/http.types";
import type { NextFunction, Request, Response } from "express";

interface IAuthController {
  register: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  getMe: (req: Request, res: Response, next: NextFunction) => void;
  refreshToken: (req: Request, res: Response, next: NextFunction) => void;
}

const authController: IAuthController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, phone } = req.body as RegisterDTO;
      if (!email || !password) {
        throw new BadRequestException(
          "email and password are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const existUser: User | null = await authService.findUserByEmail(email);

      if (existUser) {
        throw new BadRequestException(
          "email is already in use",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashPassword = await hashService.hashPassword(password);

      const user: User = await authService.createUser({
        email,
        password: hashPassword,
        phone,
      });

      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  },
  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body as LoginDTO;
      if (!email || !password) {
        throw new BadRequestException(
          "email and password are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const existUser: User | null = await authService.findUserByEmail(email);

      if (!existUser) {
        throw new BadRequestException(
          "email or password is incorrect !",
          HttpStatus.BAD_REQUEST
        );
      }

      const isPasswordMatch = await hashService.comparePassword(
        password,
        existUser.password
      );

      if (!isPasswordMatch) {
        throw new BadRequestException(
          "email or password is incorrect !!",
          HttpStatus.BAD_REQUEST
        );
      }

      const payload = {
        id: existUser.id,
      };

      const accessToken = await jwtService.signToken(payload);
      const refreshToken = await jwtService.signRefreshToken(payload);

      console.log("refreshToken >>", refreshToken);
      console.log("accessToken >>", accessToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // สำคัญมาก: ทำให้ JS เข้าถึงไม่ได้
        secure: env.NODE_ENV === "production", // ใช้ HTTPS เท่านั้นใน Production
        sameSite: "strict", // ป้องกัน CSRF (Cross-Site Request Forgery)
        maxAge: 7 * 24 * 60 * 60 * 1000, // อายุของ Cookie (เช่น 7 วัน) ใน milliseconds
        path: "/api/refresh-token", // หรือ '/' ถ้าคุณต้องการให้ส่งไปทุก path ที่ตรงกัน
      });

      const { password: p, ...user } = existUser;

      res.status(HttpStatus.OK).json({
        accessToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: (req: Request, res: Response, next: NextFunction) => {
    res.json("get me");
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    // 1. ดึง Refresh Token จาก Cookie
    const refreshToken = req.cookies?.refreshToken; // ต้องใช้ `cookie-parser` เพื่อเข้าถึง req.cookies

    if (!refreshToken) {
      throw new BadRequestException(
        "No refresh token found",
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      // 2. Verify Refresh Token
      const decoded = await jwtService.verifyRefreshToken(refreshToken);
      const userIdFromToken = (decoded.payload as { id: string }).id; // ดึง userId จาก payload

      // 3. (สำคัญ!) ตรวจสอบ Refresh Token ใน Database
      // คุณต้องมี Logic ตรงนี้เพื่อตรวจสอบว่า refreshToken ตัวนี้ยัง valid ใน DB และผูกกับ userIdFromToken จริงๆ
      // Example: const storedToken = await getRefreshTokenFromDatabase(userIdFromToken);
      // if (!storedToken || storedToken !== refreshToken) { ... throw error ... }
      console.log(
        `Verifying refresh token for user ${userIdFromToken} against DB...`
      );
      // สมมติว่า verified
      const isTokenValidInDB = true; // Replace with actual DB check
      if (!isTokenValidInDB) {
        throw new BadRequestException(
          "Invalid refresh token in database",
          HttpStatus.UNAUTHORIZED
        );
      }

      // 4. สร้าง Access Token ใหม่
      const newAccessTokenPayload = { id: userIdFromToken }; // อาจจะต้องดึง Role จาก DB อีกที
      const newAccessToken = await jwtService.signRefreshToken(
        newAccessTokenPayload
      );

      // 5. (Optional but Recommended) สร้าง Refresh Token ใหม่ (Rotation)
      // นี่คือการทำ Refresh Token Rotation: ทำให้ Refresh Token ตัวเดิมใช้ไม่ได้
      const newRefreshToken = await jwtService.signRefreshToken({
        id: userIdFromToken,
      });
      // อัปเดต Refresh Token ใน Database ด้วย Token ใหม่
      console.log(
        `Updating refresh token for user ${userIdFromToken} to DB...`
      );
      // Example: await updateRefreshTokenInDatabase(userIdFromToken, refreshToken, newRefreshToken);

      // ส่ง Refresh Token ใหม่กลับใน HttpOnly Cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/refresh-token",
      });

      // 6. ส่ง Access Token ใหม่กลับใน Response Body
      res.status(HttpStatus.OK).json({
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
      });
    } catch (error) {
      // ถ้า verify หรือ database check ล้มเหลว ให้ลบ cookie ออก (ป้องกัน token ค้าง)
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/refresh-token",
      });
      next(error);
    }
  },
};

export default authController;
