export enum HttpStatus {
  // 1xx Informational (ให้ข้อมูล) - ไม่ค่อยได้ใช้ใน enum ลักษณะนี้โดยตรง แต่เพื่อให้ครบถ้วน
  // CONTINUE = 100,
  // SWITCHING_PROTOCOLS = 101,

  // 2xx Success (สำเร็จ)
  OK = 200, // การร้องขอสำเร็จ (มีอยู่แล้ว)
  CREATED = 201, // การร้องขอสำเร็จและมีการสร้าง resource ใหม่ขึ้น (เช่น หลังจากการ POST)
  ACCEPTED = 202, // การร้องขอได้รับการยอมรับเพื่อประมวลผล แต่ยังประมวลผลไม่เสร็จ
  NO_CONTENT = 204, // การร้องขอสำเร็จ แต่ไม่มีเนื้อหาใดๆ ส่งกลับ (เช่น หลังจากการ DELETE)

  // 3xx Redirection (การเปลี่ยนเส้นทาง) - อาจจะไม่ค่อยได้โยนเป็น Exception โดยตรง แต่มีไว้ก็ดี
  // MOVED_PERMANENTLY = 301,
  // FOUND = 302,
  // SEE_OTHER = 303,
  // NOT_MODIFIED = 304,
  // TEMPORARY_REDIRECT = 307,
  // PERMANENT_REDIRECT = 308,

  // 4xx Client Error (ข้อผิดพลาดจากฝั่ง Client)
  BAD_REQUEST = 400, // การร้องขอไม่ถูกต้อง (มีอยู่แล้ว)
  UNAUTHORIZED = 401, // ไม่ได้รับอนุญาต (ต้องมีการยืนยันตัวตน) (มีอยู่แล้ว)
  PAYMENT_REQUIRED = 402, // จำเป็นต้องมีการชำระเงิน (สงวนไว้เพื่ออนาคต)
  FORBIDDEN = 403, // ถูกปฏิเสธการเข้าถึง (ยืนยันตัวตนแล้วแต่ไม่มีสิทธิ์) (มีอยู่แล้ว)
  NOT_FOUND = 404, // ไม่พบ resource ที่ร้องขอ (มีอยู่แล้ว)
  METHOD_NOT_ALLOWED = 405, // ไม่อนุญาตให้ใช้ HTTP method นี้กับ resource ที่ร้องขอ
  NOT_ACCEPTABLE = 406, // Server ไม่สามารถสร้างการตอบสนองที่ Client ยอมรับได้ (ตาม Accept header)
  REQUEST_TIMEOUT = 408, // Client ไม่ได้ส่งการร้องขอภายในเวลาที่ Server กำหนด
  CONFLICT = 409, // การร้องขอขัดแย้งกับสถานะปัจจุบันของ resource (เช่น ข้อมูลซ้ำ)
  GONE = 410, // Resource ที่ร้องขอไม่มีอยู่อีกต่อไปและจะไม่มีตลอดไป
  LENGTH_REQUIRED = 411, // Server ปฏิเสธการร้องขอเนื่องจากไม่ได้ระบุ Content-Length header
  PRECONDITION_FAILED = 412, // เงื่อนไขที่ระบุใน header (เช่น If-Match) ไม่เป็นจริง
  PAYLOAD_TOO_LARGE = 413, // Request entity หรือ payload มีขนาดใหญ่เกินไป
  URI_TOO_LONG = 414, // URI ที่ร้องขอยาวเกินไป
  UNSUPPORTED_MEDIA_TYPE = 415, // ไม่รองรับ media type ของข้อมูลที่ร้องขอ
  UNPROCESSABLE_ENTITY = 422, // (WebDAV; RFC 4918) Request ถูกต้องตามรูปแบบ แต่ไม่สามารถประมวลผลได้เนื่องจาก semantic errors (เช่น validation error ใน field ต่างๆ)
  TOO_MANY_REQUESTS = 429, // ผู้ใช้ส่งการร้องขอมากเกินไปในระยะเวลาที่กำหนด (rate limiting)

  // 5xx Server Error (ข้อผิดพลาดจากฝั่ง Server)
  SERVER_ERROR = 500, // เกิดข้อผิดพลาดภายใน Server (มีอยู่แล้ว - ชื่อเดิม INTERNAL_SERVER_ERROR ก็ใช้ได้)
  NOT_IMPLEMENTED = 501, // Server ไม่รองรับฟังก์ชันการทำงานที่ร้องขอ
  BAD_GATEWAY = 502, // Server (ทำหน้าที่เป็น gateway หรือ proxy) ได้รับการตอบสนองที่ไม่ถูกต้องจาก upstream server
  SERVICE_UNAVAILABLE = 503, // Server ไม่พร้อมให้บริการในขณะนั้น (เช่น overloaded หรืออยู่ระหว่างการบำรุงรักษา)
  GATEWAY_TIMEOUT = 504, // Server (ทำหน้าที่เป็น gateway หรือ proxy) ไม่ได้รับการตอบสนองจาก upstream server ภายในเวลาที่กำหนด
}
