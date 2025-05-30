import prisma from "@/database/prisma";
import type { User } from "@/generated/prisma";
import { type RegisterDTO } from "@/types/auth.types";

interface IAuthService {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(data: RegisterDTO): Promise<User>;
  findUserById(id: string): Promise<User | null>;
}

const authService: IAuthService = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async createUser(data: RegisterDTO): Promise<User> {
    return prisma.user.create({ data });
  },

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },
};

export default authService;
