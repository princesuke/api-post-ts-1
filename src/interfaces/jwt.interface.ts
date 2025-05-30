// src/shared/jwt/interfaces/jwt.interface.ts

export interface IJwtService {
  signToken(payload: JwtPayload): Promise<string>;

  verifyToken(token: string): Promise<boolean>;
}
export type JwtPayload = {
  id: string;
};

export type JwtToken = {
  token: string;
};

export interface RefreshTokenPayload {
  id: string;
  sessionId?: string;
}
