import { rateLimit } from "express-rate-limit";

// กำหนดค่า rate limiter สำหรับ API ทั่วไป
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 นาที
  max: 60, // 20 requests ต่อ IP ต่อนาที
  message: "Too many API requests, please try again after a minute",
});

// กำหนดค่า rate limiter สำหรับการเข้าสู่ระบบ (เข้มงวดกว่า)
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 นาที
  max: 20, // 5 requests ต่อ IP ต่อ 5 นาที
  message: "Too many login attempts, please try again after 5 minutes",
});
