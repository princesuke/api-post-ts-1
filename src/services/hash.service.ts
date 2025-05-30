// src/features/auth/hash.service.ts

import argon2 from "argon2";
import type { IHashService } from "@/interfaces/hash.interface";
import { env, type Env } from "@/config/env.config";

class HashService implements IHashService {
  // ดึงค่าการตั้งค่า Argon2 จาก Environment Variables
  // หากไม่มีใน EnvConfig (สำหรับ testing หรือ fallback) ให้ใช้ค่า default
  private readonly argonConfig = {
    type: argon2.argon2id, // แนะนำให้ใช้ argon2id เพื่อความปลอดภัยสูงสุด
    memoryCost: env.HASHER_MEMORY_COST ** 15 || 2 ** 17, // ตัวอย่าง: 128 MB
    timeCost: env.HASHER_TIME_COST || 8, // ตัวอย่าง: 8 iterations
    parallelism: env.HASHER_PARALLELISM || 1, // ตัวอย่าง: 1 CPU thread
    // คุณอาจเพิ่ม random bytes สำหรับ salt ตรงนี้ก็ได้หากต้องการ แต่ argon2.hash จะสร้าง salt ให้เองโดย default
  };

  public hashPassword(plaintext: string): Promise<string> {
    return argon2.hash(plaintext, this.argonConfig);
  }

  public comparePassword(plaintext: string, hash: string): Promise<boolean> {
    // 🌟 แก้ไขชื่อพารามิเตอร์เป็น 'plaintext'
    return argon2.verify(hash, plaintext);
  }
}

// Export instance ของ HashService เพื่อใช้งานแบบ Singleton
export default new HashService();
