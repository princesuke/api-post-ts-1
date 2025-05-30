// src/services/createJwtService.ts
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
  type Jwt,
} from "jsonwebtoken";
import type {
  JwtPayload,
  RefreshTokenPayload,
} from "@/interfaces/jwt.interface";
import { env } from "@/config/env.config";
import BadRequestException from "@/exceptions/bad-request.exception";
import { HttpStatus } from "@/types/http.types";

interface IJwtService {
  signToken(payload: JwtPayload): Promise<string>;
  verifyToken(token: string): Promise<Jwt>; // หรืออาจจะเปลี่ยนเป็น Promise<JwtPayload> ถ้าต้องการแค่ Payload
  signRefreshToken(payload: RefreshTokenPayload): Promise<string>; // << เพิ่ม
  verifyRefreshToken(token: string): Promise<Jwt>; // << เพิ่ม
}

const jwtService: IJwtService = {
  signToken: (payload: JwtPayload): Promise<string> => {
    try {
      const token = jwt.sign(payload, env.JWT_SECRET);
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  verifyToken: (token: string): Promise<jwt.Jwt> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded as jwt.Jwt);
      });
    });
  },

  signRefreshToken: (payload: RefreshTokenPayload): Promise<string> => {
    try {
      // Refresh Token มีอายุยาวกว่า (เช่น 7 วัน)
      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
      return Promise.resolve(token);
    } catch (error) {
      console.error("Error signing refresh token:", error);
      throw new BadRequestException(
        "Failed to sign refresh token",
        HttpStatus.SERVER_ERROR
      );
    }
  },

  verifyRefreshToken: (token: string): Promise<Jwt> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            return reject(
              new BadRequestException(
                "Refresh token is expired",
                HttpStatus.UNAUTHORIZED
              )
            );
          }
          if (err instanceof JsonWebTokenError) {
            return reject(
              new BadRequestException(
                "Invalid refresh token",
                HttpStatus.UNAUTHORIZED,
                err
              )
            );
          }
          return reject(
            new BadRequestException(
              "Failed to verify refresh token",
              HttpStatus.SERVER_ERROR,
              err
            )
          );
        }
        resolve(decoded as Jwt);
      });
    });
  },
};

export default jwtService;

// ในไฟล์หลักของแอปพลิเคชัน (เช่น index.ts หรือ app.ts)
// import { env } from "@/config/env.config";
// import { createJwtService } from "@/services/createJwtService";
// const jwtService = createJwtService(env); // Pass the actual env object
// export default jwtService; // หรือส่ง jwtService ไปให้ส่วนที่ต้องการ
