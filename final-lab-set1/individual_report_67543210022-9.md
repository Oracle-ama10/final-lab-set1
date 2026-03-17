# INDIVIDUAL_REPORT_67543210022-9.md

## ข้อมูลผู้จัดทำ
- ชื่อ-นามสกุล: นายภูริณัฐ เต๋จ๊ะ
- รหัสนักศึกษา: 67543210022-9
- กลุ่ม: 16

## ขอบเขตงานที่รับผิดชอบ
รับผิดชอบด้านการวางโครงสร้าง Infrastructure และ Security ของระบบใน Set 1 โดยเน้นหนักที่การจัดการ Nginx API Gateway เพื่อรองรับการสื่อสารผ่านโปรโตคอล HTTPS (SSL/TLS) การออกแบบระบบ Centralized Logging ร่วมกับ Log Service และการทำ Container Orchestration ด้วย Docker Compose เพื่อเชื่อมโยงทุก Service เข้าด้วยกัน

## สิ่งที่ได้ดำเนินการด้วยตนเอง
- Security & Gateway: ดำเนินการสร้าง Self-signed Certificate และคอนฟิก Nginx ให้ทำหน้าที่เป็น TLS Termination และจัดการ Redirect HTTP เป็น HTTPS รวมถึงตั้งค่า Rate Limiting เพื่อป้องกันการ Brute-force ในหน้า Login

- Logging Architecture: พัฒนาฟังก์ชัน logEvent ใน Auth และ Task Service เพื่อให้สามารถส่งเหตุการณ์สำคัญ (เช่น Login Fail, Task Created) ไปบันทึกยัง Log Service ผ่าน Internal API

- Service Integration: จัดการเขียนไฟล์ docker-compose.yml โดยใช้ระบบ Network ภายใน เพื่อบล็อกการเข้าถึง Log Service โดยตรงจากภายนอก (Security Hardening)

- API Testing: ดำเนินการทดสอบผ่าน Postman โดยเน้นการตรวจสอบความถูกต้องของ JWT Payload และการจัดการ Error 401/403 ในกรณีที่สิทธิ์ไม่ถูกต้อง

## ปัญหาที่พบและวิธีการแก้ไข
- ปัญหา Browser/Postman บล็อก HTTPS: เนื่องจากใช้ Self-signed Certificate ทำให้ถูกมองว่าไม่ปลอดภัย แก้ไขโดยการตั้งค่า SSL certificate verification: OFF ใน Postman และกด Proceed ใน Browser เพื่อยอมรับความเสี่ยงในสภาพแวดล้อม Development

- ปัญหา JWT Secret Mismatch: ในช่วงแรก Service ต่างๆ ตรวจสอบ Token ไม่ผ่านเนื่องจากตั้งค่า Secret ไม่ตรงกัน แก้ไขโดยการนำ JWT_SECRET ไปจัดการผ่านไฟล์ .env เพื่อให้ทุก Container ใช้ค่าเดียวกันจากจุดเดียว

- ปัญหา Nginx Rate Limit ไม่ทำงาน: พบว่าการตั้งค่า Zone เล็กเกินไปทำให้ทดสอบ T11 ไม่ติด แก้ไขโดยการปรับ rate=5r/m และใช้สคริปต์ curl ยิงรัวๆ เพื่อจำลองการโจมตีจนได้ Status Code 429

## สิ่งที่ได้เรียนรู้จากงานนี้
- เข้าใจลึกซึ้งถึงการทำงานของ Reverse Proxy และการป้องกันระบบในระดับ Gateway

- เรียนรู้การจัดการ Shared Database ในระบบ Microservices เบื้องต้น และความสำคัญของระบบ Log ในการติดตามพฤติกรรมผู้ใช้

- เข้าใจกลไกของ JWT (JSON Web Token) ว่าไม่ใช่แค่การล็อกอิน แต่เป็นการส่งต่อสิทธิ์ (Authorization) ระหว่าง Service โดยไม่ต้อง Query ฐานข้อมูลซ้ำๆ

## แนวทางการพัฒนาต่อไปใน Set 2
ใน Set 2 จะพัฒนาต่อยอดไปสู่สถาปัตยกรรมแบบ Database-per-Service เพื่อลดการพึ่งพิงฐานข้อมูลก้อนเดียว (Single Point of Failure) และจะปรับเปลี่ยนจากการใช้ Nginx Gateway แบบ Local ไปเป็นการใช้ Cloud-native Deployment บน Railway โดยเน้นการจัดการ Environment Variables ที่ซับซ้อนขึ้นและการทำ Auto-create Profile เมื่อมีการ Register สมาชิกใหม่