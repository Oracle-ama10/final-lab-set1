# TEAM_SPLIT.md

## TEAM
- กลุ่มที่: S1-16
- รายวิชา: ENGSE207 Software Architecture

## Team Members
- 67543210022-9 นายภูริณัฐ เต๋จ๊ะ

## Work Allocation

### Student 1: นายภูริณัฐ เต๋จ๊ะ
ในฐานะผู้พัฒนาเพียงผู้เดียว (Solo Developer) ได้รับผิดชอบการออกแบบและวางรากฐานสถาปัตยกรรม Microservices ทั้งหมดใน Set 1 ดังนี้:
1. Nginx & Infrastructure: ออกแบบ API Gateway โดยเน้นด้าน Security เป็นหลัก ตั้งค่าการเข้ารหัสข้อมูลผ่าน HTTPS (Self-signed Certificate) และวางระบบ Rate Limiting เพื่อควบคุม Traffic ป้องกันการถูกโจมตีแบบ Brute-force
2. Security & Authentication (Auth Service): พัฒนาระบบยืนยันตัวตนโดยใช้ JWT (JSON Web Token) และการจัดเก็บรหัสผ่านที่ปลอดภัยด้วย bcrypt รวมถึงการจัดการ Token Payload เพื่อส่งต่อสิทธิ์ไปยัง Service อื่นๆ
3. Task Management (Task Service): พัฒนาส่วน Business Logic สำหรับจัดการ Tasks ทั้งหมด พร้อมติดตั้ง Auth Middleware เพื่อคัดกรองสิทธิ์การเข้าถึง (RBAC) ระหว่างสมาชิกทั่วไปและผู้ดูแลระบบ
4. Centralized Logging (Log Service): ออกแบบระบบบันทึก Log กลางที่รองรับการรับข้อมูลจาก Service ภายในผ่าน Internal API และเปิด Endpoint พิเศษสำหรับ Admin ให้สามารถตรวจสอบ Audit Trail ได้
5. Database Design: ออกแบบ Shared Database Schema บน PostgreSQL สำหรับการจัดเก็บข้อมูล Users, Tasks และ Logs รวมถึงการทำ Data Seeding เพื่อให้ระบบพร้อมใช้งานทันทีหลัง Deploy
6. Containerization: จัดการทำ Dockerization ให้กับทุก Service และเขียนไฟล์ docker-compose.yml เพื่อควบคุมลำดับการรันของ Container (Depends_on) และการจัดการ Network ภายในที่ปลอดภัย
7. Frontend Development: พัฒนาหน้าเว็บแบบ Single Page Application (SPA) จำนวน 2 หน้า (Task Board และ Log Dashboard) โดยเน้นความง่ายในการใช้งานและการแสดงผลข้อมูลจาก Microservices แบบ Real-time

## Total Ownership (Responsibilities)
- Architecture Mapping: ออกแบบแผนผังความสัมพันธ์ (Diagram) และการไหลของข้อมูลระหว่าง Nginx, Backend และ Database ด้วยตนเอง
- Full-stack Debugging: แก้ไขปัญหาทางเทคนิคในทุกระดับชั้น ตั้งแต่ปัญหา SSL/TLS ใน Nginx, ปัญหา JWT Mismatch ใน Backend ไปจนถึงการจัด Layout ใน Frontend
- End-to-End Testing: ดำเนินการทดสอบระบบผ่าน Postman อย่างเข้มงวด ทั้งแบบ Positive และ Negative Test เพื่อจำลองสถานการณ์การเข้าถึงที่ไม่มีสิทธิ์ (401/403) และการส่งคำขอถี่เกินกำหนด (429)
- Documentation & Reporting: รวบรวมหลักฐานการทดสอบ จัดทำ Screenshots และเขียนรายงาน INDIVIDUAL_REPORT และ README.md เพื่ออธิบายรายละเอียดทางสถาปัตยกรรมให้ครบถ้วน

## Reason for Work Split
- การเลือกรับผิดชอบทุกส่วนด้วยตนเองช่วยให้เห็นภาพรวมของ Microservices Interaction ได้ชัดเจนที่สุด ลดปัญหาเรื่องการสื่อสารระหว่างการเชื่อมต่อ API (Integration Friction) และช่วยให้สามารถควบคุม Security Hardening ได้ในทุกจุดตั้งแต่ Gateway จนถึงฐานข้อมูล
- ช่วยให้การบริหารจัดการ Environment Variables และ Shared Secrets เป็นไปอย่างสม่ำเสมอในทุก Service ส่งผลให้ระบบมีความเสถียรและบำรุงรักษาได้ง่าย

## Integration Notes
- Security Flow: ทุกการร้องขอจากภายนอกต้องผ่าน Nginx (443) เท่านั้น โดย Nginx จะทำหน้าที่ตรวจสอบ HTTPS และทำ Rate Limit ก่อนจะส่งต่อ (Proxy Pass) ไปยัง Service ภายใน
- Identity Flow: เมื่อ Login ผ่าน Auth Service จะได้รับ JWT ซึ่งจะถูกนำไปใช้เป็น "กุญแจ" ในการเรียกใช้ Task Service และ Log Service โดยอาศัยรหัสลับเดียวกัน (Shared JWT_SECRET) ในการตรวจสอบ
- Observability Flow: Auth และ Task Service จะส่งข้อมูลเหตุการณ์สำคัญ (Events) ไปยัง Log Service ผ่านพอร์ตภายในที่ Nginx บล็อกไว้ เพื่อความปลอดภัยสูงสุดของข้อมูล Log